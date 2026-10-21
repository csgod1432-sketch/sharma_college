const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

// Check function definitions
const functionNames = [
  'setRole', 'goToStep2', 'togglePass', 'backToStep1', 'handleRegistration',
  'toggleAuthMode', 'toggleForgotPassword', 'handleAuth', 'handleRequestQuestion',
  'handleVerifyAnswer', 'switchTab', 'loadAdminStudents', 'loadSubjects',
  'loadAllAttendanceReport', 'loadAdminForms', 'renderAcademicCalendar',
  'openModal', 'logoutUser', 'toggleSidebar', 'exportData', 'postAdminEvent',
  'addAdminStudent', 'saveSubject', 'uploadAdminResult', 'loadFacultyClassData',
  'loadFacultyDoubts', 'changeCalendarMonth', 'markNotifsRead', 'startAttendanceScan',
  'submitDoubt', 'openQRPayModal', 'showInnerTab', 'selectFormType', 'submitApplicationForm',
  'saveCalendarEvent', 'stopCamera', 'closeQRPayModal', 'switchPayTab', 'processQRPayment',
  'switchPayStep', 'closeModal', 'uploadProfilePicture', 'saveCalDayEvent', 'closeCustomAlert'
];

console.log('--- Checking function presence in script.js ---');
functionNames.forEach(fn => {
  const hasFn = new RegExp(`function\\s+${fn}\\b|window\\.${fn}\\s*=`).test(script);
  console.log(`${fn}: ${hasFn ? 'EXISTS' : 'MISSING'}`);
});
