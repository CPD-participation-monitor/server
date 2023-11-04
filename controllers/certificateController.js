const crypto = require('crypto');
const fs = require('fs');
const { getUserSessions, getUserAllSessions } = require("../utils/sessionHelper");

// See keys/README.md on how to generate this key
const private_key = fs.readFileSync('keys/privateKey.pem', 'utf-8');
const public_key = fs.readFileSync('keys/publicKey.pem', 'utf-8');

const issueCertificate = (req, res) => {
    try {
        const email = req.email;
        let sessions = null;
        if (req.body.sessions) {
            sessions = req.body.sessions;
        }
        cb = sessions => {
            const certData = { email, sessions };
            if (sessions.length > 0) {
                const signer = crypto.createSign('sha256');
                signer.write(JSON.stringify(certData));
                signer.end();
                const signature = signer.sign(private_key, 'base64');
                res.json({ 'data': certData, signature });
            } else {
                // no data => nothing to sign
                res.json({ 'data': certData });
            }
        }
        if (sessions) {
            getUserSessions(email, sessions, cb);
        } else {
            getUserAllSessions(email, cb);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

const verifyCertificate = (req, res) => {
    try {
        let { data, signature } = req.body;
        if (!data || !signature) {
            req.status(400).json({ 'success': false, 'reason': 'Invalid request' });
        }
        const verify = crypto.createVerify('sha256');
        verify.write(JSON.stringify(data));
        verify.end();
        res.json({ 'valid': verify.verify(public_key, signature, 'base64') });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { issueCertificate, verifyCertificate };