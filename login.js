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
          userData = "admin";
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
        return r.requestHandle(
          false,
          "Account not activated. Please wait for admin approval",
          1,
          ""
        );
      }
      return r.requestHandle(true, "Login success", 0, userData);
    } else {
      console.log("Username or password do not exist in the database");
      return r.requestHandle(
        false,
        "Invalid username or password. Please try again",
        2,
        ""
      );
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
getCurrentMember;
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
      "SELECT * FROM project.user_employer WHERE eId = ? AND active = 1",
      [userId]
    );

    if (results.length > 0) {
      const employer = results[0];
      const imagePath = "./image/" + employer.userId + "/" + employer.cPhoto;
      const imageBase64 = await readImageAsBase64(imagePath);

      employer.image = imageBase64;

      return employer;
    } else {
      return false;
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    throw error;
  }
}

function readImageAsBase64(imagePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(imagePath, { encoding: "base64" }, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  getCurrentMember: getCurrentMember,
  getCurrentEmployer: getCurrentEmployer,
  login: login,
};
