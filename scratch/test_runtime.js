const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom'); // check if jsdom exists or use minimal DOM

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

try {
  const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
  console.log("JSDOM initialized without crash");
  
  // Attach error handler
  dom.window.addEventListener('error', (evt) => {
    console.error('RUNTIME ERROR IN DOM:', evt.error || evt.message);
  });

  // Execute script.js inside dom.window
  const scriptEl = dom.window.document.createElement("script");
  scriptEl.textContent = script;
  dom.window.document.body.appendChild(scriptEl);

  console.log("Script executed into DOM successfully.");
} catch (err) {
  console.error("DOM Initialization/Script Execution Error:", err);
}
