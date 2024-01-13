var mysql = require('mysql2');
var connection = mysql.createConnection({
  host: 'database-2.chqccmyeyinm.us-east-1.rds.amazonaws.com',
  port: "3306",
  user: 'admin',
  password: 'password',
  database: 'project'
});


module.exports = connection;