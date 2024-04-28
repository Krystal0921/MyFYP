var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: "database-1.ckrrh0jhddra.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "project",
});

module.exports = connection;
