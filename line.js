const channelAccessToken = "LYe+EcEVZU45iXW4cy+ANG3589Makj366+o5v5E3YEQU7UiUBrjRVmfoOBnguEbClRzz9I7nwMJWzWsKqFd/ByWLbz1hiymw88yNcqwPd0cS2aa30eDQ9HeKkhIFMCXSycrLqmzSPoNYrF2cLCoSHgdB04t89/1O/w1cDnyilFU="

const URL_LINE = "https://api.line.me/v2/bot/message/";
const EP_PUSH = URL_LINE + "push";

const SHEET_NAME = "line_log";

function doPost(e){
  const sheet = getSheet(SHEET_NAME);

  const data = JSON.parse(e.postData.contents);
  const event = data.events[0];

  let text = "";

  if (event.message && event.message.type === "text") {
    text = event.message.text;
  } else {
    text = "テキスト以外";
  }

  sheet.appendRow([new Date(), event.message.userId , text]);
}

function sendTextMessage(userId, message) {
    const request = {
        to: userId,
        messages: [{
            type: "text",
            text: message
        }]
    }
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

    UrlFetchApp.fetch(PUSH_URL, options);
}

function test() {
  sendTextMessage()
}