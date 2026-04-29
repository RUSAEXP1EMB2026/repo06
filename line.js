const channelAccessToken = "LYe+EcEVZU45iXW4cy+ANG3589Makj366+o5v5E3YEQU7UiUBrjRVmfoOBnguEbClRzz9I7nwMJWzWsKqFd/ByWLbz1hiymw88yNcqwPd0cS2aa30eDQ9HeKkhIFMCXSycrLqmzSPoNYrF2cLCoSHgdB04t89/1O/w1cDnyilFU="

const URL_LINE = "https://api.line.me/v2/bot/message/";
const EP_PUSH = URL_LINE + "push";

const SHEET_NAME = "line_log";

function doPost(e) {
  let sheet = getSheet(SHEET_NAME);
  sheet.appendRow([new Date(), e.postData.contents]);
  JSON.parse(e.postData.contents).events.forEach(event => {
    let eventType = event.type;
    let userId = event.source.userId;
    switch (eventType) {
      case "message":
        // メッセージを受け取った際の処理を記述
        let messageType = event.message.type;
        switch(messageType) {
          case "text":
            // テキストメッセージを受け取った際の処理を記述
            sheet.appendRow([new Date(), userId, event.message.text]);
            break;
        }
        break;
      case "follow":
        sendTextMessage(userId, "ご登録ありがとうございます！\n早速ですが、GMAILアドレスを入力してください！");
        break;
    }
  })
}

function sendTextMessage(userId, message) {
    const request = {
        to: userId,
        messages: [{
            type: "text",
            text: message
        }]
    }
    const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(request),
        headers: {
            "Authorization": "Bearer " + channelAccessToken
        }
    }

    UrlFetchApp.fetch(EP_PUSH, options);
}

function test() {
  sendTextMessage("Ud4136dbc32cb08ff89e6cc561e7e4c9c", "これはテストです。");
}