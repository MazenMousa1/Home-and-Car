import json
# pyrefly: ignore [missing-import]
from bs4 import BeautifulSoup

def extract_text(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    texts = set()
    for node in soup.find_all(string=True):
        text = node.strip()
        if text and len(text) > 1 and not text.startswith('/*') and not text.startswith('<!--'):
            texts.add(text)
    
    # also placeholders
    for tag in soup.find_all(True):
        if tag.has_attr('placeholder'):
            texts.add(tag['placeholder'].strip())
            
    return list(texts)

texts = extract_text(r"c:\Users\dell\OneDrive\Desktop\H&C web\index.html")
with open(r"c:\Users\dell\OneDrive\Desktop\H&C web\texts.json", 'w', encoding='utf-8') as f:
    json.dump(texts, f, ensure_ascii=False, indent=2)
