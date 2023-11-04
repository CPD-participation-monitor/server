const Validator = require("../utils/validator");
const con = require("../utils/dbConnector");
const User = require("../models/user").User;

const signupUser = (req, res) => {
    try {
        const { email, password, name, nic, role } = req.body;
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

        const user = new User(con, res, { email, password, name, nic, role });

    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { signupUser };