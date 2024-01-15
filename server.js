var express = require('express');
var app = express();
const Db = require("./login");
const rr = require("./register");
const l = require("./lesson");
const e = require("./employment");
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

app.get('/Section', async function (req, res) {
  const lessonId = 'l01';
  const sectionId = 's01';

  const quiz = await ll.quizList(lessonId, sectionId);
  const quizAns = quiz.map(item => item.quizAns);
  res.send(quizAns);
});


app.get('/employment', async function (req, res) {

  const jobList = await e.jobList()

  res.end(JSON.stringify(jobList));

});


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})