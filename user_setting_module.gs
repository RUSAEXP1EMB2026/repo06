const SETTING_SHEET = "table";


//userIdで行を探す

function getUserSettingRow(userId) {
  const sheet = getSheet(SETTING_SHEET);

  for (let i = 1; i <= sheet.getLastRow(); i++) {
    if (sheet.getRange(i, 1).getValue() === userId) {
      return i;
    }
  }

  return -1;
}


/*
ユーザー設定の保存
key: 設定名
value: 設定値
*/
function saveUserSetting(userId, key, value) {
  const sheet = getSheet(SETTING_SHEET);
  const row = getUserSettingRow(userId);

  if (row === -1) {
    throw new Error("ユーザーが存在しません");
  }

  const col = getSettingColumn(key);

  sheet.getRange(row, col).setValue(value);
}



//ユーザー設定の読み取り

function getUserSetting(userId, key) {
  const sheet = getSheet(SETTING_SHEET);
  const row = getUserSettingRow(userId);

  if (row === -1) {
    return null;
  }

  const col = getSettingColumn(key);

  return sheet.getRange(row, col).getValue();
}



//設定項目ごとのカラム番号

function getSettingColumn(key) {
  switch (key) {
    case "notify_minutes":
      return 3;

    case "enabled":
      return 4;

    default:
      throw new Error("未知の設定キー");
  }
}



//基本設定の初期化

function initializeUserSettings(userId) {
  saveUserSetting(userId, "notify_minutes", 30);
  saveUserSetting(userId, "enabled", true);
}