const connection = require('./dbConnect');
const util = require('util');

async function addMember(member) {
  try {
    let results;
    const query = util.promisify(connection.query).bind(connection);

    results = await query('SELECT * FROM project.user_member WHERE uName = ?', [member.uName]);

    if (results.length > 0) {
      console.log('Username is duplicate in the database');
      return false;
    } else {
      results = await query('INSERT INTO project.user_member SET ?', member);
      console.log('New member added successfully.');
      return true;
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    throw error;
  }
}


async function addEmployer(employer) {
  try {
    let results;
    const query = util.promisify(connection.query).bind(connection);

    uNameResults = await query('SELECT * FROM project.user_employer WHERE uName = ?', [employer.uName]);
    cNameResults = await query('SELECT * FROM project.user_employer WHERE cName = ?', [employer.cName]);

    if (uNameResults.length > 0) {
      const msg ='Username is duplicate in the database'
      console.log(msg);
      return msg;
    }else if(cNameResults.length > 0 ){
      const msg = 'Company Name is duplicate in the database'
      console.log(msg);
      return msg;
    } else {
      results = await query('INSERT INTO project.user_employer SET ?', employer);
      console.log('New employer added successfully.');
      return true;
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    throw error;
  }
}


async function generateId(type) {
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
}


module.exports = {
  addMember: addMember,
  addEmployer: addEmployer,
  generateId:generateId
 
};