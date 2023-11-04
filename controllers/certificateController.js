const crypto = require('crypto');
const fs = require('fs');
const { getUserAllSessions } = require("../utils/sessionHelper");

// See keys/README.md on how to generate this key
const private_key = fs.readFileSync('keys/privateKey.pem', 'utf-8');

const issueCertificate = (req, res) => {
    try {
        const email = req.email;
        getUserAllSessions(email, (sessions) => {
            const certData = { email, sessions };
            const signer = crypto.createSign('sha256');
            signer.write(JSON.stringify(certData));
            signer.end();
            const signature = signer.sign(private_key, 'base64');
            res.json({ 'data': certData, signature });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { issueCertificate };