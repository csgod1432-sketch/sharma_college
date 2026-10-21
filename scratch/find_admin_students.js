const fs = require('fs');
const path = require('path');
const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

const lines = script.split('\n');
lines.forEach((l, i) => {
  if (l.includes('loadAdminStudents')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});
