const connection = require("./dbConnect");
const util = require("util");
const r = require("./requestHandle");

async function jobList() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT employment.*, user_employer.cPhoto FROM project.employment JOIN project.user_employer ON user_employer.eId = employment.eId ORDER BY employment.createAt DESC"
    );
    return r.requestHandle(true, "", 0, results);
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, error, 1, "");
  }
}
async function jobDetail(jId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT * FROM project.employment WHERE jId = ?",
      [jId] // Pass jId as an array to bind the parameter securely
    );

    if (results.length > 0) {
      return r.requestHandle(true, "", 0, results);
    } else {
      return r.requestHandle(false, "No data found", 1, "");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, error.message, 1, "");
  }
}

async function searchJob(keyword) {
  try {
    const query = util.promisify(connection.query).bind(connection);

    const results = await query(
      "SELECT * FROM project.employment WHERE jobTitle LIKE ? OR location LIKE ?",
      ["%" + keyword + "%", "%" + keyword + "%"]
    );
    if (results.length > 0) {
      return r.requestHandle(true, "", 0, results);
    } else {
      return r.requestHandle(false, "no result", 1, "");
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, "", 0);
  }
}

async function addJob(job) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query("INSERT INTO project.employment SET ?", job);
    console.log("New Section added successfully.");
    return r.requestHandle(
      true,
      "New job added successfully.",
      0,
      "jId : " + job.jId
    );
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "");
  }
}

async function applyJob(member) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const checkJobExist = await query(
      "SELECT * FROM project.employment WHERE jId = ? ",
      member.jId
    );

    const checkUser = await query(
      "SELECT * FROM project.apply_list WHERE jId =? AND mId =? ",
      [member.jId, member.mId]
    );
    if (checkUser.length > 0) {
      return r.requestHandle(false, "You are already apply.", 0, "");
    } else {
      if (checkJobExist.length > 0) {
        const results = await query(
          "INSERT INTO project.apply_list SET ?",
          member
        );
        console.log("apply job successfully.");
        return r.requestHandle(
          true,
          "Thank you for applying for the job. Please wait for the employer to contact you..",
          0,
          "aId : " + member.aId
        );
      } else {
        return r.requestHandle(false, "job no exist.", 1, "");
      }
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 2, "");
  }
}

async function getCompanyJobList(eId) {
  console.log(eId);
  try {
    const query = util.promisify(connection.query).bind(connection);
    let companyJobList = await query(
      "SELECT pe.jId, pe.jobTitle, pe.location, pe.highlights, pe.responsibilities, pe.requirements, pe.createAt,pe.description, ue.cPhoto FROM project.employment AS pe JOIN user_employer AS ue ON pe.eId = ue.eId WHERE pe.eId = ? ORDER BY pe.createAt DESC",
      [eId]
    );

    if (companyJobList.length > 0) {
      return r.requestHandle(true, "", 0, companyJobList);
    } else {
      return r.requestHandle(false, "No Job create", 1, "");
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, error, 2, "");
  }
}

async function applyList(jId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query(
      "SELECT user_member.mId,  user_member.mName, apply_list.application_date FROM project.user_member JOIN project.apply_list ON user_member.mId = apply_list.mId WHERE apply_list.jId = ? ORDER BY application_date DESC",
      [jId]
    );

    if (results.length > 0) {
      return r.requestHandle(true, "", 0, results);
    } else {
      return r.requestHandle(false, "no one apply", 1, results);
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, error, 2, "");
  }
}

module.exports = {
  jobList: jobList,
  searchJob: searchJob,
  addJob: addJob,
  applyJob: applyJob,
  applyList: applyList,
  getCompanyJobList: getCompanyJobList,
  jobDetail: jobDetail,
};
