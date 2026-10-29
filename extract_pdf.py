import pdfplumber

with pdfplumber.open(r'd:\Saas-app\Unified Multi-App AI Ecosystem SRS.pdf') as pdf:
    text = ''
    for page in pdf.pages:
        t = page.extract_text()
        if t:
            text += t + '\n'
    with open(r'd:\Saas-app\srs_extracted.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Pages:', len(pdf.pages))
    print('Chars:', len(text))

