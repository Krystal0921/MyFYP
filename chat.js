const connection = require("./dbConnect");
const r = require("./requestHandle");
const util = require("util");
const myU = require("./utils");

async function chatList(id) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const query1 = `SELECT c.chatId, c.createAt, c.receiverId AS "sender",
    CASE
      WHEN c.receiverId LIKE 'e%' THEN ue.eName
      ELSE um.mName
    END AS userName
FROM project.chat c
LEFT JOIN project.user_employer ue ON c.receiverId = ue.eId 
LEFT JOIN project.user_member um ON c.receiverId = um.mId 
WHERE c.senderId = ? 
UNION
SELECT c.chatId, c.createAt, c.senderId AS "sender",
    CASE
      WHEN c.senderId LIKE 'e%' THEN ue.eName
      ELSE um.mName
    END AS userName
FROM project.chat c
LEFT JOIN project.user_employer ue ON c.senderId = ue.eId 
LEFT JOIN project.user_member um ON c.senderId = um.mId 
WHERE c.receiverId = ? 
ORDER BY chatId`;

    const results = await query(query1, [id, id]);

    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, error, 1, "");
  }
}

async function chatMessage(chatId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT * FROM project.chat_content WHERE chatId = ? ",
      [chatId]
    );
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function createChat(chat) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query(
      "SELECT * FROM project.chat WHERE (senderId = ? AND receiverId = ? )OR (senderId = ? AND receiverId = ?)",
      [chat.senderId, chat.receiverId, chat.receiverId, chat.senderId]
    );

    if (check.length > 0) {
      return r.requestHandle(false, "chat box exist", 1, "");
    } else {
      const results = await query("INSERT INTO project.chat SET ?", chat);
      console.log("New chat box successfully.");
      return r.requestHandle(
        true,
        "New chat box added successfully.",
        0,
        chat.chatId
      );
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

async function createChatMsg(chatMsg) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query("SELECT * FROM project.chat WHERE chatId =?", [
      chatMsg.chatId,
    ]);
    console.log("1");
    check2 = await query(
      "SELECT * FROM project.chat WHERE senderId = ? OR receiverId = ?",
      [chatMsg.userId, chatMsg.userId]
    );

    if (check.length < 1) {
      return r.requestHandle(false, "chat box not exist", 1, "");
    } else if (check2.length < 1) {
      return r.requestHandle(false, "chat box error", 2, "");
    } else {
      const results = await query(
        "INSERT INTO project.chat_content SET ?",
        chatMsg
      );
      console.log("New chat msg successfully.");
      return r.requestHandle(
        true,
        "New chat msg added successfully.",
        0,
        chatMsg
      );
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 3, "");
  }
}

module.exports = {
  chatList: chatList,
  chatMessage: chatMessage,
  createChat: createChat,
  createChatMsg: createChatMsg,
};
