const Validator = require("../utils/validator");
const con = require("../utils/dbConnector");
const bcrypt = require("bcrypt");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
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
        con.query("SELECT password, name FROM user WHERE email = ?", [email], async function (err, result) {
            if (err) throw err;
            if (result.length !== 1) {
                res.status(401).json({ 'success': false, 'reason': 'No such user' });
                return;
            }
            const pwHash = result[0]['password'];
            if (bcrypt.compareSync(password, pwHash)) {
                const name = result[0]['name'];
                res.status(200).json({ 'success': true, 'name': name });
                return;
            }
            res.status(401).json({ 'success': false, 'reason': 'Incorrect password' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { loginUser };