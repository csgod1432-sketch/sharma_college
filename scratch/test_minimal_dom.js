const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

// Mock window and document
global.window = global;
global.document = {
  getElementById: (id) => {
    return {
      style: {},
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      addEventListener: () => {},
      setAttribute: () => {},
      removeAttribute: () => {},
      appendChild: () => {},
      innerText: '',
      innerHTML: '',
      value: ''
    };
  },
  querySelector: () => ({ style: {}, classList: { add: () => {}, remove: () => {} } }),
  querySelectorAll: () => [],
  createElement: () => ({
    style: {},
    classList: { add: () => {}, remove: () => {} },
    appendChild: () => {},
    setAttribute: () => {}
  }),
  addEventListener: () => {}
};
global.navigator = { userAgent: 'node' };
global.location = { href: '', reload: () => {} };
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

try {
  eval(script);
  console.log("SUCCESS: Top level script executed without throwing synchronous errors!");
} catch (e) {
  console.error("ERROR EXECUTING SCRIPT:", e);
}
