const connection = require('./dbConnect');
const util = require('util');
const r = require('./requestHandle');


async function jobList() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT * FROM project.employment');
    return r.requestHandle(true, "", 0,results )
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, error, 1,"" )
  } 
}

async function searchJob(keyword) {
  try {
    const query = util.promisify(connection.query).bind(connection);

    const results = await query('SELECT * FROM project.employment WHERE jobTitle LIKE ? OR location LIKE ?',['%' + keyword + '%', '%' + keyword + '%']);
    if(results.length>0){
    return r.requestHandle(true, "", 0,results )
    }else{
      return r.requestHandle(false, "no result", 1,"" )
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, "", 0, )
  } 
}

async function addJob(job) {
  try {
    const query = util.promisify(connection.query).bind(connection);
      const results = await query('INSERT INTO project.employment SET ?', job);
      console.log('New Section added successfully.');
      return r.requestHandle(true, 'New job added successfully.', 0, "jId : " +job.jId )
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "")
  }
}

async function applyJob(member) {
  try {
    const query = util.promisify(connection.query).bind(connection);
      const results = await query('INSERT INTO project.apply_list SET ?', member);
      console.log('apply job successfully.');
      return r.requestHandle(true, 'successfully.', 0, "aId : " +member.aId )
  } catch (error) {
    console.log(`Error: ${error}`);
    return r.requestHandle(false, `${error}`, 1, "")
  }
}

async function applyList(jId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT  user_member.mName, user_member.mId FROM project.user_member JOIN project.apply_list ON user_member.mId = apply_list.mId WHERE apply_list.jId = ?' , [jId]);

    if(results.length >0){
    return r.requestHandle(true, "", 0,results )
    }else{
      return r.requestHandle(false, "no one apply", 1,results )
    }
  } catch (error) {
    console.log(`error ${error}`);
    return r.requestHandle(false, error, 2,"" )
  } 
}

module.exports = {
  jobList: jobList,
  searchJob: searchJob,
  addJob: addJob,
  applyJob: applyJob,
  applyList:applyList
};