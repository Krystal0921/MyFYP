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
      `SELECT project.lesson.lessonPhoto,project.lesson.lessonName,  project.lesson_section.* 
      FROM project.lesson_section 
      JOIN project.lesson
      ON project.lesson_section.lessonId = project.lesson.lessonId
      WHERE project.lesson_section.lessonId = ?`,
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
      `SELECT project.lesson_section.sectionTitle, project.lesson_section_content.*
      FROM project.lesson_section_content
      JOIN project.lesson_section ON project.lesson_section.lessonId = project.lesson_section_content.lessonId
        AND project.lesson_section.sectionId = project.lesson_section_content.sectionId
      WHERE project.lesson_section.lessonId = ? AND project.lesson_section.sectionId = ?`,
      [lessonId, sectionId]
    );
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function getQuiz(lessonId, sectionId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT * FROM project.quiz WHERE lessonId = ? AND sectionId = ?",
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
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

async function createSectionContent(sectionContent) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    checkSection = await query(
      "SELECT * FROM project.lesson_section WHERE lessonId = ? AND sectionId = ?",
      [sectionContent.lessonId, sectionContent.sectionId]
    );
    if (checkSection.length > 0) {
      const results = await query(
        "INSERT INTO project.lesson_section_content SET ?",
        sectionContent
      );
      console.log("Create Section Content successfully.");
      return r.requestHandle(true, "Sucess", 0, sectionContent.contentId);
    } else {
      return r.requestHandle(false, "Section not exist", 0, "");
    }
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
      "SELECT * FROM project.lesson_section_content WHERE lessonId = ? AND sectionId = ? AND contentId = ?",
      [
        sectionContent.lessonId,
        sectionContent.sectionId,
        sectionContent.contentId,
      ]
    );

    if (check.length > 0) {
      const results = await query(
        "UPDATE project.lesson_section_content SET ? WHERE lessonId = ? AND sectionId = ? AND contentId = ?",
        [
          sectionContent,
          sectionContent.lessonId,
          sectionContent.sectionId,
          sectionContent.contentId,
        ]
      );
      console.log("Edit Section Content successfully.");
      return r.requestHandle(true, "Sucess", 0, "");
    } else {
      return r.requestHandle(false, "Section Content is not exist", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}
async function updateLessonProgress(mId, lessonId, sectionId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const check = await query(
      "SELECT * FROM project.member_lesson_progress WHERE mId = ? AND lessonId = ? AND sectionId = ? ",
      [mId, lessonId, sectionId]
    );
    if (check.length > 0) {
      return r.requestHandle(
        false,
        "member already completed this section",
        1,
        ""
      );
    } else {
      await query("INSERT INTO project.member_lesson_progress SET ?", {
        mId: mId,
        lessonId: lessonId,
        sectionId: sectionId,
        mark: 20,
      });
      const result = await query(
        "SELECT * FROM project.member_lesson_progress WHERE mId = ? AND lessonId = ? AND sectionId = ? ",
        [mId, lessonId, sectionId]
      );
      return r.requestHandle(true, "lesson progress updated", 0, result);
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

async function deleteSection(section) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query(
      "SELECT * FROM project.lesson_section WHERE lessonId = ? AND sectionId = ?",
      [section.lessonId, section.sectionId]
    );
    if (check.length > 0) {
      const results = await query(
        "DELETE FROM project.lesson_section  WHERE lessonId=? AND AND sectionId = ? ;"[
          (section.lessonId, section.sectionId)
        ]
      );
      console.log("Delete Section successfully.");
      return r.requestHandle(true, "Sucess", 0, "");
    } else {
      return r.requestHandle(false, "Section is not exist", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function deleteSectionContent(sectionContent) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    check = await query(
      "SELECT * FROM lesson_section_content WHERE lessonId = ? AND sectionId = ? AND contentId = ?",
      [
        sectionContent.lessonId,
        sectionContent.sectionId,
        sectionContent.contentId,
      ]
    );
    if (check.length > 0) {
      const results = await query(
        "DELETE FROM lesson_section_content  WHERE lessonId=? AND AND sectionId = ? AND contentId = ? ;"[
          (section.lessonId, section.sectionId, sectionContent.contentId)
        ]
      );
      console.log("Delete Section Content successfully.");
      return r.requestHandle(true, "Sucess", 0, "");
    } else {
      return r.requestHandle(false, "Section Content is not exist", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function sectionTaken(mId, sectionId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      `SELECT * FROM project.member_lesson_progress
      WHERE mId = ? AND sectionId = ? `,
      [mId, sectionId]
    );
    if (results.length > 0) {
      return r.requestHandle(true, "", 0, "has taken");
    } else {
      return r.requestHandle(true, "", 1, "not taken");
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

async function feedback(feedbackContent) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "INSERT INTO project.feedback SET ?",
      feedbackContent
    );
    console.log("Feedback received.");
    return r.requestHandle(true, "Sucess", 0, "");
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

module.exports = {
  getLessonList: getLessonList,
  getSectionList: getSectionList,
  getSectionDetail: getSectionDetail,
  getQuiz: getQuiz,
  createSection: createSection,
  createSectionContent: createSectionContent,
  editSection: editSection,
  editSectionContent: editSectionContent,
  updateLessonProgress: updateLessonProgress,
  deleteSection: deleteSection,
  deleteSectionContent: deleteSectionContent,
  sectionTaken: sectionTaken,
  feedback: feedback,
};
