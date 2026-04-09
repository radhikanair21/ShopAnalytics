import glob
from pypdf import PdfReader

pdf_path = glob.glob(r'extracted_content\AWDT 2026 - ShopAnalytics\SRS DOCUMENT (EVERYONE)\*.pdf')[0]

reader = PdfReader(pdf_path)
with open('srs.txt', 'w', encoding='utf-8') as f:
    for page in reader.pages:
        f.write(page.extract_text() + '\n')
print('Extraction complete')
