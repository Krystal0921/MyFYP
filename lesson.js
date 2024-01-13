const connection = require('./dbConnect');
const util = require('util');


async function lessonList() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT * FROM project.lesson');
    console.log(results);
    return results;
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  } 
}

async function sectionList(lessonId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT * FROM project.lesson_section WHERE lessonId = ?', [lessonId]);
    console.log(results);
    return results;
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  }
}

async function getSectionDetail(lessonId, sectionId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT ls.lessonId, ls.sectionId, ls.sectionTitle, lsc.contentId, lsc.contentType, lsc.contentData FROM project.lesson_section ls JOIN project.lesson_section_content lsc ON ls.sectionId = lsc.sectionId WHERE ls.lessonId = ? AND ls.sectionId = ?', [lessonId, sectionId]);
    console.log(results);
    return results;
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  }
}

async function quizList(lessonId, sectionId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT * FROM project.lesson_quiz WHERE lessonId = ? AND sectionId = ? ', [lessonId, sectionId]);
    console.log(results);
    return results;
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  }
}





module.exports = {
  lessonList: lessonList,
  sectionList: sectionList,
  getSectionDetail: getSectionDetail,
  quizList: quizList
};