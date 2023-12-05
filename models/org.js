class Org {
    constructor(data) {
        this.data = data;
    }

    static getOrgs(con, res) {
        try {
            con.query("SELECT * FROM org", function (err, result) {
                try {
                    if (err) throw err;

                    con.query('SELECT orgID, count(*) from admin_org group by (orgID)', (err, result2) => {
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
                        if (err) throw err;

                        res?.status(200).json({ success: true });
                        return;
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

    static getRequests(con, res, email) {
        try {
            con.query('SELECT * FROM request WHERE orgID IN (SELECT orgID FROM admin_org WHERE email = ?)', [email], (err, result) => {
                if (err) throw err;

                let requests = [];

                result.forEach(row => {
                    requests.push({
                        orgID: row.orgID,
                        email: row.email
                    });
                });

                res?.status(200).json({ success: true, 'requests': requests });
                return;
            });
        } catch (err) {
            console.error(err);
            res?.status(500).json({ success: false, reason: 'Error occured' });
        }
    }

    static acceptRequest(con, res, data) {

        const orgID = data.orgID;
        const email = data.email;

        con.query(`delete from request where email = "${email}" and orgID = ${orgID};`, function (err, result) {
            if (err) throw err;

            // check if user is already an admin
            con.query(`select * from admin_org where email = "${email}"`, function (err, result) {
                if (err) throw err;

                if (result.length !== 0) {
                    res?.status(409).json({ success: false, reason: 'User is already an admin' });
                    return;
                }

                con.query(`insert into admin_org values ("${email}", ${orgID});`, function (err, result) {
                    if (err) throw err;

                    res?.status(200).json({ success: true });
                    return;
                });
            });
        });
    }
}

module.exports = { Org };
