const connection = require("./dbConnect");
const util = require("util");
const r = require("./requestHandle");

async function login(username, password) {
  try {
    let userData;
    console.log(username, password);

    const query = util.promisify(connection.query).bind(connection);

    checkUserType = await query(
      "SELECT * FROM project.user WHERE uName = ? AND password = ?",
      [username, password]
    );

    if (checkUserType.length > 0) {
      const userType = checkUserType[0].userType;
      const userId = checkUserType[0].userId;

      switch (userType) {
        case 1:
          userData = null;
          break;
        case 2:
          userData = await getCurrentMember(userId);
          break;
        case 3:
          userData = await getCurrentEmployer(userId);
          break;
        default:
          break;
      }
      if (userData == false) {
        return r.requestHandle(false, "Employer not active", 1, "");
      }
      return r.requestHandle(true, "Login success", 0, userData);
    } else {
      console.log("Username or password do not exist in the database");
      return r.requestHandle(false, "Username or password incorrect", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

async function getCurrentMember(userId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT *  from project.user_member WHERE mId =? ",
      [userId]
    );
    return results;
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  }
}

async function getCurrentEmployer(userId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT    from project.user_employer WHERE eId =? AND active = 1",
      [userId]
    );
    if (results.length > 0) {
      return results;
    } else {
      return false;
    }
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  }
}

module.exports = {
  getCurrentMember: getCurrentMember,
  getCurrentEmployer: getCurrentEmployer,
  login: login,
};
