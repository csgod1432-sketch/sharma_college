const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

function findMatches(pattern) {
  const lines = script.split('\n');
  const results = [];
  const regex = new RegExp(pattern, 'i');
  lines.forEach((line, index) => {
    if (regex.test(line)) {
      results.push(`Line ${index + 1}: ${line.trim()}`);
    }
  });
  return results;
}

console.log('--- switchTab ---');
findMatches('switchTab').slice(0, 20).forEach(l => console.log(l));

console.log('\n--- openModal ---');
findMatches('openModal').slice(0, 20).forEach(l => console.log(l));

console.log('\n--- logoutUser ---');
findMatches('logoutUser').slice(0, 20).forEach(l => console.log(l));
