"""Read-only structural/source and published-PDF audit; not a BibTeX parser."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import urllib.request


def require(condition, message):
    if not condition:
        raise ValueError(message)


def bib_inventory(text):
    keys = re.findall(r'^\s*@(?:article|inproceedings|book|misc|online|incollection)\s*\{\s*([^,]+),', text, re.I | re.M)
    dois = re.findall(r'^\s*doi\s*=\s*[{"]([^}"]+)', text, re.I | re.M)
    require(len(keys) == len(set(keys)), 'Duplicate bibliography keys')
    normalized = [d.strip().lower().removeprefix('https://doi.org/') for d in dois]
    require(len(normalized) == len(set(normalized)), 'Duplicate bibliography DOIs')
    return set(keys), set(normalized)


def check_links(links):
    require(isinstance(links, list), 'links must be an array')
    for link in links:
        require(isinstance(link, dict) and isinstance(link.get('text'), str) and isinstance(link.get('url'), str), 'Invalid link object')
        require(link['url'].startswith(('https://', 'http://', '/')), 'Unexpected link scheme')


def validate_data(pubs, news):
    require(isinstance(pubs, list) and isinstance(news, list), 'Data must be arrays')
    titles, identifiers = set(), set()
    for p in pubs:
        require(isinstance(p, dict), 'Publication must be an object')
        require(all(isinstance(p.get(k), str) and p[k].strip() for k in ('title', 'venue', 'highlight', 'type')), 'Missing publication string')
        require(type(p.get('year')) is int, 'Publication year must be integer')
        require(p['type'] in ('journal', 'conference'), 'Review renderer before adding a publication type')
        require(isinstance(p.get('authors'), list) and p['authors'] and all(isinstance(a, str) and a.strip() for a in p['authors']), 'Authors must be nonempty ordered strings')
        title = re.sub(r'\W+', '', p['title']).casefold()
        require(title not in titles, 'Duplicate publication title: ' + p['title'])
        titles.add(title)
        check_links(p.get('links'))
        for link in p['links']:
            match = re.search(r'(?:doi\.org/|arxiv\.org/(?:abs|pdf)/)([^?#]+)', link['url'], re.I)
            if match:
                identifier = match[1].removesuffix('.pdf').casefold()
                require(identifier not in identifiers, 'Duplicate publication identifier: ' + identifier)
                identifiers.add(identifier)
    dates = []
    for n in news:
        require(isinstance(n, dict), 'News must be an object')
        require(all(isinstance(n.get(k), str) and n[k].strip() for k in ('date', 'title', 'description')), 'Missing news string')
        require(re.fullmatch(r'\d{4}\.(0[1-9]|1[0-2])', n['date']), 'Invalid news date')
        dates.append(n['date'])
        check_links(n.get('links', []))
    require(dates == sorted(dates, reverse=True), 'News must be newest first')


def pdf_pages(data):
    require(data.startswith(b'%PDF-'), 'Response is not a PDF')
    result = subprocess.run(['pdfinfo', '-'], input=data, capture_output=True, check=True)
    match = re.search(rb'^Pages:\s+(\d+)', result.stdout, re.M)
    if match is None:
        raise ValueError('Cannot determine page count')
    return int(match[1])


def audit(workspace, live=False):
    site = workspace / 'michael-j-cho.github.io'
    pubs = json.loads((site / 'src/data/publications.json').read_text())
    news = json.loads((site / 'src/data/news.json').read_text())
    validate_data(pubs, news)
    inventories = [bib_inventory((workspace / r / 'mycitations.bib').read_text()) for r in ('curriculum-vitae-2p', 'curriculum-vitae')]
    require(inventories[0] == inventories[1], 'CV bibliography key/DOI inventories differ; inspect intentional differences')
    print(f'PASS: {len(pubs)} publications, {len(news)} news entries; matching CV key/DOI inventories ({len(inventories[0][0])} keys).')
    print('NOTE: inventory equality does not validate author/title metadata or prove website/CV equivalence.')
    for name in ('cv.pdf', 'cv-full.pdf'):
        data = (site / 'public/files' / name).read_bytes()
        pages = pdf_pages(data)
        require(pages == 2 if name == 'cv.pdf' else pages > 0, f'Unexpected page count for {name}: {pages}')
        print(f'PASS: repository {name}: {pages} pages.')
        if live:
            url = 'https://michaelcho.info/files/' + name
            request = urllib.request.Request(url, headers={'User-Agent': 'academic-profile-audit', 'Cache-Control': 'no-cache'})
            with urllib.request.urlopen(request, timeout=45) as response:
                remote = response.read()
            require(hashlib.sha256(data).digest() == hashlib.sha256(remote).digest(), 'Live PDF differs from repository: ' + url)
            print('PASS: live PDF bytes match repository: ' + url)
    if live:
        for route in ('news/', 'publications/'):
            with urllib.request.urlopen('https://michaelcho.info/' + route, timeout=45) as response:
                require(response.status == 200, 'Page request failed: ' + route)
            print('PASS: live route reachable: /' + route + ' (check requested text separately).')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workspace', type=Path, required=True)
    parser.add_argument('--live', action='store_true')
    args = parser.parse_args()
    audit(args.workspace.expanduser(), args.live)


if __name__ == '__main__':
    main()
