const connection = require("./dbConnect");
const util = require("util");
const r = require("./requestHandle");

async function getMember() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query("SELECT *  from project.user_member ");
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function getEmployer() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query("SELECT *  from project.user_employer ");
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function getMemberLessonProgress(mId, lessonId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT *  from project.member_lesson_progress WHERE mId=? AND lessonId=? ",
      [mId, lessonId]
    );
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

module.exports = {
  getMember: getMember,
  getEmployer: getEmployer,
  getMemberLessonProgress: getMemberLessonProgress,
};
