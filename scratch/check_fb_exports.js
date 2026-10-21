const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Find all window.fb... in script.js
const fbRegex = /window\.(fb[a-zA-Z0-9_$]+)/g;
const referencedFbFunctions = new Set();
let match;
while ((match = fbRegex.exec(script)) !== null) {
  referencedFbFunctions.add(match[1]);
}

// Find all window.fb... in index.html
const htmlFbRegex = /window\.(fb[a-zA-Z0-9_$]+)/g;
const htmlFbFunctions = new Set();
while ((match = htmlFbRegex.exec(html)) !== null) {
  htmlFbFunctions.add(match[1]);
}

console.log('Referenced window.fb* in script.js:');
referencedFbFunctions.forEach(fn => {
  const exists = htmlFbFunctions.has(fn);
  console.log(` - ${fn}: ${exists ? 'EXISTS in index.html' : '❌ MISSING from index.html'}`);
});
