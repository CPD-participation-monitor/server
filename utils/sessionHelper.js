const con = require("./dbConnector");

const addSession = () => {
    
}

const addUserSession = () => {
    
}

const addAllUsersSession = () => {
    
}

const getUserSession = () => {
    
}

const getUserAllSessions = (email, cb) => {
    con.query('SELECT name, organization, date, hmac FROM user_session INNER JOIN session USING (sessionId) where email = ?', [email], function (err, result) {
        if (err) throw err;
        let sessions = [];
        for (const item of result) {
            const name = item.name;
            const organization = item.organization;
            const date = item.organization;
            const hmac = item.hmac;
            let hmacExpected = getHmac(`${email}|${name}|${organization}|${date}`, secret);
            if (hmac !== hmacExpected) {
                console.log('HMAC not matching');
                continue;
            }
            sessions.push(item.sessionId);
        }
        cb(sessions);
    });
}

module.exports = { addSession, addUserSession, addAllUsersSession, getUserSession, getUserAllSessions };