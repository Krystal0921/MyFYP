const connection = require("./dbConnect");
const util = require("util");
const r = require("./requestHandle");

async function addMember(member) {
  try {
    const query = util.promisify(connection.query).bind(connection);

    checkUser = await query("SELECT * FROM project.user WHERE uName = ?", [
      member.uName,
    ]);

    if (checkUser.length > 0) {
      console.log("Username is duplicate in the database");
      return r.requestHandle(false, "Username already exists", 1, "");
    } else {
      await query(
        "INSERT INTO project.user (userId, userType, uName, password) VALUES (?, ?, ?, ?)",
        [member.userId, 2, member.uName, member.password]
      );
      await query(
        "INSERT INTO project.user_member (mId, mName, mContact, mEmail, mType, mPhoto, createPost, createComment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          member.userId,
          member.mName,
          member.mContact,
          member.mEmail,
          member.mType,
          member.mPhoto,
          1,
          1,
        ]
      );
      console.log("New member added successfully.");
      return r.requestHandle(true, "New member added.", 0, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

async function addEmployer(employer) {
  try {
    const query = util.promisify(connection.query).bind(connection);

    const uNameResults = await query(
      "SELECT * FROM project.user WHERE uName = ?",
      [employer.uName]
    );
    const cNameResults = await query(
      "SELECT * FROM project.user_employer WHERE cName = ?",
      [employer.cName]
    );

    if (uNameResults.length > 0) {
      console.log("Username is duplicate in the database");
      return r.requestHandle(false, "Username already exists", 1, "");
    } else if (cNameResults.length > 0) {
      console.log("Company Name is duplicate in the database");
      return r.requestHandle(false, "Company Name already exists", 2, "");
    } else {
      await query(
        "INSERT INTO project.user (userId, userType, uName, password) VALUES (?, ?, ?, ?)",
        [employer.userId, 3, employer.uName, employer.password]
      );

      await query(
        "INSERT INTO project.user_employer (eId, eName, eEmail, cName, cContact, cAddress, cNumber, cPhoto, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          employer.userId,
          employer.eName,
          employer.eEmail,
          employer.cName,
          employer.cContact,
          employer.cAddress,
          employer.cNumber,
          employer.cPhoto,
          0,
        ]
      );

      console.log("New employer added.");
      return r.requestHandle(true, "New employer added.", 0, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 3, "");
  }
}

async function generateId(type) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const tableName = type === 2 ? "project.user_member" : "user_employer";
    const countQuery = `SELECT COUNT(*) AS count FROM ${tableName}`;
    const results = await query(countQuery);
    const existingCount = results[0].count;
    const prefix = type === 2 ? "m" : "e";
    const paddedId = String(existingCount + 1).padStart(7, "0");
    const id = `${prefix}${paddedId}`;
    console.log(id);
    return id;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

module.exports = {
  addMember: addMember,
  addEmployer: addEmployer,
  generateId: generateId,
};
