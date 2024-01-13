const connection = require('./dbConnect');

async function addMember(member) {
  try {
    connection.connect();

    
    const query = 'INSERT INTO project.user_member SET ?';

    connection.query(query, member, function (error, results) {
      if (error) {
        throw error;
      }
      console.log(member.uName)
      console.log('New member added successfully');
      return true
    });
  }catch (error) {
    console.log(`Error: ${error}`);
  } 
}


async function addEmployer(employer) {
  try {
    connection.connect();
    const query = 'INSERT INTO project.user_employer SET ?';
    connection.query(query, employer, function (error, results) {
      if (error) {
        throw error;
      }
      console.log('New employer added successfully');
      console.log(results);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  } 
}


// async function generateId(type) {
//   try {
//     const query = util.promisify(connection.query).bind(connection);
//     const member = "SELECT COUNT(*) from project.user_member"
//     const employer = "SELECT COUNT(*) from project.user_employer" 
//     let results 
//     if(type=="member"){
//       results = await query(member);
//     }else{
//       results = await query(employer);
//     }
//     console.log(results);
//     return results;
//   } catch (error) {
//     console.log(`error ${error}`);
//     throw error;
//   } 
// }



module.exports = {
  addMember: addMember,
  addEmployer: addEmployer
 
};