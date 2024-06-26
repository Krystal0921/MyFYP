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
      `SELECT l.lessonId, IFNULL(SUM(mark), 0) as totalMark FROM project.lesson AS l LEFT JOIN (
          SELECT *
          FROM project.member_lesson_progress
          WHERE mId = ?
      ) AS ls ON l.lessonId = ls.lessonId
       GROUP BY l.lessonId `,
      [mId]
    );
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function changeEmployerActive(eId, active) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const check = await query(
      "SELECT * FROM project.user_employer WHERE eId = ?",
      [eId]
    );

    if (check.length > 0) {
      const results = await query(
        "UPDATE project.user_employer SET active = ? WHERE eId = ?",
        [active, eId]
      );

      console.log("Successfully updated employer active status.");
      return r.requestHandle(true, "Update employer active status.", 0, "");
    } else {
      return r.requestHandle(
        false,
        "Cannot update employer. Employer not found.",
        0,
        ""
      );
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
