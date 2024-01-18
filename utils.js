const connection = require('./dbConnect');
const util = require('util');



async function generateSectionId(lessonId) {
  try{
  const query = util.promisify(connection.query).bind(connection);
  let prefix

    const countQuery = `SELECT COUNT(*) AS count FROM project.lesson_section WHERE lessonId = ?`
    
    const results = await query(countQuery, [lessonId]);
    const existingCount = results[0].count;

    prefix = 's'
    const paddedId = String(existingCount + 1).padStart(2, '0');
    const id = `${prefix}${paddedId}`;
    console.log(id);
    return id;
  }catch(error){
    console.log(`Error: ${error}`);
  }
}

async function generateContentId() {
  try{
  const query = util.promisify(connection.query).bind(connection);
  let prefix

    const countQuery = `SELECT COUNT(*) AS count FROM project.lesson_section_content `
    const results = await query(countQuery);

    console.log(countQuery.length)
    const existingCount = results[0].count;
    prefix = 'sc'
      const paddedId = String(existingCount + 1).padStart(8, '0');
      const id = `${prefix}${paddedId}`;
      console.log(id);
      return id;
  }catch(error){
    console.log(`Error: ${error}`);
  }
}

async function generateContentId() {
  try{
  const query = util.promisify(connection.query).bind(connection);
  let prefix

    const countQuery = `SELECT COUNT(*) AS count FROM project.lesson_section_content `
    const results = await query(countQuery);

    console.log(countQuery.length)
    const existingCount = results[0].count;
    prefix = 'sc'
      const paddedId = String(existingCount + 1).padStart(8, '0');
      const id = `${prefix}${paddedId}`;
      console.log(id);
      return id;
  }catch(error){
    console.log(`Error: ${error}`);
  }
}

async function generateChatId() {
  try{
  const query = util.promisify(connection.query).bind(connection);
  let prefix

    const countQuery = `SELECT COUNT(*) AS count FROM project.chat`
    const results = await query(countQuery);

    console.log(countQuery.length)
    const existingCount = results[0].count;
    prefix = 'ch'
      const paddedId = String(existingCount + 1).padStart(8, '0');
        const id = `${prefix}${paddedId}`;
        console.log(id);
        return id;
  }catch(error){
    console.log(`Error: ${error}`);
  }
}



async function generateJodId() {
  try{
  const query = util.promisify(connection.query).bind(connection);
  let prefix

    const countQuery = `SELECT COUNT(*) AS count FROM project.employment`
    const results = await query(countQuery);

    console.log(countQuery.length)
    const existingCount = results[0].count;
    prefix = 'j'
      const paddedId = String(existingCount + 1).padStart(9, '0');
        const id = `${prefix}${paddedId}`;
        console.log(id);
        return id;
  }catch(error){
    console.log(`Error: ${error}`);
  }
}
  
async function generateChatMsgId(chatId) {
  try{
  const query = util.promisify(connection.query).bind(connection);
  let prefix

    const countQuery = `SELECT COUNT(*) AS count FROM project.chat_content WHERE chatId = ?`
    
    const results = await query(countQuery, [chatId]);
    const existingCount = results[0].count;

    prefix = 'm'
    const paddedId = String(existingCount + 1).padStart(9, '0');
    const id = `${prefix}${paddedId}`;
    console.log(id);
    return id;
  }catch(error){
    console.log(`Error: ${error}`);
  }
}
  
  


async function generateApplyId(jId) {
  try{
  const query = util.promisify(connection.query).bind(connection);
  let prefix

    const countQuery = `SELECT COUNT(*) AS count FROM project.apply_list`
    
    const results = await query(countQuery, [chatId]);
    const existingCount = results[0].count;

    prefix = 'a'
    const paddedId = String(existingCount + 1).padStart(7, '0');
    const id = `${prefix}${paddedId}`;
    console.log(id);
    return id;
  }catch(error){
    console.log(`Error: ${error}`);
  }
}
  // }else if(tableName == 'project.apply_list'){
  //   prefix == 'a'
  //   const paddedId = String(existingCount + 1).padStart(7, '0');
  //     const id = `${prefix}${paddedId}`;
  //     console.log(id);
  //     return id;


  // }else if(tableName == 'project.forum'){
  //   prefix == 'p'
  //   const paddedId = String(existingCount + 1).padStart(7, '0');
  //     const id = `${prefix}${paddedId}`;
  //     console.log(id);
  //     return id;
  // }else if(tableName == 'project.forum_comment'){
  //   prefix == 'pc'
  //   const paddedId = String(existingCount + 1).padStart(8, '0');
  //     const id = `${prefix}${paddedId}`;
  //     console.log(id);
  //     return id;
  // }



module.exports = {
 generateSectionId : generateSectionId, 
 generateContentId:generateContentId,
 generateChatId:generateChatId,
 generateChatMsgId:generateChatMsgId,
 generateJodId:generateJodId,
 generateApplyId:generateApplyId
};