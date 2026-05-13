const TAG_SHEET_PREFIX = "TAG_";

function createTagSheet(userId) {
    if(getTagSheetByUserId(userId) == null) {
        const sheet = getSpreadSheet().insertSheet();
        sheet.setName(TAG_SHEET_PREFIX + userId);
        sheet.getRange(1, 1).setValue("NAME");
        sheet.getRange(1, 2).setValue("MINUTES");
    }
}

function getTagSheetByUserId(userId) {
    return getSheet(TAG_SHEET_PREFIX + userId);
}

function getRowByColor(color){
    return parseInt(color) + 1;
}

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
