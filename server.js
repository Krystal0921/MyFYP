// import "cors"

var cors = require("cors");
var express = require("express");
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
const Db = require("./login");
const u = require("./user");
const rr = require("./register");
const l = require("./lesson");
const e = require("./employment");
const c = require("./chat");
const f = require("./forum");
const myU = require("./utils");
const user = require("./user");

app.use(bodyParser.json());
app.use(cors());
app.post("/", async function (req, res) {
  res.send("test API");
});

app.post("/login", async function (req, res) {
  try {
    console.log("Start Login API");
    const reqJson = req.body;
    console.log("Request : " + reqJson);

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
    const employerInfo = await user.getEmployer();
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

app.post("/MemberDetail", async function (req, res) {
  try {
    console.log("Start Member Detail API");
    const reqJson = req.body;
    const mId = reqJson.mId;
    const member = await Db.Member(mId);
    console.log(JSON.stringify(member));
    res.json(member);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/EmployerDetail", async function (req, res) {
  try {
    console.log("Start Employer Detail API");
    const reqJson = req.body;
    const eId = reqJson.eId;
    const employer = await Db.Employer(eId);
    console.log(JSON.stringify(employer));
    res.json(employer);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/MemberLessonProgress", async function (req, res) {
  try {
    console.log("Start Member Lesson Progress API");
    const reqJson = req.body;
    const mId = reqJson.mId;
    const getMemberLessonProgress = await u.getMemberLessonProgress(mId);
    console.log(getMemberLessonProgress);
    res.json(getMemberLessonProgress);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/UpdateLessonProgress", async function (req, res) {
  try {
    console.log("Start Update Lesson Progress API");
    const reqJson = req.body;
    const lessonProgress = reqJson;
    const updateLessonProgress = await l.updateLessonProgress(
      lessonProgress.mId,
      lessonProgress.lessonId,
      lessonProgress.sectionId
    );
    console.log(updateLessonProgress);
    res.json(updateLessonProgress);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

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

app.post("/Lesson/Section/Quiz", async function (req, res) {
  try {
    console.log("Start Quiz API");
    const reqJson = req.body;
    const mId = reqJson.mId;
    const lessonId = reqJson.lessonId;
    const quiz = await l.getQuiz(mId, lessonId);
    console.log(JSON.stringify(quiz));
    res.json(quiz);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/Lesson/Section/publicQuiz", async function (req, res) {
  try {
    console.log("Start Public Quiz API");
    const reqJson = req.body;
    const lessonId = reqJson.lessonId;
    const publicQuiz = await l.publicUserGetQuiz(lessonId);
    console.log(JSON.stringify(publicQuiz));
    res.json(publicQuiz);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/InsertQuizMark", async function (req, res) {
  try {
    console.log("Start Insert Quiz Mark API");
    const reqJson = req.body;
    const mId = reqJson.mId;
    const lessonId = reqJson.lessonId;
    const mark = reqJson.mark;
    const quizMark = await l.insertQuizMark(mId, lessonId, mark);
    console.log(JSON.stringify(quizMark));
    res.json(quizMark);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/QuizMark", async function (req, res) {
  try {
    console.log("Start Quiz Mark API");
    const reqJson = req.body;
    const mId = reqJson.mId;
    const lessonId = reqJson.lessonId;
    const quizMarkRecord = await l.getQuizMark(mId, lessonId);
    console.log(JSON.stringify(quizMarkRecord));
    res.json(quizMarkRecord);
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
    console.log("Start Edit Section API");
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
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/DeleteSection", async function (req, res) {
  try {
    console.log("Start Delete Section  API");
    const reqJson = req.body;
    const section = reqJson;
    console.log("Request : " + JSON.stringify(section));
    const deleteSection = await l.deleteSection(section);
    console.log("Data: " + JSON.stringify(deleteSection));
    res.json(deleteSection);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/DeleteSectionContent", async function (req, res) {
  try {
    console.log("Start Delete Section Content API");
    const reqJson = req.body;
    const sectionContent = reqJson;

    console.log("Request : " + JSON.stringify(sectionContent));
    const deleteSectionContent = await l.deleteSectionContent(sectionContent);
    console.log("Data: " + JSON.stringify(deleteSectionContent));
    res.json(deleteSectionContent);
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
    res.json(jobList);
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
    res.json(searchJob);
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
    res.json(addJob);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/EditJob", async function (req, res) {
  try {
    console.log("Start Edit Job API");
    const reqJson = req.body;
    const job = reqJson;
    console.log("Request : " + JSON.stringify(job));
    const editJob = await e.editJob(job);
    console.log("Data: " + JSON.stringify(editJob));
    res.json(editJob);
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
    res.json(chatList);
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
    res.json(ChatMessage);
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
    res.json(createChat);
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
    res.json(createChatMsg);
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
    res.json(applyJob);
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
    res.json(applyList);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/CompanyJob", async function (req, res) {
  try {
    console.log("Start Company Job API");
    const reqJson = req.body;
    const eId = reqJson.eId;
    const getCompanyJobList = await e.getCompanyJobList(eId);
    console.log(getCompanyJobList);
    res.json(getCompanyJobList);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/JobDetail", async function (req, res) {
  try {
    console.log("Start Job Detail API");
    const reqJson = req.body;
    const jId = reqJson.jId;
    const jobDetail = await e.jobDetail(jId);
    console.log(jobDetail);
    res.json(jobDetail);
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
    res.json(createPost);
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
    res.json(createComment);
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
    res.json(postList);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/EditPost", async function (req, res) {
  try {
    console.log("Start Edit Post API");
    const reqJson = req.body;
    const post = reqJson;

    console.log("Request : " + JSON.stringify(post));

    const editPost = await f.editPost(post);
    console.log("Data: " + JSON.stringify(editPost));
    res.json(editPost);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/PostTitle", async function (req, res) {
  try {
    console.log("Start Post Title API");
    const reqJson = req.body;
    const postId = reqJson.postId;
    const postTitle = await f.getPostDetail(postId);
    console.log(postTitle);
    res.json(postTitle);
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
    res.json(getComment);
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
    const active = reqJson.active;
    console.log("Request : " + JSON.stringify(mId));
    const changeCreatePostActive = await f.changeCreatePostActive(mId, active);
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
    const active = reqJson.active;
    console.log("Request : " + JSON.stringify(mId));
    const changeCreateCommentActive = await f.changeCreateCommentActive(
      mId,
      active
    );
    console.log("Data: " + JSON.stringify(changeCreateCommentActive));
    res.json(changeCreateCommentActive);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/ChangeEmployerActive", async function (req, res) {
  try {
    console.log("Start Change Employer Active API");
    const reqJson = req.body;
    const eId = reqJson.eId;
    const active = reqJson.active;
    console.log("Request : " + JSON.stringify(eId));
    const changeEmployerActive = await user.changeEmployerActive(eId, active);
    console.log("Data: " + JSON.stringify(changeEmployerActive));
    res.json(changeEmployerActive);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/SectionTaken", async function (req, res) {
  try {
    console.log("Start Section Taken API");
    const reqJson = req.body;
    const mId = reqJson.mId;
    const sectionId = reqJson.sectionId;
    const sectionTaken = await l.sectionTaken(mId, sectionId);
    console.log(JSON.stringify(sectionTaken));
    res.json(sectionTaken);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/Feedback", async function (req, res) {
  try {
    console.log("Start Feedback API");
    const reqJson = req.body;
    const feedbackContent = reqJson;
    const feedback = await l.feedback(feedbackContent);
    console.log(JSON.stringify(feedback));
    res.json(feedback);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

app.post("/GetFeedback", async function (req, res) {
  try {
    console.log("Start Get Feedback  API");
    const feedbackData = await l.getFeedback();
    console.log(feedbackData);
    res.json(feedbackData);
  } catch (e) {
    console.log("Error: " + e);
    throw e;
  }
});

// const axios = require("axios");

// app.post("/AIQUiz", function (req, res) {
//   try {
//     console.log("Start AI Quiz API");
//     const imageData = req.body.image_data; // Get the image data from the request body

//     const requestData = JSON.stringify({ image_data: imageData });

//     const url = "http://127.0.0.1:3001/AIQuiz";

//     axios
//       .post(url, requestData, { timeout: 5000 })
//       .then((response) => {
//         console.log("Received response:", response.data);
//         res.json(response.data);
//       })
//       .catch((error) => {
//         console.log("1");
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal server error" });
//       });
//   } catch (e) {
//     console.log("2");
//     console.error("Error:", e);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
const unirest = require("unirest");

const MAX_RETRY_ATTEMPTS = 3; // Maximum number of retry attempts
const RETRY_DELAY_MS = 1000; // Delay in milliseconds between retries

app.post("/AIQuiz", function (req, res) {
  try {
    const currentDate = new Date();

    console.log("Start AI Quiz API");
    console.log(currentDate);
    const imageData = req.body.image_data; // Get the image data from the request body

    const requestData = JSON.stringify({ image_data: imageData });

    const url = "http://localhost:3001/AIQuiz";

    let retryAttempts = 0;

    const makeRequest = () => {
      unirest
        .post(url)
        .timeout(30000) // Set timeout to 30 seconds (adjust as needed)
        .headers({ "Content-Type": "application/json" })
        .send(requestData)
        .end((response) => {
          if (response.error) {
            console.log("1");
            console.error("Error:", response.error);
            if (retryAttempts < MAX_RETRY_ATTEMPTS) {
              // Retry the request after a delay
              retryAttempts++;
              console.log(`Retry attempt ${retryAttempts}`);
              setTimeout(makeRequest, RETRY_DELAY_MS);
            } else {
              res.status(500).json({ error: "Internal server error" });
            }
          } else {
            console.log(currentDate);
            console.log("Received response:", response.body);
            res.json(response.body);
          }
        });
    };

    makeRequest();
  } catch (e) {
    console.log("2");
    console.error("Error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server On http://%s:%s", host, port);
});
