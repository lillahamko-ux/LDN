#!/usr/bin/env python3
"""
Mirror the ldn.framer.website homepage into a self-contained static site.

Framer has no export feature, so this copies the published output: it walks the
JS module graph, pulls every image/font/script it references, and rewrites all
absolute framerusercontent.com / fonts.gstatic.com URLs to local relative paths.

Re-run it any time the Framer site is republished (build hashes change, so pass
--clean to drop chunks belonging to the previous build).

    python3 tools/mirror-framer.py [--clean]
"""
import re, os, sys, shutil, hashlib, urllib.request, urllib.parse, concurrent.futures

SRC = "https://ldn.framer.website/"
SITE = "https://lisbondigitalnomads.vercel.app"   # where the mirror is hosted
OG_SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "brand", "og-image.jpg")
OG_REL = "assets/images/og-lisbon-digital-nomads.jpg"
OG_ALT = "People talking over drinks at a rooftop bar in Lisbon at sunset"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "framer-export")
OUT = os.path.normpath(OUT)
UA  = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
       "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")

# Stops at backticks/commas/braces so URLs inside JS template literals and
# comma-separated srcset attributes don't run together.
URL_RE = re.compile(r'https?://[^\s"\'<>)\\`,{}\[\]]+')


def fetch(url, binary=True):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "replace")


def is_asset(url):
    host = urllib.parse.urlsplit(url).netloc
    return host.endswith("framerusercontent.com") or host.endswith("fonts.gstatic.com")


def local_path(url):
    """Map a remote asset URL to its path inside the mirror."""
    p = urllib.parse.urlsplit(url)
    name = p.path.rsplit("/", 1)[-1]
    stem, dot, ext = name.rpartition(".")
    if not dot:
        stem, ext = name, "bin"
    if p.query:
        q = urllib.parse.parse_qs(p.query)
        # srcset variants share width/height and differ only by scale-down-to,
        # so that has to win or every variant collides onto one file.
        if "scale-down-to" in q:
            stem = f"{stem}_{q['scale-down-to'][0]}w"
        elif "width" in q and "height" in q:
            stem = f"{stem}_{q['width'][0]}x{q['height'][0]}"
        else:
            stem = f"{stem}_{hashlib.sha1(p.query.encode()).hexdigest()[:8]}"
    ext = ext.lower()
    folder = ("assets/images" if ext in ("jpg", "jpeg", "png", "webp", "gif", "svg", "avif")
              else "assets/media" if ext in ("mp4", "webm", "mov", "m4v", "ogv")
              else "assets/fonts" if ext in ("woff2", "woff", "ttf", "otf")
              else "assets/scripts" if ext == "mjs"
              else "assets/data" if ext == "json"
              else "assets/misc")
    return f"{folder}/{stem}.{ext}"


def save(rel, data):
    full = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    payload = data if isinstance(data, bytes) else data.encode("utf-8")
    with open(full, "wb") as f:
        f.write(payload)
    return len(payload)



def disable_editor_bar(body):
    """Neutralise Framer's on-page editor bar.

    The published runtime lazily does `await import("https://framer.com/edit/init.mjs")`
    behind a guard of the form `x===void 0?void 0:(()=>{...})()`. Forcing that guard
    leaves the property `undefined` -- a state the runtime already handles, since it
    is what you get whenever the editor is unavailable. Without this the mirror calls
    framer.com on every page load and the injected editor bar reflows the whole page.
    """
    marker = "https://framer.com/edit/"
    guard, forced = "===void 0?void 0:", "===void 0||!0?void 0:"
    hits, pos = 0, 0
    while True:
        i = body.find(marker, pos)
        if i == -1:
            break
        g = body.rfind(guard, pos, i)
        if g == -1:
            if forced not in body[max(0, i - 400):i]:
                print("  !! editor import found but no guard to neutralise")
            pos = i + len(marker)
            continue
        body = body[:g] + forced + body[g + len(guard):]
        hits += 1
        pos = i + len(marker)
    if hits:
        print(f"  editor bar disabled ({hits} call site{'s' if hits > 1 else ''})")
    return body


def remove_badge(html):
    """Strip the "Made in Framer" badge from the server-rendered markup.

    Framer prints the badge into `<div id="__framer-badge-container">`, whose
    subtree nests divs -- so match `</div>` by depth rather than by regex.
    `disable_badge()` handles the client half; both are needed, or the runtime
    just paints the badge back over the hole this leaves.
    """
    anchor = '<div id="__framer-badge-container">'
    i = html.find(anchor)
    if i == -1:
        print("  !! badge container not found in markup")
        return html
    tag, depth, j = re.compile(r"<div\b|</div>"), 0, i
    while True:
        m = tag.search(html, j)
        if m is None:
            print("  !! badge container never closed -- left in place")
            return html
        depth += -1 if m.group() == "</div>" else 1
        j = m.end()
        if depth == 0:
            break
    print(f"  badge markup removed ({j - i} bytes)")
    return html[:i] + html[j:]


