const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

// Setup minimal browser mocks
global.window = global;
global.window.addEventListener = () => {};
global.document = {
  getElementById: (id) => {
    return {
      style: {},
      classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
      addEventListener: () => {},
      setAttribute: () => {},
      removeAttribute: () => {},
      appendChild: () => {},
      querySelector: () => ({ style: {}, classList: { add: () => {}, remove: () => {} } }),
      querySelectorAll: () => [],
      innerText: '',
      innerHTML: '',
      value: 'test',
      options: [{ text: 'option1' }],
      files: []
    };
  },
  querySelector: () => ({ style: {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} } }),
  querySelectorAll: () => [],
  createElement: () => ({
    style: {},
    classList: { add: () => {}, remove: () => {} },
    appendChild: () => {},
    setAttribute: () => {}
  }),
  head: { appendChild: () => {} },
  addEventListener: () => {},
  body: { classList: { add: () => {}, remove: () => {} }, appendChild: () => {} }
};
global.navigator = { userAgent: 'node', clipboard: { writeText: () => Promise.resolve() } };
global.location = { href: '', reload: () => {} };
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.alert = (msg) => console.log('ALERT:', msg);

// Firebase mocks
global.window.firebaseDb = {};
global.window.firebaseAuth = {};
global.window.fbSignIn = () => Promise.resolve({ user: { uid: '123' } });
global.window.fbSignUp = () => Promise.resolve({ user: { uid: '123' } });
global.window.fbSignOut = () => Promise.resolve();
global.window.fbCollection = () => ({});
global.window.fbQuery = () => ({});
global.window.fbWhere = () => ({});
global.window.fbOrderBy = () => ({});
global.window.getDocs = () => Promise.resolve({ empty: true, forEach: () => {} });
global.window.fbDoc = () => ({});
global.window.fbSetDoc = () => Promise.resolve();
global.window.fbGetDoc = () => Promise.resolve({ exists: () => false });
global.window.fbOnSnapshot = () => () => {};
global.window.fbSendPasswordResetEmail = () => Promise.resolve();
global.window.fbUpdateDoc = () => Promise.resolve();
global.window.fbDeleteDoc = () => Promise.resolve();
global.window.fbAddDoc = () => Promise.resolve();

eval(script);

// Extract all onclick handlers
const regex = /onclick="([^"]+)"/g;
const calls = new Set();
let match;
while ((match = regex.exec(html)) !== null) {
  calls.add(match[1].trim());
}

console.log(`\nTesting ${calls.size} onclick expressions...\n`);

calls.forEach(code => {
  try {
    // Modify code if it uses 'this'
    const testCode = code.replace(/\bthis\b/g, 'document.createElement("div")');
    eval(testCode);
    console.log(`✅ EXECUTED: ${code}`);
  } catch (err) {
    console.error(`❌ FAILED: ${code}\n   Error: ${err.message}`);
  }
});
