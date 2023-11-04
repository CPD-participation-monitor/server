const mysql = require('mysql');
const User = require("../models/user").User;

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

function dbInit(){

    // con.query("DROP TABLE IF EXISTS user;");
    con.query("CREATE TABLE IF NOT EXISTS user (email VARCHAR(60) PRIMARY KEY, password VARCHAR(100), name VARCHAR(100), nic VARCHAR(20), type int);");
    // const user1 = new User(con, null, {email: "admin@localhost", password: "adminpass", name: "admin name", nic: "991741136v", userType: "eng"});
}

dbInit();

module.exports = con;