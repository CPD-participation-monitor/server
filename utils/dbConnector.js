const mysql = require('mysql');

let dbHost = process.env.MYSQL_HOST;
if (!dbHost) throw new Error("DB host not specified");
let dbUser = process.env.MYSQL_USER;
if (!dbUser) throw new Error("DB user not specified");
let dbPass = process.env.MYSQL_PASSWORD;
if (!dbPass) throw new Error("DB password not specified");
let dbName = process.env.MYSQL_DB;
if (!dbName) throw new Error("DB name not specified");

const con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName
});

if (!con) throw new Error("DB connection failed");
console.log("Connected to database");

module.exports = con;