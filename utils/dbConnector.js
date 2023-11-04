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

function dbInit() {
    con.query("DROP TABLE IF EXISTS user_session;");
    con.query("DROP TABLE IF EXISTS session;");
    con.query("DROP TABLE IF EXISTS user;");
    con.query("DROP TABLE IF EXISTS role;");

    con.query("CREATE TABLE IF NOT EXISTS role (id int PRIMARY KEY, type VARCHAR(255));");
    con.query("INSERT INTO role (id, type) VALUES (1, 'eng');");
    con.query("INSERT INTO role (id, type) VALUES (2, 'orgAdmin');");
    con.query("INSERT INTO role (id, type) VALUES (3, 'superAdmin');");

    con.query("CREATE TABLE IF NOT EXISTS user (email VARCHAR(60) PRIMARY KEY, password VARCHAR(100) NOT NULL, name VARCHAR(100) NOT NULL, nic VARCHAR(20), role INTEGER);");

    con.query("CREATE TABLE IF NOT EXISTS session (sessionId INTEGER PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, organization VARCHAR(100) NOT NULL, date CHAR(10) NOT NULL);");

    con.query("CREATE TABLE IF NOT EXISTS user_session (email VARCHAR(60) NOT NULL, sessionId INTEGER NOT NULL, hmac VARCHAR(512) NOT NULL, FOREIGN KEY (email) REFERENCES user(email), FOREIGN KEY (sessionId) REFERENCES session(sessionId));");
}

dbInit();

module.exports = con;