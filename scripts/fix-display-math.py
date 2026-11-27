"""Make every standalone $$...$$ line a proper display-math block (remark-math needs fences on their own lines)."""
import re, sys, pathlib
for p in sys.argv[1:]:
    lines = pathlib.Path(p).read_text().split('\n')
    out, in_front = [], 0
    for i, ln in enumerate(lines):
        if ln.strip() == '---': in_front += 1
        m = re.fullmatch(r'(\s*)\$\$(.+)\$\$([.,]?)\s*', ln)
        if in_front >= 2 and m:
            ind, body, punct = m.groups()
            if out and out[-1].strip(): out.append('')
            out += [ind + '$$', ind + body + (('\\;' + punct) if punct else ''), ind + '$$', '']
        else:
            if out and out[-1] == '' and ln == '' : continue
            out.append(ln)
    pathlib.Path(p).write_text('\n'.join(out))
