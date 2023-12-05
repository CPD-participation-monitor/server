const Validator = require("../utils/validator");
const con = require("../utils/dbConnector");
const User = require("../models/user").User;

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            res?.status(400).json({ 'success': false, 'reason': 'Email cannot be empty' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res?.status(400).json({ 'success': false, 'reason': 'Invalid email format' });
            return;
        }
        if (!password) {
            res?.status(400).json({ 'success': false, 'reason': 'Password cannot be empty' });
            return;
        }

        User.login(con, res, { email, password });

    } catch (err) {
        console.error(err);
        res?.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { loginUser };