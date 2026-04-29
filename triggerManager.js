const ago = 30; //minutes

const trigger_list = [];

function getSchedules() {
    return []; //TODO: カレンダーから時刻を取得
}

/* @trigger 毎日実行 */
function generateObservingTrigger() {
    getSchedules().forEach(schedule => {
        trigger_list.push(new TriggerData(
            GoogleAppsScript
                .newTrigger("") //TODO: センサー情報を取得して通知する関数
                .timeBased()
                .everyMinutes(1),
            schedule.time
        ));
    })
}

/* @trigger 一分おきに実行 */
function run() {
    for (const data of trigger_list) {
        const time = data.time;
        if (time.valueOf() - ago * 60 * 1000 <= Date.now().valueOf() && !data.running) {
            data.trigger.create();
            data.running = true;
        } else if (time.valueOf() <= Date.now().valueOf()) {
            GoogleAppsScript.deleteTrigger(data.trigger);
            trigger_list.splice(trigger_list.indexOf(data), 1);
            data.running = false;
        }
    }
}
