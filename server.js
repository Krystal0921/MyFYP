var express = require('express');
var app = express();
const Db = require("./login");
const rr = require("./register");
const ll = require("./lesson");
const e = require("./employment");
const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.post('/', async function (req, res) {

   res.send('Hello World123');
  
  })

app.post('/login', async function (req, res) {
  try{
    console.log("Start Login API")
    const reqJson = (req.body)
    console.log("Request : "+ JSON.stringify(reqJson))
    const loginResult = await Db.login(reqJson.username, reqJson.password, reqJson.type);

    if(loginResult){
      if(reqJson.type == 'member'){
        const memberData = await Db.getMember(reqJson.username);
        console.log("Member Data: " + JSON.stringify(memberData));
        res.end(JSON.stringify({
          "success":true,
          "msg": "Login success",
          "data":[memberData]
        }));
      }else if(reqJson.type == 'employer'){
        const employerData = await Db.getEmployer(reqJson.username);
        console.log("Employer Data: " + JSON.stringify(employerData));
        res.end(JSON.stringify({
          "success":true,
          "msg": "Login success",
          "data":[employerData]
        }));
      }     
    }else{
      res.end(JSON.stringify({
        "success":false,
        "msg": "User do not exist in the database",
        "data":[]
      }));
    }
  }catch(e){
    console.log("Error: " + e);
    res.end(JSON.stringify({
      "success":false,
      "msg":e,
      "data":[]
    }));
  }
})
// {
//   "username":"1233",
//   "password":"dadas",
//   "type":"member"
// }


app.post('/register', async function (req, res) {
  try{
    console.log("Start Register API")
    const reqJson = (req.body)
    console.log(reqJson)
    const member = reqJson
    const registerMember = await rr.addMember(member)

    if(registerMember){
      res.end(JSON.stringify({
        "success":true,
        "msg": "register success",
        "data":[]
      }));
    }
  }catch(e){
    res.end(JSON.stringify({
      "success":false,
      "msg":e,
      "data":[]
    }));
  }
})




app.get('/lesson', async function (req, res) {
  const lessonId = 'l01';
  const sectionId = 's01';

  const quiz = await ll.quizList(lessonId, sectionId);
  const quizAns = quiz.map(item => item.quizAns);
  res.send(quizAns);
});
  

app.get('/employment', async function (req, res) {
  
// const job = {
//   jId : 'j0000002', 
//   eId : 'e0000001',
//   jobTitle :'Software', 
//   location :'HK',
//   description:'111', 
//   highlights :'111',
//   responsibilities :'1111',
//   requirements :'1111',
//   jobOffer:'1111'
// }
// e.addJob(job);
// res.end(JSON.stringify({
//   "success": true,
//   "data": [],
//   "stateCode": "001",
//   "msg": "Login Success"
// }));

const jobList = await e.jobList()

  res.end(JSON.stringify(jobList));
  
});


var server = app.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})