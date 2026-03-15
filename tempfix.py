import re

filepath = r'c:\Users\abdel\Desktop\تهنئة العيد\src\pages\EditorPage.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line numbers are 1-indexed from view, so subtract 1 for 0-indexed
replacements = {
    4044: ('fontSize: 16, fontWeight: 700 }}>', '</h3>', 'التنسيق'),
    4045: ("fontSize: 12, color: '#888' }}>", '</p>', 'الخط والألوان والتأثيرات'),
    4068: ("fontWeight: 700, display: 'block', marginBottom: 14 }}>", '</label>', 'ألوان النصوص'),
    4083: ("fontSize: 13, fontWeight: 600 }}>", '</span>', 'ظل النص'),
    4094: ("fontSize: 13, fontWeight: 600 }}>", '</span>', 'حدود النص'),
    4106: ("fontSize: 13, fontWeight: 600 }}>", '</span>', 'سمك الحدود'),
    4110: ('store.setTextStrokeColor} label="', '" />', 'اللون'),
    4117: ("fontSize: 13, fontWeight: 600 }}>", '</span>', 'طبقة لونية'),
}

fixed = 0
for line_idx, (before_marker, after_marker, correct_text) in replacements.items():
    line = lines[line_idx]
    before_pos = line.find(before_marker)
    after_pos = line.find(after_marker)
    if before_pos != -1 and after_pos != -1:
        start = before_pos + len(before_marker)
        end = after_pos
        lines[line_idx] = line[:start] + correct_text + line[end:]
        print(f"Fixed line {line_idx + 1}")
        fixed += 1
    else:
        print(f"WARNING: Could not fix line {line_idx + 1} - markers not found")
        print(f"  before_marker: {repr(before_marker)}")
        print(f"  line content: {repr(line[:100])}")

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"Done! Fixed {fixed}/8 lines.")
