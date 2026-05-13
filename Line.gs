const channelAccessToken = "LYe+EcEVZU45iXW4cy+ANG3589Makj366+o5v5E3YEQU7UiUBrjRVmfoOBnguEbClRzz9I7nwMJWzWsKqFd/ByWLbz1hiymw88yNcqwPd0cS2aa30eDQ9HeKkhIFMCXSycrLqmzSPoNYrF2cLCoSHgdB04t89/1O/w1cDnyilFU="

const COMMAND_HELP = "help";
const COMMAND_REGISTER = "register";
const COMMAND_TAG = "tag";

const URL_LINE = "https://api.line.me/v2/bot/message/";
const EP_PUSH = URL_LINE + "push";

const LINE_SHEET_NAME = "line_log";

function doPost(e) {
    let sheet = getSheet(LINE_SHEET_NAME);
    JSON.parse(e.postData.contents).events.forEach(event => {
        let eventType = event.type;
        let userId = event.source.userId;
        sheet.appendRow([
            new Date(),
            userId,
            eventType
        ]);
        switch (eventType) {
            case "message":
                // メッセージを受け取った際の処理を記述
                let messageType = event.message.type;
                switch(messageType) {
                    case "text":
                        // テキストメッセージを受け取った際の処理を記述
                        let text = event.message.text;
                        sheet.appendRow([
                            new Date(),
                            userId,
                            text
                        ]);
                        if(text.startsWith("!")){
                            let fragments = text.slice(1).split(" ");
                            let command = fragments[0];
                            fragments.shift();
                            handleCommand(event, command, fragments);
                        }
                        break;
                }
                break;
            case "follow":
                sendTextMessage(userId, [
                    "ご登録ありがとうございます！",
                    "\"!help\"コマンドを送信してコマンドの使用方法を参照し、Gmailアドレスを登録してください！"
                ].join("\n"));
                createTagSheet(userId);
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

function handleCommand(event, command, args) {
    let userId = event.source.userId;
    switch (command) {
        case COMMAND_HELP:
            sendTextMessage(userId, [
                "使用可能なコマンドは以下のとおりです。",
                "",
                "!help: 各種コマンドの使用方法を表示",
                "!register [Gmailアドレス]: Gmailアドレスを登録",
                "!tag add [タグ名] [色番号] [所要時間(分)]: 所要時間タグを追加",
                "!tag remove [タグ番号]: 所要時間タグを削除",
                "!tag list: 所要時間タグの一覧を表示",
                "!tag color: 使用可能な色の番号との対応を表示"
            ].join("\n"));
            break;
        case COMMAND_REGISTER:
            let email = args[0];
            if(email.match(/.+@gmail\.com$/)){
                setGmail(userId, email);
                sendTextMessage(userId, "Gmailアドレスの登録に成功しました！");
            }else{
                sendTextMessage(userId, "正しいGmailアドレスを入力してください。");
            }
            break;
        case COMMAND_TAG:
            let option = args[0];
            let tag;
            let color;
            switch(option){
                case "add":
                    tag = args[1];
                    color = args[2];
                    let minutes = args[3];
                    if(1 <= parseInt(color) && parseInt(color) <= 11 && isFinite(minutes)){
                        setTag(userId, tag, minutes, color);
                        sendTextMessage(userId, "タグを追加しました。");
                    }else{
                        sendTextMessage(userId, "正しい引数を指定してください。");
                    }
                    break;
                case "remove":
                    color = args[1];
                    if(getTags(userId).filter(tag => tag.color === color).length === 1) {
                        setTag(userId, "", "", color);
                        sendTextMessage(userId, "タグを削除しました。");
                    }else{
                        sendTextMessage(userId, "指定されたタグが存在しません。");
                    }
                    break;
                case "list":
                    const list = getTags(userId);
                    if(getTags(userId).length > 0) {
                        sendTextMessage(userId, list.map(tag => "タグ番号" + tag.color + ": {タグ名: " + tag.name + ", 所要時間: " + tag.minutes + "分}").join(",\n"));
                    }else{
                        sendTextMessage(userId, "タグが設定されていません。");
                    }
                    break;
                case "color":
                    sendTextMessage(userId, "色番号: 名前,\n" + COLOR_NAME_LIST.keys().map(key => (parseInt(key) + 1) + ": " + COLOR_NAME_LIST[key]).join(",\n"));
                    break;
                default:
                    sendTextMessage(userId, "正しいオプションを指定してください。");
                    break;
            }
    }
}
