const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Find all function calls in HTML onclick, onchange, oninput, etc.
const eventRegex = /on[a-z]+="([^"]+)"/g;
const eventHandlers = new Set();
let match;
while ((match = eventRegex.exec(html)) !== null) {
  eventHandlers.add(match[1]);
}

console.log(`Found ${eventHandlers.size} inline event attributes in HTML:`);
eventHandlers.forEach(h => console.log('  -', h));
