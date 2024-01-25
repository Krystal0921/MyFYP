const connection = require("./dbConnect");
const util = require("util");
const r = require("./requestHandle");
const myU = require("./utils");

async function getLessonList() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query("SELECT * FROM project.lesson");
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function getSectionList(lessonId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT * FROM project.lesson_section WHERE lessonId = ?",
      [lessonId]
    );
    if (results.length > 0) {
      return r.requestHandle(true, "", 0, results);
    } else {
      return r.requestHandle(false, "Lesson not exist", 1, "");
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

async function getSectionDetail(lessonId, sectionId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT * FROM project.lesson_section_content WHERE lessonId = ? AND sectionId = ?",
      [lessonId, sectionId]
    );
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function createSection(section) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query(
      "SELECT * FROM project.lesson_section WHERE lessonId = ?",
      [section.lessonId]
    );

    if (check.length >= 5) {
      return r.requestHandle(false, "Section more than 5", 1, "");
    } else {
      const results = await query(
        "INSERT INTO project.lesson_section SET ?",
        section
      );
      console.log("New Section added successfully.");
      return r.requestHandle(
        true,
        "New Section added successfully.",
        0,
        section.sectionId
      );
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

async function createSectionContent(sectionContent) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "INSERT INTO project.lesson_section_content SET ?",
      sectionContent
    );
    console.log("Create Section Content successfully.");
    return r.requestHandle(true, "Sucess", 0, sectionContent.contentId);
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function editSection(section) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query(
      "SELECT * FROM project.lesson_section WHERE lessonId = ? AND sectionId = ?",
      [section.lessonId, section.sectionId]
    );
    if (check.length > 0) {
      const results = await query(
        "UPDATE project.lesson_section SET sectionTitle = ? WHERE lessonId = ? AND sectionId = ?",
        [section.sectionTitle, section.lessonId, section.sectionId]
      );
      console.log("Edit Section successfully.");
      return r.requestHandle(true, "Sucess", 0, "");
    } else {
      return r.requestHandle(false, "Section is not exist", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function editSectionContent(sectionContent) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query(
      "SELECT * FROM project.lesson_section_content WHERE lessonId = ? AND sectionId = ? AND contenId = ?",
      [section.lessonId, section.sectionId, section.contentId]
    );

    if (check.length > 0) {
      const results = await query(
        "UPDATE project.lesson_section_content SET ? WHERE lessonId = ? AND sectionId = ? AND contentId = ?",
        [
          sectionContent,
          section.lessonId,
          section.sectionId,
          sectionContent.contentId,
        ]
      );
      console.log("Edit Section Content successfully.");
      return r.requestHandle(true, "Sucess", 0, "");
    } else {
      return r.requestHandle(false, "Section is not exist", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function updateLessonProgress(mId, lessonId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

module.exports = {
  getLessonList: getLessonList,
  getSectionList: getSectionList,
  getSectionDetail: getSectionDetail,
  createSection: createSection,
  createSectionContent: createSectionContent,
  editSection: editSection,
  editSectionContent: editSectionContent,
  updateLessonProgress: updateLessonProgress,
};
