const SPREADSHEET_ID = '17iKHodYnlD4hqSQXXnIhNXrig54tT_ZdrZxuGLTZMPs'

function getSpreadSheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet(name) {
  return getSpreadSheet().getSheetByName(name);
}

function getLastData(name) {
  return getSheet(name).getDataRange().getValues().length;
}