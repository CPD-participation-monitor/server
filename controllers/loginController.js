const Validator = require("../utils/validator");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.json({ 'success': false, 'reason': 'Email cannot be empty' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res.json({ 'success': false, 'reason': 'Invalid email format' });
            return;
        }
        if (!password) {
            res.json({ 'success': false, 'reason': 'Password cannot be empty' });
            return;
        }
        if (!Validator.validate('password', password)) {
            res.json({ 'success': false, 'reason': 'Invalid password format' });
            return;
        }
        // TODO: Change this to check password and issue JWT
        if (email === password) {
            res.json({ 'success': true });
        } else {
            res.json({ 'success': false, 'reason': 'Incorrect password' });
        }
    } catch (err) {
        console.log(err);
        res.json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { loginUser };