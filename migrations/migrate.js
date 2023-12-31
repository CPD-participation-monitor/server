const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

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
    await db.query("DROP TABLE IF EXISTS user_org;");
    await db.query("DROP TABLE IF EXISTS admin_org;");
    await db.query("DROP TABLE IF EXISTS request;");
    await db.query("DROP TABLE IF EXISTS org;");
    await db.query("DROP TABLE IF EXISTS user;");
    await db.query("DROP TABLE IF EXISTS role;");

    // Create tables
    await db.query("CREATE TABLE IF NOT EXISTS role (id int PRIMARY KEY, type VARCHAR(255));");
    await db.query("CREATE TABLE IF NOT EXISTS user (email VARCHAR(60) PRIMARY KEY, password VARCHAR(100) NOT NULL, name VARCHAR(100) NOT NULL, nic VARCHAR(20), role INTEGER);");
    await db.query('CREATE TABLE IF NOT EXISTS org (id int AUTO_INCREMENT, orgName VARCHAR(100) UNIQUE NOT NULL, email VARCHAR(60) NOT NULL, description VARCHAR(500) NOT NULL DEFAULT "", PRIMARY KEY(id))');
    await db.query("CREATE TABLE IF NOT EXISTS request (orgID int NOT NULL, email VARCHAR(60) NOT NULL, FOREIGN KEY (orgID) REFERENCES org(id), FOREIGN KEY (email) REFERENCES user(email));");
    await db.query("CREATE TABLE IF NOT EXISTS user_org (email VARCHAR(60) NOT NULL, orgID int NOT NULL, FOREIGN KEY (email) REFERENCES user(email), FOREIGN KEY (orgID) REFERENCES org(id));");
    await db.query("CREATE TABLE IF NOT EXISTS admin_org (email VARCHAR(60) NOT NULL, orgID int NOT NULL, FOREIGN KEY (email) REFERENCES user(email), FOREIGN KEY (orgID) REFERENCES org(id));");
    await db.query('CREATE TABLE IF NOT EXISTS session (sessionId INTEGER PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, org VARCHAR(100) NOT NULL, date CHAR(10) NOT NULL, FOREIGN KEY (org) REFERENCES org(orgName))');
    await db.query("CREATE TABLE IF NOT EXISTS user_session (email VARCHAR(60) NOT NULL, sessionId INTEGER NOT NULL, hmac VARCHAR(512) NOT NULL, FOREIGN KEY (email) REFERENCES user(email), FOREIGN KEY (sessionId) REFERENCES session(sessionId));");

    // Role
    await db.query("INSERT INTO role (id, type) VALUES (2044, 'eng');");
    await db.query("INSERT INTO role (id, type) VALUES (6445, 'orgAdmin');");
    await db.query("INSERT INTO role (id, type) VALUES (3112, 'superAdmin');");
    await db.query("INSERT INTO role (id, type) VALUES (1344, 'systemAdmin');");

    // User 
    let pw = bcrypt.hashSync("engpass", 12);
    await db.query('INSERT INTO user VALUES ("eng@localhost.com", ?, "eng name", "991741136v", 2044)', [pw]);
    pw = bcrypt.hashSync("ieslsuperadminpass", 12);
    await db.query('INSERT INTO user VALUES ("superadmin@iesl.com", ?, "iesl super admin name", "991741138v", 3112)', [pw]);
    pw = bcrypt.hashSync("orgadminpass", 12);
    await db.query('INSERT INTO user VALUES ("orgadmin@localhost.com", ?, "orgadmin name", "991741137v", 6445)', [pw]);
    pw = bcrypt.hashSync("sliot1orgadminpass", 12);
    await db.query('INSERT INTO user VALUES ("orgadmin@sliot1.com", ?, "sliot orgadmin name 1", "991741139v", 3112)', [pw]);
    pw = bcrypt.hashSync("sliot2orgadminpass", 12);
    await db.query('INSERT INTO user VALUES ("orgadmin@sliot2.com", ?, "sliot orgadmin name 2", "991741133v", 6445)', [pw]);
    pw = bcrypt.hashSync("sliot3orgadminpass", 12);
    await db.query('INSERT INTO user VALUES ("orgadmin@sliot3.com", ?, "sliot orgadmin name 3", "991741153v", 6445)', [pw]);
    
    // Org
    await db.query('INSERT INTO org (orgName, email, description) VALUES ("IESL", "iesl@email.com", "This is IESL")');
    await db.query('INSERT INTO org (orgName, email, description) VALUES ("SLIOT", "sliot@email.com", "This is SLIOT")');
    
    // Request
    await db.query('INSERT INTO request (orgID, email) VALUES (1, "eng@localhost.com")');
    
    // admin_org
    await db.query("INSERT INTO admin_org (email, orgID) VALUES ('superadmin@iesl.com', 1);");
    await db.query("INSERT INTO admin_org (email, orgID) VALUES ('orgadmin@sliot1.com', 2);");
    await db.query("INSERT INTO admin_org (email, orgID) VALUES ('orgadmin@sliot2.com', 2);");
    await db.query("INSERT INTO admin_org (email, orgID) VALUES ('orgadmin@sliot3.com', 2);");

    // session
    await db.query('INSERT INTO session (name, org, date) VALUES ("Hello World", "IESL", "2023-12-09")');
    await db.query('INSERT INTO session (name, org, date) VALUES ("Engineering", "IESL", "2023-12-11")');
    await db.query('INSERT INTO session (name, org, date) VALUES ("IoT", "SLIOT", "2023-12-08")');
    await db.query('INSERT INTO session (name, org, date) VALUES ("Hello IoT", "SLIOT", "2023-12-14")');

    // user_session
    await db.query("INSERT INTO user_session (email, sessionId, hmac) VALUES ('eng@localhost.com', 1, 'RAR3tQJpDsMpbAiepaarmmJ9wTnbcFFUNRcgt4Na9Ks=');");
    process.exit();
}
migrate();