const connection = require('./dbConnect');
const util = require('util');

async function login(username, password, type) {
  try {
  let results
  const query = util.promisify(connection.query).bind(connection);
  if(type == "member"){
    results = await query('SELECT * FROM project.user_member WHERE uName = ? AND password = ?', [username, password]);
  }else{
    results = await query('SELECT * FROM project.user_employer WHERE uName = ? AND password = ?', [username, password]);
  }
    if (results.length > 0) {
      console.log('Username and password exist in the database');
      return true;
    } else {
      console.log('Username and password do not exist in the database');
      return false;
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    throw error;
  } 
}

async function getMember(username) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT *  from project.user_member WHERE uName =? ', [username] );
    return results;
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  } 
}


async function getEmployer(username) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT *  from project.user_employer WHERE uName =? ', [username] );
    return results;
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  } 
}


module.exports = {
  getMember: getMember,
  getEmployer: getEmployer,
  login: login
};