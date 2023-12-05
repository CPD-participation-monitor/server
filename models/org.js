class Org {
    constructor(data) {
        this.data = data;
    }

    static getOrgs(con, res) {
        try {
            con.query("SELECT * FROM org", function (err, result) {
                try {
                    if (err) throw err;

                    con.query('SELECT orgID, count(*) from user_org group by (orgID)', (err, result2) => {
                        try {
                            if (err) throw err;

                            const orgCount = {};
                            result2.forEach(row => {
                                orgCount[row.orgID] = row['count(*)'];
                            });

                            let returnOrgs = [];

                            for (let i = 0; i < result.length; i++) {
                                returnOrgs.push({
                                    id: result[i].id.toString(),
                                    name: result[i].orgName,
                                    email: result[i].email,
                                    members: orgCount[result[i].id]
                                });
                            }

                            res?.status(200).json({ success: true, 'orgs': returnOrgs });
                        } catch (err) {
                            console.error(err);
                            res?.status(500).json({ success: false, reason: 'Error occured when retrieving orgs.' });
                        }
                    });
                } catch (err) {
                    console.error(err);
                    res?.status(500).json({ success: false, reason: 'Error occured when retrieving orgs.' });
                }
            });
        } catch (err) {
            console.error(err);
            res?.status(500).json({ success: false, reason: 'Error occured when retrieving orgs.' });
        }
    }

    static requestToJoin(con, res, email, orgID) {
        try {
            con.query('SELECT email FROM request WHERE email = ? and orgID = ? LIMIT 1', [email, orgID], function (err, result) {
                try {
                    if (err) throw err;

                    if (result.length !== 0) {
                        res?.status(409).json({ success: false, reason: 'Request already exists' });
                        return;
                    }

                    con.query('INSERT INTO request (orgID, email) VALUES (?, ?)', [orgID, email], function (err, result) {
                        try {
                            if (err) throw err;

                            res?.status(200).json({ success: true });
                            return;
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
    }

    static getRequests(con, res, orgID) {
        try {
            con.query('SELECT * FROM request WHERE orgID = ?', [orgID], (err, result) => {
                try {
                    if (err) throw err;

                    let requests = [];
                    result.forEach(row => {
                        requests.push(row.email);
                    });

                    res?.status(200).json({ success: true, 'requests': requests });
                } catch (err) {
                    console.error(err);
                    res?.status(500).json({ success: false, reason: 'Error occured' });
                }
            });
        } catch (err) {
            console.error(err);
            res?.status(500).json({ success: false, reason: 'Error occured' });
        }
    }

    static acceptRequest(con, res, orgID, email) {
        con.query('DELETE FROM request WHERE email = ? and orgID = ?', [email, orgID], (err, result) => {
            if (err) throw err;

            // check if user is already a member
            con.query('SELECT * FROM user_org WHERE email = ? AND orgID = ? LIMIT 1', [email, orgID], (err, result) => {
                if (err) throw err;

                if (result.length !== 0) {
                    res?.status(409).json({ success: false, reason: 'User is already a member' });
                    return;
                }

                con.query('INSERT INTO user_org (email, orgID) VALUES (?, ?)', [email, orgID], (err, result) => {
                    if (err) throw err;

                    res?.status(200).json({ success: true });
                    return;
                });
            });
        });
    }
}

module.exports = { Org };
