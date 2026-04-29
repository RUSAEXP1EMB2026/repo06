function getSheet(name) {
  const SPREADSHEET_ID = '17iKHodYnlD4hqSQXXnIhNXrig54tT_ZdrZxuGLTZMPs'
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}

function getLastData(name) {
  return getSheet(name).getDataRange().getValues().length;
}