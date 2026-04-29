const SHEET_NAME = "line_log";

const client = LineBotClient.fromChannelAccessToken(
    {
        channelAccessToken: "LYe+EcEVZU45iXW4cy+ANG3589Makj366+o5v5E3YEQU7UiUBrjRVmfoOBnguEbClRzz9I7nwMJWzWsKqFd/ByWLbz1hiymw88yNcqwPd0cS2aa30eDQ9HeKkhIFMCXSycrLqmzSPoNYrF2cLCoSHgdB04t89/1O/w1cDnyilFU="
    }
);

function doPost(e) {
    let sheet = getSheet(SHEET_NAME);
    sheet.appendRow([new Date(), e.postData.contents]);
    JSON.parse(e.postData.contents).events.forEach(event => {
        let eventType = event.type;
        switch (eventType) {
            case "message":
                // メッセージを受け取った際の処理を記述
                let messageType = event.message.type;
                switch(messageType) {
                    case "text":
                        // テキストメッセージを受け取った際の処理を記述
                        sheet.appendRow([new Date(), event.message.from, event.message.text]);
                        break;
                }
                break;
            case "follow":
                client.pushMessage(
                    {
                        to: event.message.userId,
                        messages: [{
                            type: "text",
                            text: "はじめまして！"
                        }]
                    }
                ).then();
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

    client.pushMessage(request).then();
}
