const SPREADSHEET_ID = '17iKHodYnlD4hqSQXXnIhNXrig54tT_ZdrZxuGLTZMPs'

function getSpreadSheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet(name) {
  const sheet = getSpreadSheet().getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}

function getLastData(name) {
  return getSheet(name).getDataRange().getValues().length;
}