import os

files = [
    r'c:\Users\abdel\Desktop\تهنئة العيد\fix_arabic.js',
    r'c:\Users\abdel\Desktop\تهنئة العيد\fix_arabic.py',
    r'c:\Users\abdel\Desktop\تهنئة العيد\tempfix.js',
    r'c:\Users\abdel\Desktop\تهنئة العيد\tempfix.py',
    r'c:\Users\abdel\Desktop\fix_arabic.js',
    r'c:\Users\abdel\Desktop\fix_arabic.py'
]

for f in files:
    try:
        if os.path.exists(f):
            os.remove(f)
            print(f'DELETED: {f}')
        else:
            print(f'NOT FOUND: {f}')
    except Exception as e:
        print(f'ERROR deleting {f}: {e}')

print('\nDeletion process completed')
