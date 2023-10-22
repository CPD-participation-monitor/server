const Validator = require("../utils/validator");

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
        // TODO: Change this to check password and issue JWT
        if (email === password) {
            res.status(200).json({ 'success': true });
        } else {
            res.status(401).json({ 'success': false, 'reason': 'Incorrect password' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { loginUser };