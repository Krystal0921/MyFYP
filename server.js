// import "cors"
var cors = require("cors");
var express = require("express");
var app = express();
const Db = require("./login");
const u = require("./user");
const rr = require("./register");
const l = require("./lesson");
const e = require("./employment");
const c = require("./chat");
const f = require("./forum");
const myU = require("./utils");
const bodyParser = require("body-parser");
const user = require("./user");

app.use(bodyParser.json());
app.use(cors);
app.post("/", async function (req, res) {
  res.send("test API");
});

app.post("/login", async function (req, res) {
  try {
    console.log("Start Login API");
    // console.log("req :", req);
    // console.log("res :", res);
    const reqJson = req.body;
    console.log("Request : " + reqJson);
    const username = reqJson.username;
    const password = reqJson.password;
    console.log("username :", username);
    console.log("password :", password);

    const loginResult = await Db.login(reqJson.username, reqJson.password);
    console.log("Data: " + JSON.stringify(loginResult));
    res.json(loginResult);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/MemberInformation", async function (req, res) {
  try {
    console.log("Start Member Information API");
    const memberInfo = await u.getMember();
    console.log("Data: " + JSON.stringify(memberInfo));
    res.json(memberInfo);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/EmployerInformation", async function (req, res) {
  try {
    console.log("Start Employer Information API");
    const employerInfo = await u.getEmployer();
    console.log("Data: " + JSON.stringify(employerInfo));
    res.json(employerInfo);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/MemberRegister", async (req, res) => {
  try {
    console.log("Start Member Register API");
    const member = req.body;
    const generatedId = await rr.generateId(2);
    member.userId = generatedId;
    console.log("Request: " + JSON.stringify(member));
    const registerMember = await rr.addMember(member);

    console.log("Data: " + JSON.stringify(registerMember));
    res.json(registerMember);
  } catch (error) {
    console.log("Error: " + error);
    throw error;
  }
});

app.post("/EmployerRegister", async function (req, res) {
  try {
    console.log("Start Employer Register API");
    const reqJson = req.body;
    const employer = reqJson;
    const generatedId = await rr.generateId(3);
    employer.userId = generatedId;
    console.log("Request : " + JSON.stringify(employer));
    const registerEmployer = await rr.addEmployer(employer);
    console.log("Data: " + JSON.stringify(registerEmployer));
    res.json(registerEmployer);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/LessonProgress", async function (req, res) {
  try {
    console.log("Start Lesson Progress API");
    const reqJson = req.body;
    const lessonId = reqJson.lessonId;
    const memberId = reqJson.userId;
    const lessonProgress = await u.getMemberLessonProgress(memberId, lessonId);
    console.log(JSON.stringify(lessonProgress));
    res.json(lessonProgress);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

// app.post("/UpdateLessonProgress", async function (req, res) {
//   try {
//     console.log("Start Update Lesson Progress API");
//     const reqJson = req.body;
//     const  = reqJson;

//     const updateLessonProgress = await l.updateLessonProgress(
//       lessonProgress.mId,
//       lessonProgress.lessonId
//     );
//     console.log(updateLessonProgress);
//     res.end(JSON.stringify(updateLessonProgress));
//   } catch (e) {
//     console.log("Error: " + e);
//     throw e;
//   }
// });

app.post("/Lesson", async function (req, res) {
  try {
    console.log("Start Lesson API");
    const lessonList = await l.getLessonList();
    console.log("Data: " + JSON.stringify(lessonList));
    res.json(lessonList);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/Lesson/Section", async function (req, res) {
  try {
    console.log("Start Section API");
    const reqJson = req.body;
    const lessonId = reqJson.lessonId;
    const sectionList = await l.getSectionList(lessonId);
    console.log(JSON.stringify(sectionList));
    res.json(sectionList);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/Lesson/Section/Content", async function (req, res) {
  try {
    console.log("Start Section Content API");
    const reqJson = req.body;
    const lessonId = reqJson.lessonId;
    const sectionId = reqJson.sectionId;
    const sectionContent = await l.getSectionDetail(lessonId, sectionId);
    console.log(JSON.stringify(sectionContent));
    res.json(sectionContent);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/CreateSection", async function (req, res) {
  try {
    console.log("Start Create Section API");
    const reqJson = req.body;
    const section = reqJson;
    const gId = await myU.generateSectionId(section.lessonId);
    section.sectionId = gId;

    console.log("Request : " + JSON.stringify(section));
    const createSection = await l.createSection(section);

    console.log("Data: " + JSON.stringify(createSection));

    res.json(createSection);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/CreateSectionContent", async function (req, res) {
  try {
    console.log("Start Create Section Content API");
    const reqJson = req.body;
    const sectionContent = reqJson;
    const gId = await myU.generateContentId();
    sectionContent.contentId = gId;
    console.log(gId);
    console.log("Request : " + JSON.stringify(sectionContent));
    const createSectionContent = await l.createSectionContent(sectionContent);
    console.log("Data: " + JSON.stringify(createSectionContent));
    res.json(createSectionContent);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/EditSection", async function (req, res) {
  try {
    console.log("Start Edit Section Content API");
    const reqJson = req.body;
    const section = reqJson;
    console.log("Request : " + JSON.stringify(section));
    const editSection = await l.editSection(section);
    console.log("Data: " + JSON.stringify(editSection));
    res.json(editSection);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/EditSectionContent", async function (req, res) {
  try {
    console.log("Start Create Section Content API");
    const reqJson = req.body;
    const sectionContent = reqJson;
    console.log("Request : " + JSON.stringify(sectionContent));
    const editSectionContent = await l.editSectionContent(sectionContent);
    console.log("Data: " + JSON.stringify(editSectionContent));
    res.json(editSectionContent);
    res.end(JSON.stringify(editSectionContent));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/JobList", async function (req, res) {
  try {
    console.log("Start Job List API");
    const jobList = await e.jobList();
    console.log(jobList);
    res.end(JSON.stringify(jobList));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/SearchJob", async function (req, res) {
  try {
    console.log("Start Search Job  API");
    const reqJson = req.body;
    const keyword = reqJson.keyword;
    const searchJob = await e.searchJob(keyword);
    console.log(searchJob);
    res.end(JSON.stringify(searchJob));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/AddJob", async function (req, res) {
  try {
    console.log("Start Add Job API");
    const reqJson = req.body;
    const job = reqJson;
    const gId = await myU.generateJodId();
    job.jId = gId;

    console.log("Request : " + JSON.stringify(job));
    const addJob = await e.addJob(job);
    console.log("Data: " + JSON.stringify(addJob));
    res.end(JSON.stringify(addJob));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/ChatList", async function (req, res) {
  try {
    console.log("Start Chat List API");
    const reqJson = req.body;
    const userId = reqJson.userId;
    const chatList = await c.chatList(userId);
    console.log(chatList);
    res.end(JSON.stringify(chatList));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/ChatMessage", async function (req, res) {
  try {
    console.log("Start Chat Message API");
    const reqJson = req.body;
    const chatId = reqJson.chatId;
    const ChatMessage = await c.chatMessage(chatId);
    console.log(ChatMessage);
    res.end(JSON.stringify(ChatMessage));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/CreateChat", async function (req, res) {
  try {
    console.log("Start Create Chat API");
    const reqJson = req.body;
    const chat = reqJson;

    const gId = await myU.generateChatId();

    chat.chatId = gId;
    console.log(gId);
    console.log("Request : " + JSON.stringify(chat));

    const createChat = await c.createChat(chat);
    console.log("Data: " + JSON.stringify(createChat));
    res.end(JSON.stringify(createChat));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/CreateChatMsg", async function (req, res) {
  try {
    console.log("Start Create Chat Msg API");
    const reqJson = req.body;

    const chatMsg = reqJson;

    const gId = await myU.generateChatMsgId(chatMsg.chatId);

    chatMsg.msgId = gId;
    console.log(gId);
    console.log("Request : " + JSON.stringify(chatMsg));

    const createChatMsg = await c.createChatMsg(chatMsg);
    console.log("Data: " + JSON.stringify(createChatMsg));
    res.end(JSON.stringify(createChatMsg));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/ApplyJob", async function (req, res) {
  try {
    console.log("Start Apply job API");
    const reqJson = req.body;
    const applyMember = reqJson;
    const gId = await myU.generateApplyId(applyMember.jId);

    applyMember.aId = gId;
    console.log(gId);
    console.log("Request : " + JSON.stringify(applyMember));

    const applyJob = await e.applyJob(applyMember);
    console.log("Data: " + JSON.stringify(applyJob));
    res.end(JSON.stringify(applyJob));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/ApplyList", async function (req, res) {
  try {
    console.log("Start Apply List API");
    const reqJson = req.body;
    const jId = reqJson.jId;
    const applyList = await e.applyList(jId);
    console.log(applyList);
    res.end(JSON.stringify(applyList));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/CreatePost", async function (req, res) {
  try {
    console.log("Start Create Post API");
    const reqJson = req.body;
    const post = reqJson;

    const gId = await myU.generatePostId();

    post.postId = gId;
    console.log(gId);
    console.log("Request : " + JSON.stringify(post));

    const createPost = await f.createPost(post);
    console.log("Data: " + JSON.stringify(createPost));
    res.end(JSON.stringify(createPost));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/CreateComment", async function (req, res) {
  try {
    console.log("Start Create Comment API");
    const reqJson = req.body;
    const comment = reqJson;

    const gId = await myU.generateCommentId(comment.postId);

    comment.commentId = gId;
    console.log(gId);
    console.log("Request : " + JSON.stringify(comment));

    const createComment = await f.createComment(comment);
    console.log("Data: " + JSON.stringify(createComment));
    res.end(JSON.stringify(createComment));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/Forum", async function (req, res) {
  try {
    console.log("Start Post List API");
    const postList = await f.postList();
    console.log(postList);
    res.end(JSON.stringify(postList));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/PostComment", async function (req, res) {
  try {
    console.log("Start Comment API");
    const reqJson = req.body;
    const postId = reqJson.postId;
    const getComment = await f.getComment(postId);
    console.log(getComment);
    res.end(JSON.stringify(getComment));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/ChangeCreatePostActive", async function (req, res) {
  try {
    console.log("Start Change Create Post Active API");
    const reqJson = req.body;
    const mId = reqJson.mId;
    console.log("Request : " + JSON.stringify(mId));

    const changeCreatePostActive = await f.changeCreatePostActive(mId);
    console.log("Data: " + JSON.stringify(changeCreatePostActive));
    res.end(JSON.stringify(changeCreatePostActive));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/ChangeCreateCommentActive", async function (req, res) {
  try {
    console.log("Start Change Create Comment Active API");
    const reqJson = req.body;
    const mId = reqJson.mId;
    console.log("Request : " + JSON.stringify(mId));

    const changeCreateCommentActive = await f.changeCreateCommentActive(mId);
    console.log("Data: " + JSON.stringify(changeCreateCommentActive));
    res.end(JSON.stringify(changeCreateCommentActive));
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server On http://%s:%s", host, port);
});
