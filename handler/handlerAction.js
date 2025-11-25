const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
        const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

        return async function (event) {
                // Skip if event is null or undefined
                if (!event) return;

                // Debug log for received events
                if (event.type === 'message' || event.type === 'message_reply') {
                        console.log(`📨 Received message from ${event.senderID} in thread ${event.threadID}: ${event.body}`);
                }

                // Check if the bot is in the inbox and anti inbox is enabled
                if (
                        global.GoatBot.config.antiInbox == true &&
                        (event.senderID == event.threadID || event.userID == event.senderID || event.isGroup == false) &&
                        (event.senderID || event.userID || event.isGroup == false)
                )
                        return;

                const message = createFuncMessage(api, event);

                await handlerCheckDB(usersData, threadsData, event);
                const handlerChat = await handlerEvents(event, message);
                if (!handlerChat)
                        return;

                const {
                        onAnyEvent, onFirstChat, onStart, onChat,
                        onReply, onEvent, handlerEvent, onReaction,
                        typ, presence, read_receipt
                } = handlerChat;


                onAnyEvent();
                switch (event.type) {
                        case "message":
                        case "message_reply":
                        case "message_unsend":
                                onFirstChat();
                                onChat();
                                onStart();
                                onReply();
                                break;
                        case "event":
                                handlerEvent();
                                onEvent();
                                break;
                        case "message_reaction":
                                onReaction();
                                break;
                        case "typ":
                                typ();
                                break;
                        case "presence":
                                presence();
                                break;
                        case "read_receipt":
                                read_receipt();
                                break;
                        // case "friend_request_received":
                        // { /* code block */ }
                        // break;

                        // case "friend_request_cancel"
                        // { /* code block */ }
                        // break;
                        default:
                                break;
                }
        };
};