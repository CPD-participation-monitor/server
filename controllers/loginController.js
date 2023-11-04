const Validator = require("../utils/validator");
const con = require("../utils/dbConnector");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { serialize } = require('cookie');

const KEY = process.env.JWT_SECRET;
if (!KEY) throw new Error("JWT_SECRET not specified");

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
                const token = jwt.sign({ "email": email }, KEY, {
                    expiresIn: "6h",
                });
                const serialized = serialize('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 6, // 6 hours
                    path: '/',
                });
                res.setHeader('Set-Cookie', serialized);
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