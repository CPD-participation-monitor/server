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
    await db.query("DROP TABLE IF EXISTS user_session;");
    await db.query("DROP TABLE IF EXISTS session;");
    await db.query("DROP TABLE IF EXISTS org;");
    await db.query("DROP TABLE IF EXISTS user;");
    await db.query("DROP TABLE IF EXISTS role;");

    await db.query("CREATE TABLE IF NOT EXISTS role (id int PRIMARY KEY, type VARCHAR(255));");
    await db.query("INSERT INTO role (id, type) VALUES (2044, 'eng');");
    await db.query("INSERT INTO role (id, type) VALUES (6445, 'orgAdmin');");
    await db.query("INSERT INTO role (id, type) VALUES (3112, 'superAdmin');");

    await db.query("CREATE TABLE IF NOT EXISTS user (email VARCHAR(60) PRIMARY KEY, password VARCHAR(100) NOT NULL, name VARCHAR(100) NOT NULL, nic VARCHAR(20), role INTEGER);");
    await db.query("INSERT INTO user VALUES (\"eng@localhost.com\", \"engpass\", \"eng name\", \"991741136v\", 2044);");
    await db.query("INSERT INTO user VALUES (\"orgadmin@localhost.com\", \"orgadminpass\", \"orgadmin name\", \"991741137v\", 6445);");

    await db.query("CREATE TABLE IF NOT EXISTS org (name VARCHAR(100) PRIMARY KEY);");
    await db.query("INSERT INTO org VALUES (\"IESL\");");

    await db.query("CREATE TABLE IF NOT EXISTS session (sessionId INTEGER PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, org VARCHAR(100) NOT NULL, date CHAR(10) NOT NULL, FOREIGN KEY (org) REFERENCES org(name));");
    await db.query("INSERT INTO session (name, org, date) VALUES ('Hello World', 'IESL', '2023-11-04');");

    await db.query("CREATE TABLE IF NOT EXISTS user_session (email VARCHAR(60) NOT NULL, sessionId INTEGER NOT NULL, hmac VARCHAR(512) NOT NULL, FOREIGN KEY (email) REFERENCES user(email), FOREIGN KEY (sessionId) REFERENCES session(sessionId));");
    await db.query("INSERT INTO user_session (email, sessionId, hmac) VALUES ('eng@localhost.com', 1, 'vF4MgqXIR1H1Wrzq1S2ePottJ+vOPm9zErVsPEBBhDg=');");
    process.exit();
}
migrate();