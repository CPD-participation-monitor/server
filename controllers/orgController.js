const Validator = require("../utils/validator");
const con = require("../utils/dbConnector");
const Org = require("../models/org").Org;

const createOrg = async (req, res) => {
    try {
        const { orgName, email } = req.body;
        if (!email) {
            res.status(400).json({ 'success': false, 'reason': 'Email cannot be empty' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res.status(400).json({ 'success': false, 'reason': 'Invalid email format' });
            return;
        }
        if (!orgName) {
            res.status(400).json({ 'success': false, 'reason': 'Name cannot be empty' });
            return;
        }
        // if (!Validator.validate('name', orgName)) {
        //     res.status(400).json({ 'success': false, 'reason': 'Invalid name format' });
        //     return;
        // }

        const org = new Org(con, res, { orgName: orgName, email: email });

    } catch (err) {
        console.log(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

const requestToJoin = async (req, res) => {
    Org.requestToJoin(con, res, req.body);
};

const getOrgs = async (req, res) => {
    Org.getOrgs(con, res);
};

const getRequests = async (req, res) => {
    Org.getRequests(con, res, req.body);
};

module.exports = { createOrg, getOrgs, requestToJoin, getRequests };