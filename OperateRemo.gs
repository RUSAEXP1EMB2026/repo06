// APIからデータを取得する共通関数
function getNatureRemoData(endpoint) {
  const REMO_ACCESS_TOKEN = 'nature remo3のアクセストークン'
  const headers = {
    "Content-Type" : "application/json;",
    'Authorization': 'Bearer ' + REMO_ACCESS_TOKEN,
  };

  const options = {
    "method" : "get",
    "headers" : headers,
  };

  return JSON.parse(UrlFetchApp.fetch("https://api.nature.global/1/" + endpoint, options));
}

// 人感センサの値(1または0)だけを返す関数
function getMotionStatus() {
  const deviceData = getNatureRemoData("devices");
  const mo = deviceData[0].newest_events.mo ? deviceData[0].newest_events.mo.val : 0;
  const lastRow = getLastData("sensor");
  setSensorData({mo: mo}, lastRow + 1);
  
  return mo; // ← ここで呼び出し元に数値を返す
}

//人感センサが反応したかどうかのログを残す用
function setSensorData(data, row) {
  getSheet('sensor').getRange(row, 1, 1, 2).setValues([[new Date(), data.mo]]);
}
