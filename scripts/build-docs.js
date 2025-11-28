const fs = require('fs');
const path = require('path');

// Konfiguráció
const DOCS_DIR = path.join(__dirname, '../docs');
const OUTPUT_FILE = path.join(DOCS_DIR, 'docs.md');
const PAGE_BREAK = '\n\n<div style="page-break-after: always;"></div>\n\n';

async function mergeDocs() {
  try {
    // 1. Megnézzük, létezik-e a mappa
    if (!fs.existsSync(DOCS_DIR)) {
      console.error(`❌ Hiba: Nem találom a docs mappát itt: ${DOCS_DIR}`);
      return;
    }

    // 2. Beolvassuk a fájlokat
    const files = fs
      .readdirSync(DOCS_DIR)
      .filter(file => file.endsWith('.md'))
      .filter(file => file !== 'docs.md')
      .sort();

    if (files.length === 0) {
      console.log('⚠️  Nincsenek .md fájlok a docs mappában.');
      return;
    }

    console.log(`📄 Talált fájlok: \n - ${files.join('\n - ')}`);

    let content = '';

    // 3. Összefűzés
    for (const [index, file] of files.entries()) {
      const filePath = path.join(DOCS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      content += fileContent;

      // Ha nem az utolsó fájl, teszünk utána oldaltörést
      if (index < files.length - 1) {
        content += PAGE_BREAK;
      }
    }

    // 4. Mentés
    fs.writeFileSync(OUTPUT_FILE, content);
    console.log(`\n✅ Sikeresen összefűzve ide: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('❌ Hiba történt:', err);
  }
}

mergeDocs();
