var express = require('express');
var app = express();
const Db = require("./login");
const rr = require("./register");
const l = require("./lesson");
const e = require("./employment");
const c = require("./chat");
const myU = require('./utils');
const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.post('/', async function (req, res) {
  res.send('Hello World123');
})

app.post('/login', async function (req, res) {
  try {
    console.log("Start Login API")
    const reqJson = (req.body)
    console.log("Request : " + JSON.stringify(reqJson))
    const loginResult = await Db.login(reqJson.username, reqJson.password, reqJson.type);
    console.log("Data: " + loginResult);
    res.end(JSON.stringify(loginResult))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
})

app.post('/MemberRegister', async function (req, res) {
  try {
    console.log("Start Member Register API")
    const reqJson = (req.body)
    const member = reqJson
    const generatedId = await rr.generateId("member");
    member.mId = generatedId;
    console.log("Request : " + JSON.stringify(member))
    const registerMember = await rr.addMember(member);
    console.log("Data: " + registerMember);
    res.end(JSON.stringify(registerMember))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
})

app.post('/EmployerRegister', async function (req, res) {
  try {
    console.log("Start Employer Register API")
    const reqJson = (req.body)
    const employer = reqJson
    const generatedId = await rr.generateId("employer");
    employer.eId = generatedId;
    console.log("Request : " + JSON.stringify(employer))
    const registerEmployer = await rr.addEmployer(employer);
    console.log("Data: " + registerEmployer);
    res.end(JSON.stringify(registerEmployer))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
})

app.post('/Lesson', async function (req, res) {
  try {
    console.log("Start Lesson API")
    const lessonList = await l.lessonList()
    console.log(lessonList)
    res.end(JSON.stringify(lessonList))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
});

app.post('/Lesson/Section', async function (req, res) {
  try {
    console.log("Start Section API")
    const reqJson = (req.body)
    const lessonId = reqJson.lessonId
    const sectionList = await l.sectionList(lessonId)
    console.log(sectionList)
    res.end(JSON.stringify(sectionList))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
});

app.post('/Lesson/Section/Content', async function (req, res) {
  try {
    console.log("Start Section Content API")
    const reqJson = (req.body)
    const lessonId = reqJson.lessonId
    const sectionId = reqJson.sectionId
    const sectionContent = await l.getSectionDetail(lessonId, sectionId)
    console.log(sectionContent)
    res.end(JSON.stringify(sectionContent))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
});

app.post('/CreateSection', async function (req, res) {
  try {
    console.log("Start Create Section API")
    const reqJson = (req.body)
    const section = reqJson 
    
    const gId = await myU.generateSectionId(section.lessonId)
    
    section.sectionId = gId;
    console.log(gId)
    console.log("Request : " + JSON.stringify(section))

    const createSection = await l.createSection(section)
    console.log("Data: " + JSON.stringify(createSection));
    res.end(JSON.stringify(createSection))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
})

app.post('/CreateSectionContent', async function (req, res) {
  try {
    console.log("Start Create Section Content API")
    const reqJson = (req.body)
    const sectionContent = reqJson
    const gId = await myU.generateContentId()
    sectionContent.contentId = gId;
    console.log(gId)
    console.log("Request : " + JSON.stringify(sectionContent))
    const createSectionContent = await l.createSectionContent(sectionContent)
    console.log("Data: " + JSON.stringify(createSectionContent));
    res.end(JSON.stringify(createSectionContent))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
})

app.post('/EditSection', async function (req, res) {
  try {
    console.log("Start Edit Section Content API")
    const reqJson = (req.body)
    const section = reqJson
    console.log("Request : " + JSON.stringify(section))
    const editSection = await l.editSection(section)
    console.log("Data: " + JSON.stringify(editSection));
    res.end(JSON.stringify(editSection))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
});

app.post('/EditSectionContent', async function (req, res) {
  try {
    console.log("Start Create Section Content API")
    const reqJson = (req.body)
    const sectionContent = reqJson
    console.log("Request : " + JSON.stringify(sectionContent))
    const createSectionContent = await l.createSectionContent(sectionContent)
    console.log("Data: " + JSON.stringify(createSectionContent));
    res.end(JSON.stringify(createSectionContent))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
})

app.post('/JobList', async function (req, res) {
  try {
    console.log("Start Job List API")
    const jobList = await e.jobList()
    console.log(jobList)
    res.end(JSON.stringify(jobList))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
});

app.post('/SearchJob', async function (req, res) {
  try {
    console.log("Start Search Job  API")
    const reqJson = (req.body)
    const keyword = reqJson.keyword
    const searchJob = await e.searchJob(keyword)
    console.log(searchJob)
    res.end(JSON.stringify(searchJob))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
});


app.post('/AddJob', async function (req, res) {
  try {
    console.log("Start Add Job API")
    const reqJson = (req.body)
    const job = reqJson 
    const gId = await myU.generateJodId()
    job.jId = gId

    console.log("Request : " + JSON.stringify(job))
    const addJob = await e.addJob(job)
    console.log("Data: " + JSON.stringify(addJob));
    res.end(JSON.stringify(addJob))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
})

app.post('/ChatList', async function (req, res) {
  try {
    console.log("Start Chat List API")
    const reqJson = (req.body)
    const userId = reqJson.userId
    const chatList = await c.chatList(userId)
    console.log(chatList)
    res.end(JSON.stringify(chatList))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
});

app.post('/ChatMessage', async function (req, res) {
  try {
    console.log("Start Chat Message API")
    const reqJson = (req.body)
    const chatId = reqJson.chatId
    const ChatMessage = await c.chatMessage(chatId)
    console.log(ChatMessage)
    res.end(JSON.stringify(ChatMessage))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
});


app.post('/CreateChat', async function (req, res) {
  try {
    console.log("Start Create Chat API")
    const reqJson = (req.body)
    const chat = reqJson 
    
    const gId = await myU.generateChatId()
    
    chat.chatId = gId;
    console.log(gId)
    console.log("Request : " + JSON.stringify(chat))

    const createChat = await c.createChat(chat)
    console.log("Data: " + JSON.stringify(createChat));
    res.end(JSON.stringify(createChat))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
})

app.post('/CreateChatMsg', async function (req, res) {
  try {
    console.log("Start Create Chat Msg API")
    const reqJson = (req.body)
    
    const chatMsg = reqJson 
    
    const gId = await myU.generateChatMsgId(chatMsg.chatId)
   
    chatMsg.msgId = gId;
    console.log(gId)
    console.log("Request : " + JSON.stringify(chatMsg))

    const createChatMsg = await c.createChatMsg(chatMsg)
    console.log("Data: " + JSON.stringify(createChatMsg));
    res.end(JSON.stringify(createChatMsg))
  } catch (e) {
    console.log("Error: " + e);
    throw e
  }
})



var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})