const fs = require('fs');
const path = require('path');

const scriptContent = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

console.log('Script length:', scriptContent.length);
console.log('HTML length:', htmlContent.length);

// Extract all onclick function calls from index.html
const onclickRegex = /onclick="([^"]+)"/g;
const calls = new Set();
let match;
while ((match = onclickRegex.exec(htmlContent)) !== null) {
  calls.add(match[1].trim());
}

console.log('Onclick calls found in HTML:');
calls.forEach(c => console.log(' -', c));
