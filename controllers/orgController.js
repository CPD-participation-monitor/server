const Validator = require("../utils/validator");
const con = require("../utils/dbConnector");
const Org = require("../models/org").Org;
const User = require("../models/user").User;

const createOrg = async (req, res) => {
    try {
        const { orgName, email, creatorEmail } = req.body;
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
        User.promoteToSuperAdmin(con, res, { email: creatorEmail });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 'success': false, 'reason': 'Error occured' });
    }
};

const requestToJoin = async (req, res) => {
    Org.requestToJoin(con, res, req.body);
};

const getOrgs = async (req, res) => {
    Org.getOrgs(con, res);
};

const getOrgsPublic = async (req, res) => {
    try {
        con.query('SELECT orgName, description FROM org', function (err, result) {
            try {
                if (err) throw err;
                let org_desc = [];
                result.forEach(row => {
                    elem = {
                        'orgName': row['orgName'],
                        'description': row['description']
                    };
                    org_desc.push(elem);
                });
                res.status(200).json(org_desc);
            }
            catch (e) {
                console.error(e);
                res?.status(500).json({ 'success': false, 'reason': 'Error occured when retrieving orgs.' });
            }
        });
    }
    catch (e) {
        console.error(e);
        res?.status(500).json({ 'success': false, 'reason': 'Error occured when retrieving orgs.' });
    }
};

const getRequests = async (req, res) => {
    Org.getRequests(con, res, req.body);
};

const acceptRequest = async (req, res) => {
    Org.acceptRequest(con, res, req.body);
};

module.exports = { createOrg, getOrgs, requestToJoin, getRequests, acceptRequest, getOrgsPublic };