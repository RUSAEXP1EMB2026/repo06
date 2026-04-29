const SHEET_NAME = "table";

const sheet = getSheet(SHEET_NAME);

function create(id, gmail) {
  if (!exists(id)) {
    sheet.appendRow([id, gmail]);
  }
}

/* 主にこれを使うことを推奨します。 */
function getUser(id) {
  return getUserByRow(getRowByUserId(id));
}

/* 使用非推奨 */
function getRowByUserId(id) {
  for (let i = 1; i <= sheet.getLastRow(); i++) {
    if (sheet.getRange(i, 1).getValue() === id) {
      return i;
    }
  }
  return -1;
}

/* 使用非推奨 */
function getUserByRow(row) {
  return new User(sheet.getRange(row, 1), sheet.getRange(row, 2));
}

function exists(id) {
  return getRowByUserId(id) !== -1;
}