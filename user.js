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

async function getMemberLessonProgress(mId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT  project.lesson.lessonId,ifnull(sum(mark),0) FROM project.lesson left join project.member_lesson_progress ON project.lesson.lessonId   =  project.member_lesson_progress.lessonId  WHERE mId = ? GROUP BY project.lesson.lessonId ",
      [mId]
    );
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function changeEmployerActive(eId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query("SELECT * FROM project.user_employer WHERE eId = ? ", [
      eId,
    ]);
    if (check.length > 0) {
      results = await query(
        "UPDATE project.user_employer SET active = ? WHERE mId = ?",
        [1, eId]
      );
      console.log("Update employer active to 1");
      return r.requestHandle(true, "Update employer active ", 0, "");
    } else {
      return r.requestHandle(false, "Can not Update employer", 0, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

module.exports = {
  getMember: getMember,
  getEmployer: getEmployer,
  changeEmployerActive: changeEmployerActive,
  getMemberLessonProgress,
  getMemberLessonProgress,
};
