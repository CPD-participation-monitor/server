const { addSession, addUserSession, addAllUsersSession, getUserSession, getUserAllSessions } = require("../utils/sessionHelper");

const issueCertificate = (req, res) => {
    try {
        const email = req.email;
        getUserAllSessions(email, (sessions) => {
            console.log(sessions);
            res.json(sessions);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { issueCertificate };