def disable_badge(body):
    """Stop the runtime re-rendering the badge `remove_badge()` just stripped.

    script_main ends with `(function(){q&&v(()=>{g(document.getElementById(
    `__framer-badge-container`), <lazy badge>)})})()`. The guard `q` is "are we in
    a document" and its name is reminted every build, so find it positionally
    rather than by name and pin it to `false`: the branch short-circuits, so the
    container is never looked up (it is gone -- hydrating null would throw) and
    the badge chunk is never imported.
    """
    marker = "__framer-badge-container"
    i = body.find(marker)
    if i == -1:
        return body
    head = body.rfind("(function(){", 0, i)
    m = (re.compile(r"\(function\(\)\{([A-Za-z_$][\w$]*)&&").match(body, head)
         if head != -1 else None)
    if m is None:
        print("  !! badge hydration found but its guard was not recognised")
        return body
    print("  badge hydration disabled")
    return body[:m.start(1)] + "false" + body[m.end(1):]


def set_og_image(html):
    """Point the social-preview tags at our own image on our own domain.

    Three things are wrong with what Framer publishes, from this mirror's point
    of view. The image is referenced by a RELATIVE path, which scrapers do not
    reliably resolve; `og:url` still names the Framer site, and Facebook treats
    that as the canonical target, so sharing this domain would pull the Framer
    site's card instead of ours; and the file itself lives under framer-export/,
    which `--clean` deletes. So the image is kept in brand/ and copied in here,
    and every URL written below is absolute.
    """
    dest = os.path.join(OUT, OG_REL)
    if not os.path.exists(OG_SRC):
        print(f"  !! {OG_SRC} missing -- social tags left as Framer published them")
        return html
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copyfile(OG_SRC, dest)

    url = f"{SITE}/{OG_REL}"
    tags = {
        'property="og:image"': [
            f'<meta property="og:image" content="{url}">',
            f'<meta property="og:image:secure_url" content="{url}">',
            '<meta property="og:image:type" content="image/jpeg">',
            '<meta property="og:image:width" content="1200">',
            '<meta property="og:image:height" content="630">',
            f'<meta property="og:image:alt" content="{OG_ALT}">'],
        'name="twitter:image"': [
            f'<meta name="twitter:image" content="{url}">',
            f'<meta name="twitter:image:alt" content="{OG_ALT}">'],
        'property="og:url"': [f'<meta property="og:url" content="{SITE}/">'],
    }
    for needle, replacement in tags.items():
        pattern = re.compile(r"<meta [^>]*" + re.escape(needle) + r"[^>]*>")
        if not pattern.search(html):
            print(f"  !! no <meta {needle}> to replace")
            continue
        html = pattern.sub("".join(replacement), html, count=1)
    print(f"  social preview -> {OG_REL}")
    return html


def retarget_domain(text):
    """Repoint the site's own address at where the mirror actually lives.

    Framer bakes its published hostname into two places that both mean "this
    site's canonical address": `<link rel="canonical">` in the markup, and
    `siteCanonicalURL` in the runtime. Left alone they tell Google the Framer
    site is the authoritative copy of this page, which is wrong once this
    mirror is the page people are sent to -- it hands the old domain the
    ranking and makes this one look like a duplicate.
    """
    old = SRC.rstrip("/")
    if old not in text:
        return text
    return text.replace(old, SITE)


def rewrite(text, depth):
    """Repoint absolute asset URLs at local copies. depth = folders below root."""
    up = "../" * depth
    def sub(m):
        raw = m.group(0)
        u = raw.replace("&amp;", "&").rstrip(".,;")
        # Skip anything without a filename: bare origins (preconnect hints) and
        # directory prefixes, which Framer compares against with startsWith() to
        # classify font sources. Rewriting those corrupts the comparison.
        if not is_asset(u) or not urllib.parse.urlsplit(u).path.rsplit("/", 1)[-1]:
            return raw
        return up + local_path(u)
    return URL_RE.sub(sub, text)


