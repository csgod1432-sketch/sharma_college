const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const missingIds = [
  'dashTitle', 'geoStatusLabel', 'formType', 'formReason',
  'calendarMonthTitleFull', 'adminCalEventsList', 'studentNotifBadge',
  'facultyFormsList', 'calEventName', 'calEventDate', 'calEventCategory',
  'adminStudentCount', 'ktTrackingBody', 'facResultRollNo', 'facResultFile',
  'facResultUploadBtn', 'facResultPreview', 'facResultPreviewText'
];

const lines = script.split('\n');
missingIds.forEach(id => {
  console.log(`\n=== References for missing ID: "${id}" ===`);
  lines.forEach((line, i) => {
    if (line.includes(`'${id}'`) || line.includes(`"${id}"`)) {
      console.log(`Line ${i+1}: ${line.trim()}`);
    }
  });
});
