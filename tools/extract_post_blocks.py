#!/usr/bin/env python3
"""Re-extract blog post content blocks from the scraped WordPress mirror,
preserving inline formatting (bold / italic / links) as `runs`, and promoting
paragraphs that are entirely bold (the original posts' pseudo-headings) to h3.

Usage (from the project root):
    python3 tools/extract_post_blocks.py [path-to-mirror]

Default mirror path: ../nationalmovers.co.nz
Rewrites data/posts.json in place (blocks only; metadata untouched).

Block schema (backwards compatible — `text`/`items` keep plain text):
    {type: "p"|"h2"|"h3", text, runs: [{t, b?, i?, href?}]}
    {type: "ul"|"ol", items: [str], runsItems: [[run, ...], ...]}
"""
import json
import sys
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
MIRROR = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "nationalmovers.co.nz"
POSTS = ROOT / "data" / "posts.json"

BOLD_TAGS = {"strong", "b"}
ITALIC_TAGS = {"em", "i"}
HEADING_MAX = 90  # bold-only paragraphs shorter than this become h3 headings


def runs_of(el):
    """Flatten an element into runs of {t, b, i, href}."""
    out = []

    def walk(node, bold=False, italic=False, href=None):
        if isinstance(node, NavigableString):
            text = str(node)
            if text.strip() == "" and not out:
                return
            if text:
                out.append({"t": text, "b": bold, "i": italic, "href": href})
            return
        if not isinstance(node, Tag):
            return
        name = node.name.lower()
        if name in ("script", "style", "noscript"):
            return
        if name == "br":
            out.append({"t": "\n", "b": bold, "i": italic, "href": href})
            return
        b = bold or name in BOLD_TAGS
        i = italic or name in ITALIC_TAGS
        h = href
        if name == "a" and node.get("href"):
            h = normalise_href(node["href"])
        for child in node.children:
            walk(child, b, i, h)

    walk(el)
    # merge adjacent runs with identical marks; collapse whitespace runs
    merged = []
    for r in out:
        r["t"] = r["t"].replace("\xa0", " ")
        if merged and all(merged[-1][k] == r[k] for k in ("b", "i", "href")):
            merged[-1]["t"] += r["t"]
        else:
            merged.append(r)
    merged = [r for r in merged if r["t"].strip() or r["t"] == "\n"]
    # tidy: strip leading/trailing outer whitespace
    if merged:
        merged[0]["t"] = merged[0]["t"].lstrip()
        merged[-1]["t"] = merged[-1]["t"].rstrip()
    # drop falsey mark keys to keep JSON small
    slim = []
    for r in merged:
        s = {"t": r["t"]}
        if r["b"]:
            s["b"] = True
        if r["i"]:
            s["i"] = True
        if r["href"]:
            s["href"] = r["href"]
        slim.append(s)
    return slim


def normalise_href(href):
    href = href.strip()
    for prefix in ("https://nationalmovers.co.nz", "http://nationalmovers.co.nz"):
        if href.startswith(prefix):
            href = href[len(prefix):] or "/"
    if href.endswith("/") and len(href) > 1 and not href.startswith("#"):
        href = href.rstrip("/")
    return href


def plain(runs):
    return "".join(r["t"] for r in runs).strip()


def extract_blocks(html):
    soup = BeautifulSoup(html, "html.parser")
    content = soup.select_one(".entry-content")
    if content is None:
        return None
    blocks = []
    for el in content.find_all(["h1", "h2", "h3", "h4", "h5", "p", "ul", "ol"]):
        # skip nested containers handled elsewhere (e.g. <p> inside <li>)
        if el.find_parent(["ul", "ol", "blockquote"]) and el.name == "p":
            continue
        if el.name in ("ul", "ol"):
            items, runs_items = [], []
            for li in el.find_all("li", recursive=False):
                r = runs_of(li)
                text = plain(r)
                if text:
                    items.append(text)
                    runs_items.append(r)
            if items:
                blocks.append({"type": el.name, "items": items, "runsItems": runs_items})
            continue

        r = runs_of(el)
        text = plain(r)
        if not text:
            continue
        if el.name in ("h1", "h2"):
            blocks.append({"type": "h2", "text": text, "runs": r})
        elif el.name in ("h3", "h4", "h5"):
            blocks.append({"type": "h3", "text": text, "runs": r})
        else:
            # Promote bold-only short paragraphs (the posts' pseudo-headings).
            if (
                len(text) <= HEADING_MAX
                and not text.endswith((".", "!", "?", ":"))
                and all(run.get("b") for run in r if run["t"].strip())
            ):
                blocks.append({"type": "h3", "text": text, "runs": [{"t": text}]})
            else:
                blocks.append({"type": "p", "text": text, "runs": r})
    return blocks


def main():
    posts = json.loads(POSTS.read_text())
    updated = skipped = 0
    for post in posts:
        src = MIRROR / post["slug"] / "index.html"
        if not src.exists():
            print(f"  ! mirror page missing, kept as-is: {post['slug']}")
            skipped += 1
            continue
        blocks = extract_blocks(src.read_text(errors="ignore"))
        if not blocks:
            print(f"  ! no .entry-content, kept as-is: {post['slug']}")
            skipped += 1
            continue
        post["blocks"] = blocks
        updated += 1
    POSTS.write_text(json.dumps(posts, ensure_ascii=False, indent=1) + "\n")
    print(f"Updated {updated} posts, skipped {skipped}. Wrote {POSTS}")


if __name__ == "__main__":
    main()
