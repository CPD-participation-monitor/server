const Validator = require("../utils/validator");
const con = require("../utils/dbConnector");
const bcrypt = require("bcrypt");

const signupUser = (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email) {
            res.status(400).json({ 'success': false, 'reason': 'Email cannot be empty' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res.status(400).json({ 'success': false, 'reason': 'Invalid email format' });
            return;
        }
        if (!password) {
            res.status(400).json({ 'success': false, 'reason': 'Password cannot be empty' });
            return;
        }
        if (!Validator.validate('password', password)) {
            res.status(400).json({ 'success': false, 'reason': 'Invalid password format' });
            return;
        }
        if (!name) {
            res.status(400).json({ 'success': false, 'reason': 'Name cannot be empty' });
            return;
        }
        if (!Validator.validate('name', name)) {
            res.status(400).json({ 'success': false, 'reason': 'Invalid name format' });
            return;
        }
        con.query("SELECT count(*) FROM user WHERE email = ?", [email], async function (err, result) {
            if (err) throw err;
            let count = result[0]['count(*)'];
            if (count !== 0) {
                res.status(409).json({ 'success': false, 'reason': 'Email already used' });
                return;
            }
            const pwHash = bcrypt.hashSync(password, 12);
            con.query("INSERT INTO user (email, password, name) VALUES (?, ?, ?)", [email, pwHash, name], function (err, result) {
                if (err) throw err;
                res.status(200).json({ 'success': true });
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { signupUser };