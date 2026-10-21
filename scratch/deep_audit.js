const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

// Find all functions in script.js
const fnRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/g;
const functions = [];
let match;
while ((match = fnRegex.exec(script)) !== null) {
  functions.push(match[1]);
}

console.log(`Found ${functions.length} functions defined with 'function' keyword.`);

// Check for window.X = function...
const winFnRegex = /window\.([a-zA-Z0-9_$]+)\s*=\s*(async\s*)?function/g;
while ((match = winFnRegex.exec(script)) !== null) {
  functions.push(match[1]);
}

console.log(`Total function count including window.X: ${functions.length}`);
