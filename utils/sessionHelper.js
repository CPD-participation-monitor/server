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

const getUserSession = () => {

}

const getUserAllSessions = (email, cb) => {
    con.query('SELECT name, org, date, hmac FROM user_session INNER JOIN session USING (sessionId) where email = ?', [email], function (err, result) {
        if (err) throw err;
        let sessions = [];
        for (const item of result) {
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
            sessions.push({name, organization, date});
        }
        cb(sessions);
    });
}

module.exports = { addSession, addUserSession, addAllUsersSession, getUserSession, getUserAllSessions };