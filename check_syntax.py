with open(r'c:\Users\abdel\Desktop\تهنئة العيد\src\pages\AdminDashboardPage.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
print(f'Total lines: {len(lines)}')

# Check for unterminated strings
for i, line in enumerate(lines):
    stripped = line.rstrip('\n')
    if len(stripped) > 300:
        print(f'Long line {i+1}: {len(stripped)} chars')
    
    # Check for odd number of single quotes (potential unterminated string)
    single_quotes = stripped.count("'")
    double_quotes = stripped.count('"')
    backticks = stripped.count('`')
    
    # Simple check - if line ends with odd quotes, flag it
    if single_quotes % 2 != 0 and not stripped.strip().startswith('//') and not stripped.strip().startswith('*'):
        if 'className' not in stripped and "font-family" not in stripped.lower():
            pass  # skip common false positives
    
# Print lines 258-278 raw to see what's there
print('\n--- Lines 258-278 ---')
for i in range(257, min(278, len(lines))):
    print(f'{i+1}: {lines[i].rstrip()}')