def main():
    if "--clean" in sys.argv and os.path.isdir(OUT):
        shutil.rmtree(OUT)
        print("cleaned previous mirror")

    print("fetching homepage ...")
    html = fetch(SRC, binary=False)
    stamp = re.search(r'<!-- Published ([^>]*?) -->', html)
    if stamp:
        print(f"  build: {stamp.group(1)}")

    # ---- walk the module graph (imports appear in both quotes and backticks)
    modules, seen = {}, set()
    queue = [u for u in set(URL_RE.findall(html.replace("&amp;", "&")))
             if is_asset(u) and u.endswith(".mjs")]
    while queue:
        url = queue.pop()
        if url in seen:
            continue
        seen.add(url)
        try:
            body = fetch(url, binary=False)
        except Exception as e:
            print(f"  !! {url} -> {e}")
            continue
        modules[url] = body
        base = url.rsplit("/", 1)[0] + "/"
        for spec in re.findall(r'["\'`](\./[^"\'`]+\.mjs)["\'`]', body):
            queue.append(urllib.parse.urljoin(base, spec))
        for u in URL_RE.findall(body):
            if is_asset(u) and u.endswith(".mjs"):
                queue.append(u)
    print(f"js modules: {len(modules)}")

    # Component chunks build image URLs at runtime:
    #     new URL(`assets/512/x.jpg`, `https://framerusercontent.com/modules/<a>/<b>/y.js`)
    # Nothing in the markup points at those files, so resolve each one against its
    # base, then rebase the call on import.meta.url and store the image beside the
    # module -- that way the same expression resolves locally wherever it is hosted.
    NEWURL_RE = re.compile(
        r'new URL\((["\'`])((?:\./)?assets/[^"\'`]+)\1\s*,\s*(["\'`])'
        r'(https://framerusercontent\.com/[^"\'`]+)\3\s*\)')
    runtime = {}
    for mod_url, body in list(modules.items()):
        def sub(m):
            quote, rel, base = m.group(1), m.group(2), m.group(4)
            target = "assets/scripts/" + rel.lstrip("./")
            absolute = urllib.parse.urljoin(base, rel)
            if runtime.get(target, absolute) != absolute:
                print(f"  !! collision on {target}")
            runtime[target] = absolute
            return f"new URL({quote}{rel}{quote}, import.meta.url)"
        modules[mod_url] = NEWURL_RE.sub(sub, body)
    print(f"runtime-built assets: {len(runtime)}")

    def grab_runtime(item):
        target, url = item
        dest = os.path.join(OUT, target)
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            return target, None, "cached"
        try:
            return target, fetch(url), None
        except Exception as e:
            return target, None, e

    rt_bytes, rt_failed = 0, []
    with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
        for target, data, err in ex.map(grab_runtime, sorted(runtime.items())):
            if err and err != "cached":
                rt_failed.append((target, err))
            elif data is not None:
                rt_bytes += save(target, data)
    print(f"runtime assets fetched: {rt_bytes/1e6:.1f} MB"
          + (f", {len(rt_failed)} failed" if rt_failed else ""))
    for t, e in rt_failed[:5]:
        print("  FAILED", t, e)

    # ---- every other asset, from the page and from inside the modules
    assets = set()
    for text in [html.replace("&amp;", "&")] + list(modules.values()):
        for u in URL_RE.findall(text):
            u = u.rstrip(".,;")
            if (is_asset(u) and not u.endswith(".mjs")
                    and urllib.parse.urlsplit(u).path.rsplit("/", 1)[-1]):
                assets.add(u)
    print(f"other assets: {len(assets)}")

    def grab(url):
        dest = os.path.join(OUT, local_path(url))
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            return url, None, "cached"
        try:
            return url, fetch(url), None
        except Exception as e:
            return url, None, e

    total, failed, cached = 0, [], 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
        for i, (url, data, err) in enumerate(ex.map(grab, sorted(assets)), 1):
            if err == "cached":
                cached += 1
            elif err:
                failed.append((url, err))
            else:
                total += save(local_path(url), data)
            if i % 100 == 0:
                print(f"  {i}/{len(assets)} ...")

    for url, body in modules.items():
        total += save(local_path(url),
                      rewrite(retarget_domain(disable_badge(disable_editor_bar(body))), 2))

    # ---- page: drop Framer's analytics, editor hooks and badge, then localise URLs
    html = re.sub(r'<script[^>]*events\.framer\.com[^>]*>\s*</script>', '', html)
    html = re.sub(r'<script[^>]*framer\.com/edit/init\.mjs[^>]*>\s*</script>', '', html)
    html = re.sub(r'<link[^>]*rel="?modulepreload"?[^>]*framer\.com/edit[^>]*>', '', html)
    # Inline bootstrap that preloads Framer's editor bar when a localStorage flag
    # is set. Harmless but pointless once self-hosted, and it phones framer.com.
    html = re.sub(r'<script>(?:(?!</script>).)*?framer\.com/edit(?:(?!</script>).)*?</script>',
                  '', html, flags=re.S)
    html = re.sub(r'<link[^>]*rel="?(?:preconnect|dns-prefetch)"?[^>]*'
                  r'(?:framerusercontent|fonts\.gstatic|fonts\.googleapis)\.com[^>]*>', '', html)
    html = re.sub(r'<link[^>]*(?:framerusercontent|fonts\.gstatic|fonts\.googleapis)\.com"?[^>]*'
                  r'rel="?(?:preconnect|dns-prefetch)"?[^>]*>', '', html)
    html = remove_badge(html)
    html = set_og_image(html)
    html = retarget_domain(html)
    total += save("index.html", rewrite(html, 0))

    print(f"\ndone -> {OUT}")
    print(f"downloaded {total/1e6:.1f} MB ({cached} already cached)")
    for u, e in failed[:10]:
        print("  FAILED", u[:110], e)
    if failed:
        print(f"  ({len(failed)} failed)")


if __name__ == "__main__":
    main()
