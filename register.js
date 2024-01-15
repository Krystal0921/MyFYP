const connection = require('./dbConnect');
const util = require('util');
const r = require("./requestHandle");


async function addMember(member) {
  try {
    let results;
    const query = util.promisify(connection.query).bind(connection);

    results = await query('SELECT * FROM project.user_member WHERE uName = ?', [member.uName]);

    if (results.length > 0) {
      console.log('Username is duplicate in the database');
      return r.requestHandle(false, 'Username is duplicate in the database', 1, "")
    } else {
      results = await query('INSERT INTO project.user_member SET ?', member);
      console.log('New member added successfully.');
      return r.requestHandle(true, 'New member added successfully.', 0, "")
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2 , "")
  }
}


async function addEmployer(employer) {
  try {
    let results;
    const query = util.promisify(connection.query).bind(connection);

    uNameResults = await query('SELECT * FROM project.user_employer WHERE uName = ?', [employer.uName]);
    cNameResults = await query('SELECT * FROM project.user_employer WHERE cName = ?', [employer.cName]);

    if (uNameResults.length > 0) {
      console.log('Username is duplicate in the database');
      return r.requestHandle(false, 'Username is duplicate in the database.', 1, "")
    }else if(cNameResults.length > 0 ){
      console.log('Company Name is duplicate in the database');
      return r.requestHandle(false, 'Company Name is duplicate in the database',2, "")
    } else {
      results = await query('INSERT INTO project.user_employer SET ?', employer);
      console.log('New employer added successfully.');
      return r.requestHandle(true, 'New employer added successfully.', 0, "")
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 3 , "")
  }
}


async function generateId(type) {
  try{
  const query = util.promisify(connection.query).bind(connection);
  const tableName = type === 'member' ? 'project.user_member' : 'user_employer';
  const countQuery = `SELECT COUNT(*) AS count FROM ${tableName}`;
  const results = await query(countQuery);
  const existingCount = results[0].count;
  const prefix = type === 'member' ? 'm' : 'e';
  const paddedId = String(existingCount + 1).padStart(7, '0');
  const id = `${prefix}${paddedId}`;
  console.log(id);
  return id;
  }catch(error){
    console.log(`Error: ${error}`);
  }
}


module.exports = {
  addMember: addMember,
  addEmployer: addEmployer,
  generateId:generateId
 
};