const SCHEDULE_SHEET = "schedule_table";
const DEFAULT_TRAVEL_MINUTES = 30;//タグがないスケジュールの場合の基本移動時間

/*
カレンダーの色に対応する移動時間を取得する
*/
function getTravelMinutesByCalendarColor(userId, color) {
  const tagSheet = getTagSheetByUserId(userId);

  if (tagSheet === null || !color) {
    return DEFAULT_TRAVEL_MINUTES;
  }

  const row = getRowByColor(color);
  const minutes = tagSheet.getRange(row, 2).getValue();

  if (minutes === "" || isNaN(minutes)) {
    return DEFAULT_TRAVEL_MINUTES;
  }

  return Number(minutes);
}

/*
出発時間の計算
*/
function calculateDepartureTime(eventTime, travelMinutes) {
  return new Date(
    eventTime.getTime() - travelMinutes * 60 * 1000
  );
}

/*
schedule_table 作成またはインポート
*/
function getOrCreateScheduleSheet() {
  let sheet = getSheet(SCHEDULE_SHEET);

  if (sheet === null) {
    sheet = getSpreadSheet().insertSheet();
    sheet.setName(SCHEDULE_SHEET);
  }

  return sheet;
}

/*
毎日0時に実行
今日の予定を読み込み、
カレンダーの色別移動時間で出発時間を計算して保存
*/
function rebuildTodaySchedules() {
  const sheet = getOrCreateScheduleSheet();

  sheet.clearContents();
  sheet.appendRow([
    "USER_ID",
    "GMAIL",
    "EVENT_TITLE",
    "EVENT_START_TIME",
    "CALENDAR_COLOR",
    "TRAVEL_MINUTES",
    "DEPARTURE_TIME",
    "SENT"
  ]);

  const userSheet = getSheet("table");
  const lastRow = userSheet.getLastRow();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  for (let row = 2; row <= lastRow; row++) {
    const user = getUserByRow(row);

    if (!user.userId || !user.gmail) continue;

    const calendar = CalendarApp.getCalendarById(user.gmail);
    if (calendar === null) continue;

    const events = calendar.getEvents(start, end);

    events.forEach(event => {
      const eventTitle = event.getTitle();
      const eventStartTime = event.getStartTime();

      const calendarColor = event.getColor();

      const travelMinutes = getTravelMinutesByCalendarColor(
        user.userId,
        calendarColor
      );

      const departureTime = calculateDepartureTime(
        eventStartTime,
        travelMinutes
      );

      sheet.appendRow([
        user.userId,
        user.gmail,
        eventTitle,
        eventStartTime,
        calendarColor,
        travelMinutes,
        departureTime,
        false
      ]);
    });
  }
}

/*
1分ごとに実行
出発時間になると Nature Remo 確認後 LINE通知
*/
function checkAndNotify() {
  const sheet = getOrCreateScheduleSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return;

  const now = new Date();

  for (let row = 2; row <= lastRow; row++) {
    const userId = sheet.getRange(row, 1).getValue();
    const eventTitle = sheet.getRange(row, 3).getValue();
    const eventStartTime = sheet.getRange(row, 4).getValue();
    const calendarColor = sheet.getRange(row, 5).getValue();
    const travelMinutes = sheet.getRange(row, 6).getValue();
    const departureTime = sheet.getRange(row, 7).getValue();
    const alreadySent = sheet.getRange(row, 8).getValue();

    if (alreadySent === true) continue;
    if (!userId || !eventStartTime || !departureTime) continue;

    if (departureTime <= now && now <= eventStartTime) {
      const moStatus = getMotionStatus(userId);

      if (moStatus === 1) {
        sendTextMessage(
          userId,
          [
            "出発時間です！",
            "",
            "予定: " + eventTitle,
            "開始時刻: " + Utilities.formatDate(eventStartTime, "Asia/Tokyo", "HH:mm"),
            "移動時間: " + travelMinutes + "分",
            "カレンダー色番号: " + calendarColor,
            "",
            "まだ家にいるようです。準備して出発してください。"
          ].join("\n")
        );

        sheet.getRange(row, 8).setValue(true);
      }
    }
  }
}

/*
トリガー作成
手動で1回だけ実行
*/
function setupMyTriggers() {
  deleteMyTriggers();

  ScriptApp.newTrigger("rebuildTodaySchedules")
    .timeBased()
    .everyDays(1)
    .atHour(0)
    .create();

  ScriptApp.newTrigger("checkAndNotify")
    .timeBased()
    .everyMinutes(1)
    .create();
}

/*
重複トリガー削除
*/
function deleteMyTriggers() {
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach(trigger => {
    const name = trigger.getHandlerFunction();

    if (
      name === "rebuildTodaySchedules" ||
      name === "checkAndNotify"
    ) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}