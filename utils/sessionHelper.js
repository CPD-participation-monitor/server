const { createHmac } = require('crypto');
const con = require("./dbConnector");

const KEY = process.env.HMAC_SECRET;
if (!KEY) throw new Error("HMAC_SECRET not specified");

const addSession = () => {

}

const addUserSession = () => {

}

const addAllUsersSession = () => {

}

const filterSessions = (email, results) => {
    let sessions = [];
    for (const item of results) {
        const name = item.name;
        const organization = item.org;
        const date = item.date;
        const hmac = item.hmac;
        const hmacCreator = createHmac('sha256', KEY);
        hmacCreator.update(`${email}|${name}|${organization}|${date}`, 'utf8');
        let hmacExpected = hmacCreator.digest().toString('base64');
        if (hmac !== hmacExpected) {
            console.log('HMAC not matching');
            continue;
        }
        sessions.push({ name, organization, date });
    }
    return sessions;
}

const getUserSessions = (email, sessionList, cb) => {
    con.query('SELECT name, org, date, hmac FROM user_session INNER JOIN session USING (sessionId) WHERE email = ? AND sessionId in (?)', [email, sessionList], function (err, result) {
        if (err) throw err;
        let sessions = filterSessions(email, result);
        cb(sessions);
    });
}

const getUserAllSessions = (email, cb) => {
    con.query('SELECT name, org, date, hmac FROM user_session INNER JOIN session USING (sessionId) WHERE email = ?', [email], function (err, result) {
        if (err) throw err;
        let sessions = filterSessions(email, result);
        cb(sessions);
    });
}

module.exports = { addSession, addUserSession, addAllUsersSession, getUserSessions, getUserAllSessions };