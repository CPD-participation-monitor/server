const Validator = require("../utils/validator");

const signupUser = async (req, res) => {
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
        // TODO: Save the user in DB
        res.status(200).json({ 'success': true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

module.exports = { signupUser };