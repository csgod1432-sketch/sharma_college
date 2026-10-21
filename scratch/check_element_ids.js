const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Extract all document.getElementById('XYZ') from script.js
const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
const referencedIds = new Set();
let match;
while ((match = idRegex.exec(script)) !== null) {
  referencedIds.add(match[1]);
}

// Extract all id="XYZ" from index.html
const htmlIdRegex = /id=['"]([^'"]+)['"]/g;
const htmlIds = new Set();
while ((match = htmlIdRegex.exec(html)) !== null) {
  htmlIds.add(match[1]);
}

console.log(`Found ${referencedIds.size} referenced IDs in script.js.`);
console.log(`Found ${htmlIds.size} IDs in index.html.\n`);

const missingIds = [];
referencedIds.forEach(id => {
  if (!htmlIds.has(id)) {
    missingIds.push(id);
  }
});

console.log('--- MISSING IDs (referenced in script.js but NOT present in index.html) ---');
missingIds.forEach(id => console.log(' ❌', id));
