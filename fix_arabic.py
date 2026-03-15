#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys

file_path = r'c:\Users\abdel\Desktop\تهنئة العيد\src\pages\EditorPage.jsx'

print('Reading file...')
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total lines: {len(lines)}\n')

# Define the fixes (1-indexed line numbers and their correct content)
fixes = [
    (4045, '            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>التنسيق</h3>\n', 'التنسيق'),
    (4046, '            <p style={{ margin: 0, fontSize: 12, color: \'#888\' }}>الخط والألوان والتأثيرات</p>\n', 'الخط والألوان والتأثيرات'),
    (4052, None, 'الخط'),  # Check only
    (4069, None, 'ألوان النصوص'),  # Check only
    (4071, None, 'الرئيسي'),  # Check only
    (4072, None, 'الفرعي'),  # Check only
    (4073, None, 'المستلم'),  # Check only
    (4074, None, 'المرسل'),  # Check only
    (4080, None, 'التأثيرات'),  # Check only
    (4084, None, 'ظل النص'),  # Check only
    (4095, None, 'حدود النص'),  # Check only
    (4107, None, 'سمك الحدود'),  # Check only
    (4111, None, 'اللون'),  # Check only
    (4118, None, 'طبقة لونية'),  # Check only
]

modified = False
changed_lines = []

# Apply fixes
for line_num, correct_content, correct_arabic in fixes:
    idx = line_num - 1  # Convert to 0-indexed
    current_line = lines[idx]
    
    if correct_content is None:
        # Check only
        if correct_arabic in current_line:
            print(f'✓ Line {line_num}: Already has correct text "{correct_arabic}"')
        else:
            print(f'✗ Line {line_num}: Missing correct text')
            print(f'  Current: {current_line[:80]}')
            print(f'  Expected: "{correct_arabic}"\n')
    else:
        # Replace the line
        if current_line != correct_content:
            print(f'Fixing line {line_num}...')
            lines[idx] = correct_content
            modified = True
            changed_lines.append(line_num)
        else:
            print(f'✓ Line {line_num}: Already correct')

if modified:
    print(f'\n✓ Modified {len(changed_lines)} lines: {", ".join(map(str, changed_lines))}')
    print('Writing file back as UTF-8...')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('✓ File written successfully\n')
else:
    print('\n✓ No modifications needed\n')

# Verify by reading lines 4038-4130
print('=== VERIFICATION: Lines 4038-4130 ===\n')
verify_start = 4037  # 0-indexed
verify_end = 4130

target_lines = [4045, 4046, 4052, 4069, 4071, 4072, 4073, 4074, 4080, 4084, 4095, 4107, 4111, 4118]

for i in range(verify_start, min(verify_end, len(lines))):
    line_num = i + 1
    if line_num in target_lines:
        print(f'>>> Line {line_num}:')
        print(f'    {lines[i]}', end='')

print('\n✓ Script completed')
