const connection = require('./dbConnect');
const util = require('util');
const r = require("./requestHandle");

async function login(username, password, type) {
  try {
    let results
    const query = util.promisify(connection.query).bind(connection);
    if (type == "member") {
      results = await query('SELECT * FROM project.user_member WHERE uName = ? AND password = ?', [username, password]);
    } else if (type == "employer") {
      results = await query('SELECT * FROM project.user_employer WHERE uName = ? AND password = ?', [username, password]);
    } else {
      return r.requestHandle(false,"Error Type",2,"")
    }

    if (results.length > 0) {
      console.log('Username and password exist in the database');
      const userData = (type === 'member') ? await getMember(username) : await getEmployer(username);
      return  r.requestHandle(true, "Login success", 0, userData)
    } else {
      console.log('Username and password do not exist in the database');
      return r.requestHandle(false, "Username/ password incorrect ", 1, "")
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 3, "")

  }
}

async function getMember(username) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT *  from project.user_member WHERE uName =? ', [username]);
    return results
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  }
}


async function getEmployer(username) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT *  from project.user_employer WHERE uName =? ', [username]);
    console.log(results)
    return results
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  }
}



module.exports = {
  getMember: getMember,
  getEmployer: getEmployer,
  login: login,
};