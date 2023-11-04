const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  connectionLimit: 5,
});

function connectionCheck() {
  return pool.getConnection();
}

function connectionRelease() {
  db.on("release", function (connection) {
    console.log("Connection %d released", connection.threadId);
  });
}

const db = pool;
const dbConn = {
  connectionCheck: connectionCheck,
  connectionRelease: connectionRelease,
};

async function migrate() {
    await db.query("drop table if exists role;");
    await db.query("CREATE TABLE IF NOT EXISTS role (id int PRIMARY KEY, type VARCHAR(255));");
    await db.query("INSERT INTO role (id, type) VALUES (2044, 'eng');");
    await db.query("INSERT INTO role (id, type) VALUES (6445, 'orgAdmin');");
    await db.query("INSERT INTO role (id, type) VALUES (3112, 'superAdmin');");

    await db.query("drop table if exists user;");
    await db.query("CREATE TABLE IF NOT EXISTS user (email VARCHAR(255) PRIMARY KEY, password VARCHAR(255), name VARCHAR(255), nic VARCHAR(255), role int);");
    await db.query("INSERT INTO user VALUES (\"eng@localhost.com\", \"engpass\", \"eng name\", \"991741136v\", 2044);");
    await db.query("INSERT INTO user VALUES (\"orgadmin@localhost.com\", \"orgadminpass\", \"orgadmin name\", \"991741137v\", 6445);");
    
    process.exit();
}
migrate();