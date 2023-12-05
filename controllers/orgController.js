const Validator = require("../utils/validator");
const con = require("../utils/dbConnector");
const Org = require("../models/org").Org;
const User = require("../models/user").User;

const createOrg = async (req, res) => {
    try {
        const { orgName, email } = req.body;
        const creatorEmail = req.email;
        if (!email) {
            res?.status(400).json({ success: false, reason: 'Email cannot be empty' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res?.status(400).json({ success: false, reason: 'Invalid email format' });
            return;
        }
        if (!orgName) {
            res?.status(400).json({ success: false, reason: 'Org name cannot be empty' });
            return;
        }
        if (!Validator.validate('orgName', orgName)) {
            res?.status(400).json({ success: false, reason: 'Invalid orgName format' });
            return;
        }

        con.query('SELECT orgName FROM org WHERE orgName = ? LIMIT 1', [orgName], (err, result) => {
            try {
                if (err) throw err;
                if (result.length !== 0) {
                    console.log("Org already exists");
                    res?.status(409).json({ success: false, reason: 'Org already exists' });
                    return;
                }
                con.query('INSERT INTO org (orgName, email) VALUES (?, ?)', [orgName, email], (err, result2) => {
                    try {
                        if (err) throw err;
                        con.query('INSERT INTO admin_org (email, orgID) VALUES (?, ?)', [creatorEmail, result2.insertId], (err, result) => {
                            try {
                                if (err) throw err;

                                // Promote to super admin
                                con.query('UPDATE user SET role = 3112 WHERE email = ?', [creatorEmail], function (err, result3) {
                                    try {
                                        if (err) throw err;
                                        res?.status(200).json({ success: true });
                                    } catch (err) {
                                        console.error(err);
                                        res?.status(500).json({ success: false, reason: 'Error occured' });
                                    }
                                });
                            } catch (err) {
                                console.error(err);
                                res?.status(500).json({ success: false, reason: 'Error occured' });
                            }
                        });
                    } catch (err) {
                        console.error(err);
                        res?.status(500).json({ success: false, reason: 'Error occured' });
                    }
                });
            } catch (err) {
                console.error(err);
                res?.status(500).json({ success: false, reason: 'Error occured' });
            }
        });
    } catch (err) {
        console.error(err);
        res?.status(500).json({ success: false, reason: 'Error occured' });
    }
};

const requestToJoin = async (req, res) => {
    const email = req.email;
    const role = req.role;
    if (role !== 2044) {
        res?.status(403).json({ success: false, reason: 'Not an Engineer.' });
    }
    const { orgID } = req.body;
    if (!orgID) {
        res?.status(400).json({ success: false, reason: 'Org ID cannot be empty' });
        return;
    }
    if (!Validator.validate('orgID', orgID)) {
        res?.status(400).json({ success: false, reason: 'Invalid orgID format' });
        return;
    }
    Org.requestToJoin(con, res, email, orgID);
};

const getOrgs = async (req, res) => {
    Org.getOrgs(con, res);
};

/**
 * Get a list of all organization names and their descriptions.
 * Accessible by anyone even without authentication.
 * @param {*} req 
 * @param {*} res 
 */
const getOrgsPublic = (req, res) => {
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
                res?.status(200).json({ success: true, 'orgs': org_desc });
            } catch (e) {
                console.error(e);
                res?.status(500).json({ success: false, reason: 'Error occured when retrieving orgs.' });
            }
        });
    } catch (e) {
        console.error(e);
        res?.status(500).json({ success: false, reason: 'Error occured when retrieving orgs.' });
    }
};


/**
 * Get a list of all session names and dates of an organization.
 * Accessible by anyone even without authentication.
 * @param {*} req 
 * @param {*} res 
 */
const getOrgSessionsPublic = (req, res) => {
    try {
        const { orgName } = req.query;
        if (!orgName) {
            res?.status(400).json({ success: false, reason: 'Org name cannot be empty' });
            return;
        }
        if (!Validator.validate('orgName', orgName)) {
            res?.status(400).json({ success: false, reason: 'Invalid orgName format' });
            return;
        }
        con.query('SELECT name, date FROM session WHERE org = ?', [orgName], function (err, result) {
            try {
                if (err) throw err;
                let sessions = [];
                result.forEach(row => {
                    elem = {
                        'name': row['name'],
                        'date': row['date']
                    };
                    sessions.push(elem);
                });
                res?.status(200).json({ success: true, 'sessions': sessions });
            } catch (e) {
                console.error(e);
                res?.status(500).json({ success: false, reason: 'Error occured' });
            }
        });
    } catch (e) {
        console.error(e);
        res?.status(500).json({ success: false, reason: 'Error occured' });
    }
};

const getRequests = async (req, res) => {
    try {
        const email = req.email;
        if (req.role !== 3112) {
            res?.status(403).json({ success: false, reason: 'Not the SuperAdmin.' });
            return;
        }
        Org.getRequests(con, res, email);
    } catch (e) {
        console.error(e);
        res?.status(500).json({ success: false, reason: 'Error occured' });
    }
};

const acceptRequest = async (req, res) => {
    Org.acceptRequest(con, res, req.body);
};

module.exports = { createOrg, getOrgs, requestToJoin, getRequests, acceptRequest, getOrgsPublic, getOrgSessionsPublic };