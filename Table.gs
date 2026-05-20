const SHEET_NAME = "table";

const sheet = getSheet(SHEET_NAME);

function createRow(id) {
  if (!exists(id)) {
    sheet.appendRow([id]);
  }
}

function setGmail(id, gmail) {
  if (!exists(id)) {
    createRow(id);
  }
  sheet.getRange(getRowByUserId(id), 2).setValue(gmail);
}

function setRemoToken(id, token) {

  if (!exists(id)) {
    createRow(id);
  }

  sheet
    .getRange(getRowByUserId(id), 3)
    .setValue(token);
}

function getUser(id) {

  const row = getRowByUserId(id);

  if(row === -1){
    return null;
  }

  return getUserByRow(row);
}

function getRowByUserId(id) {
  for (let i = 1; i <= sheet.getLastRow(); i++) {
    if (sheet.getRange(i, 1).getValue() === id) {
      return i;
    }
  }
  return -1;
}

function getUserByRow(row) {

  return new User(
    sheet.getRange(row, 1).getValue(),
    sheet.getRange(row, 2).getValue(),
    sheet.getRange(row, 3).getValue()
  );
}

function exists(id) {
  return getRowByUserId(id) !== -1;
}
