const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

const lines = script.split('\n');
lines.forEach((line, i) => {
  if (/\bevent\b/.test(line) && !/function\s*\w*\s*\([^)]*event/.test(line) && !/catch\s*\(\s*event/.test(line)) {
    // Check if event is used inside function parameter list or catch clause
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
});
