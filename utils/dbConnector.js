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
    con.query("DROP TABLE IF EXISTS role;");
    con.query("CREATE TABLE IF NOT EXISTS role (id int PRIMARY KEY, type VARCHAR(255));");
    con.query("INSERT INTO role (id, type) VALUES (1, 'eng');");
    con.query("INSERT INTO role (id, type) VALUES (2, 'orgAdmin');");
    con.query("INSERT INTO role (id, type) VALUES (3, 'superAdmin');");

    con.query("DROP TABLE IF EXISTS user;");
    con.query("CREATE TABLE IF NOT EXISTS user (email VARCHAR(255) PRIMARY KEY, password VARCHAR(255), name VARCHAR(255), nic VARCHAR(255), role int);");
    const user1 = new User(con, null, {email: "eng@localhost.com", password: "engpass", name: "eng name", nic: "991741136v", role: "eng"});
    const user2 = new User(con, null, {email: "orgadmin@localhost.com", password: "orgadminpass", name: "orgadmin name", nic: "991741137v", role: "orgAdmin"});
}

dbInit();

module.exports = con;