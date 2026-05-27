// APIからデータを取得する共通関数
function getNatureRemoData(endpoint, user_id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("table");
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(1,1,lastRow,3).getValues();
  const idList = data.map(row => row[0]);
  const index = idList.indexOf(user_id);
  if(index === -1){
    throw new Error("ユーザーID:"+ user_id +"のトークンが見つかりません。");
  }
  const UserToken = data[index][2];

  const headers = {
    "Content-Type" : "application/json;",
    'Authorization': 'Bearer ' + UserToken,
  };

  const options = {
    "method" : "get",
    "headers" : headers,
  };

  return JSON.parse(UrlFetchApp.fetch("https://api.nature.global/1/" + endpoint, options));
}

// 人感センサの値(1または0)だけを返す関数
function getMotionStatus(user_id) {
  const deviceData = getNatureRemoData("devices",user_id);
  if (!deviceData || deviceData.length === 0) return 0;
  const moEvent = deviceData[0].newest_events.mo;
  
  // センサデータがそもそも存在しない場合は0を返す
  if (!moEvent) return 0; 

  // 1. Nature Remoが検知した「最新の反応時刻」をDateオブジェクトに変換
  const lastMotionTime = new Date(moEvent.created_at);
  
  // 2. このスクリプトが動いている「現在時刻」を取得
  const now = new Date();
  
  // 3. 現在時刻と最新反応時刻の「時間差」を計算（ミリ秒を「分」に変換）
  const diffMinutes = (now.getTime() - lastMotionTime.getTime()) / (1000 * 60);
  
  // 4. 何分以内の反応なら「人がいる」と判定するか（閾値）を設定
  const THRESHOLD_MINUTES = 5; 
  
  let moStatus = 0; // 初期値は0（いない）

  // 時間差が閾値以内なら「1（いる）」にする
  if (diffMinutes <= THRESHOLD_MINUTES) {
    moStatus = 1; 
  }
  return moStatus; 
}