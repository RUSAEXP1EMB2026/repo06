const TAG_SHEET_PREFIX = "TAG_";

/* 指定したユーザーのタグを管理するシートを生成する関数 */
function createTagSheet(userId) {
    if(getTagSheetByUserId(userId) == null) {
        const sheet = getSpreadSheet().insertSheet();
        sheet.setName(TAG_SHEET_PREFIX + userId);
        sheet.getRange(1, 1).setValue("NAME");
        sheet.getRange(1, 2).setValue("MINUTES");
    }
}

/* 指定した色に対応するTagInstanceを取得する関数 */
function getTagByColor(userId, color) {
  const tags = getTags(userId);
  tags.forEach(tag => {
    if(tag.color == color) return tag;
  });
  return tag;
}

/* 指定したユーザーのタグ管理シートを取得する関数 */
function getTagSheetByUserId(userId) {
  return getSheet(TAG_SHEET_PREFIX + userId);
}

/* 色番号から対応する行番号を取得する関数 */
function getRowByColor(color){
  return parseInt(color) + 1;
}

/* 指定したユーザーが設定したタグの配列を取得する関数 */
function getTags(userId) {
    const sheet = getTagSheetByUserId(userId);
    let list = [];
    for(i = 1; i <= 11; i++){
        const name = sheet.getRange(i + 1, 1).getValue();
        const minutes = sheet.getRange(i + 1, 2).getValue();
        if(name !== "" && minutes !== ""){
            list.push(new TagInstance(name, minutes, i.toString()));
        }
    }
    return list;
}

/* 指定したユーザーのタグを設定する関数 */
function setTag(userId, name, minutes, color){
    let sheet = getTagSheetByUserId(userId);
    if(sheet === null) {
        createTagSheet(userId);
        sheet = getTagSheetByUserId(userId);
    }
    const row = getRowByColor(color);
    sheet.getRange(row, 1).setValue(name);
    sheet.getRange(row, 2).setValue(minutes);
}
