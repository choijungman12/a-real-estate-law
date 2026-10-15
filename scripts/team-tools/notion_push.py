"""노션 작업 DB 도우미 (docs/team-kit/02_도구_설정과_스크립트.md 4번).

환경 변수: NOTION_TOKEN(필수), NOTION_TASK_DB_ID(작업 DB 32자 id).
사용:  python scripts/team-tools/notion_push.py list [담당] [상태]
       python scripts/team-tools/notion_push.py read <레코드id> [끝_n줄]
"""
import json, os, re, time, urllib.request, urllib.error

TOK = os.environ["NOTION_TOKEN"]
H = {"Authorization": f"Bearer {TOK}", "Notion-Version": "2022-06-28", "Content-Type": "application/json"}
DS_DB = os.environ.get("NOTION_TASK_DB_ID") or "{{작업DB_ID}}"  # 작업 DB id (환경 변수 우선)

def call(method, path, body=None, tries=6):
    for k in range(tries):
        req = urllib.request.Request("https://api.notion.com/v1/" + path, method=method, headers=H,
                                     data=json.dumps(body).encode() if body is not None else None)
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and k < tries - 1:
                time.sleep(3); continue
            print("ERR", e.code, e.read()[:200].decode("utf8", "replace")); raise

def rt(text):
    """**굵게** · `코드` 를 노션 글로"""
    out = []
    for i, part in enumerate(re.split(r"\*\*", text)):
        for j, p in enumerate(re.split(r"`", part)):
            if p:
                out.append({"type": "text", "text": {"content": p[:1900]},
                            "annotations": {"bold": i % 2 == 1, "code": j % 2 == 1}})
    return out or [{"type": "text", "text": {"content": ""}}]

def blocks(md):
    """## · ### · - · 1. · > · 표(|a|b|) 만 지원하는 간단한 마크다운 → 노션 블록"""
    bl, rows = [], []
    def flush():
        nonlocal rows
        if rows:
            w = len(rows[0])
            bl.append({"type": "table", "table": {"table_width": w, "has_column_header": True, "has_row_header": False,
                "children": [{"type": "table_row", "table_row": {"cells": [rt(c) for c in (r + [""] * w)[:w]]}} for r in rows]}})
            rows = []
    for line in md.splitlines():
        s = line.rstrip()
        if s.startswith("|"):
            cells = [c.strip() for c in s.strip("|").split("|")]
            if not all(re.fullmatch(r":?-+:?", c) for c in cells):
                rows.append(cells)
            continue
        flush()
        if not s: continue
        if s.startswith("## "):   bl.append({"type": "heading_2", "heading_2": {"rich_text": rt(s[3:])}})
        elif s.startswith("### "): bl.append({"type": "heading_3", "heading_3": {"rich_text": rt(s[4:])}})
        elif re.match(r"^\d+\. ", s): bl.append({"type": "numbered_list_item", "numbered_list_item": {"rich_text": rt(re.sub(r"^\d+\. ", "", s))}})
        elif s.startswith("- "):  bl.append({"type": "bulleted_list_item", "bulleted_list_item": {"rich_text": rt(s[2:])}})
        elif s.startswith("> "):  bl.append({"type": "callout", "callout": {"rich_text": rt(s[2:])}})
        else:                     bl.append({"type": "paragraph", "paragraph": {"rich_text": rt(s)}})
    flush()
    return bl

def props(name=None, owner=None, state=None, memo=None, due=None):
    p = {}
    if name:  p["이름"] = {"title": rt(name)}
    if owner: p["담당"] = {"select": {"name": owner}}
    if state: p["상태"] = {"select": {"name": state}}
    if memo is not None: p["메모"] = {"rich_text": rt(memo)}
    if due:   p["마감일"] = {"date": {"start": due}}
    return p

def new_record(name, owner, state, memo, md, due=None):
    pg = call("POST", "pages", {"parent": {"database_id": DS_DB},
              "properties": props(name, owner, state, memo, due), "children": blocks(md)})
    return pg["id"], pg["url"]

def append(page_id, md):
    """레코드 본문 끝에 덧붙이기(판정 · 답 · 추가 지시)"""
    return call("PATCH", f"blocks/{page_id}/children", {"children": blocks(md)})

def query(owner=None, state=None):
    flt = [f for f in [owner and {"property": "담당", "select": {"equals": owner}},
                       state and {"property": "상태", "select": {"equals": state}}] if f]
    body = {"page_size": 100}
    if flt: body["filter"] = flt[0] if len(flt) == 1 else {"and": flt}
    out, cur = [], None
    while True:
        if cur: body["start_cursor"] = cur
        r = call("POST", f"databases/{DS_DB}/query", body)
        for p in r["results"]:
            pr = p["properties"]
            g = lambda k: "".join(x["plain_text"] for x in (pr.get(k, {}).get("title") or pr.get(k, {}).get("rich_text") or []))
            sel = lambda k: (pr.get(k, {}).get("select") or {}).get("name", "")
            out.append({"id": p["id"], "이름": g("이름"), "담당": sel("담당"), "상태": sel("상태"),
                        "메모": g("메모"), "수정": p["last_edited_time"]})
        if not r.get("has_more"): return out
        cur = r["next_cursor"]

def read(page_id, last=None):
    """레코드 본문 글을 줄로(last=n 이면 끝 n줄)"""
    bl, cur = [], None
    while True:
        r = call("GET", f"blocks/{page_id}/children?page_size=100" + (f"&start_cursor={cur}" if cur else ""))
        bl += r["results"]
        if not r.get("has_more"): break
        cur = r["next_cursor"]
    lines = [f"[{b['type']}] " + "".join(x["plain_text"] for x in b.get(b["type"], {}).get("rich_text", [])) for b in bl]
    return lines[-last:] if last else lines

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        for r in query(*(sys.argv[2:4] + [None, None])[:2]):
            print(f"[{r['상태']}] ({r['담당']}) {r['이름']} | {r['메모'][:80]} :: {r['id']}")
    elif len(sys.argv) > 2 and sys.argv[1] == "read":
        print("\n".join(read(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else None)))
