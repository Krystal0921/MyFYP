const connection = require('./dbConnect');
const util = require('util');

async function jobList() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT * FROM project.employment');
    return results;
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  } 
}

async function searchJob(keyword) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const results = await query('SELECT * FROM project.employment ');
    return results;
  } catch (error) {
    console.log(`error ${error}`);
    throw error;
  } 
}



async function addJob(job) {
  try {
    connection.connect();

    const query = 'INSERT INTO project.employment SET ?';
    connection.query(query, job, function (error, results) {
      if (error) {
        throw error;
      }
      console.log('New job added successfully');
      console.log(results);
      
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  } 
}


module.exports = {
  jobList: jobList,
  addJob: addJob
};