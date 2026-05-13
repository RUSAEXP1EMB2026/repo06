// 設定
const SCHEDULE_SHEET = "schedule_table"; //新しいシートを一枚作っておくこと

/*
毎日真夜中 実行用
今日のすべてのユーザー スケジュールを計算して保存
*/
function rebuildTodaySchedules() {
  const sheet = getSheet(SCHEDULE_SHEET);
  sheet.clearContents();

  const userSheet = getSheet("table");
  const lastRow = userSheet.getLastRow();

  for (let row = 2; row <= lastRow; row++) {
    const user = getUserByRow(row);

    // user.gmail 使用
    const calendar = CalendarApp.getCalendarById(user.gmail);
    if (!calendar) continue;

    const start = new Date();
    start.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);

    const events = calendar.getEvents(start, end);

    events.forEach(event => {
      const eventTime = event.getStartTime();

      // まずは基本30分前
      const notifyTime = new Date(
        eventTime.getTime() - 30 * 60 * 1000
      );

      sheet.appendRow([
        user.userId,
        user.gmail,
        eventTime,
        notifyTime,
        false // すでに通知を送ったかどうか
      ]);
    });
  }
}


/*
1分ごとに実行
notifyTimeに達したら
Nature Remoを確認した後、LINE通知
*/
function checkAndNotify() {
  const sheet = getSheet(SCHEDULE_SHEET);
  const lastRow = sheet.getLastRow();

  const now = new Date();

  for (let row = 2; row <= lastRow; row++) {
    const userId = sheet.getRange(row, 1).getValue();
    const eventTime = sheet.getRange(row, 3).getValue();
    const notifyTime = sheet.getRange(row, 4).getValue();
    const alreadySent = sheet.getRange(row, 5).getValue();

    if (alreadySent) continue;

    // お知らせ 時間が過ぎたのか？
    if (notifyTime <= now && now <= eventTime) {

      // 自宅にいるか確認
      const mo = getMotionStatus();

      if (mo === 1) {
        sendTextMessage(
          userId,
          "任意の言葉！"
        );

        sheet.getRange(row, 5).setValue(true);
      }
    }
  }
}


/*
 トリガーの自動生成（手動実行は一度だけ）
*/
function setupMyTriggers() {
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