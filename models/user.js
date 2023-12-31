const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { serialize } = require('cookie');

const KEY = process.env.JWT_SECRET;
if (!KEY) throw new Error("JWT_SECRET not specified");

class User {
    constructor(con, res, data) {
        this.data = data;
        this.create(con, res);
    }

    create(con, res) {
        const data = this.data;

        con.query("SELECT count(*) FROM user WHERE email = ?", [data.email], async function (err, result) {
            if (err) throw err;
            let count = result[0]['count(*)'];
            if (count !== 0) {
                console.log("Email already used");
                res?.status(409).json({ success: false, reason: 'Email already used' });
                return;
            }
            const pwHash = bcrypt.hashSync(data.password, 12);

            let roleInt = 0;
            if (data.role === "eng") {
                roleInt = 2044;
            } else if (data.role === "orgAdmin") {
                roleInt = 6445;
            } else if (data.role === "superAdmin") {
                roleInt = 3112;
            } else if (data.role === "systemAdmin") {
                roleInt = 1344;
            }

            con.query("INSERT INTO user (email, password, name, nic, role) VALUES (?, ?, ?, ?, ?)", [data.email, pwHash, data.name, data.nic, roleInt], function (err, result) {
                if (err) throw err;
                res?.status(200).json({ success: true });
            });
        });
    };

    static login(con, res, data) {

        const email = data.email;
        const password = data.password;

        con.query('SELECT password, name, role FROM user WHERE email = ?', [email], function (err, result) {
            try {
                if (err) throw err;
                if (result.length !== 1) {
                    res?.status(401).json({ success: false, reason: 'No such user' });
                    return;
                }
                const name = result[0]['name'];
                const role = result[0]['role'];
                const pwHash = result[0]['password'];
                if (bcrypt.compareSync(password, pwHash)) {
                    con.query('SELECT email, orgID FROM admin_org WHERE email = ? LIMIT 1', [email], (err, result) => {
                        try {
                            if (err) throw err;
                            const user = { name, role, email };
                            const jwt_obj = { email, role };

                            if (result.length === 1) {
                                user['orgID'] = result[0].orgID;
                                jwt_obj['orgID'] = result[0].orgID;
                            }

                            const token = jwt.sign(jwt_obj, KEY, {
                                expiresIn: "6h",
                            });

                            res?.setHeader('Set-Cookie', serialize('access_token', token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'strict',
                                maxAge: 60 * 60 * 6, // 6 hours
                                path: '/',
                            }));
                            res?.status(200).json({ success: true, 'user': user });
                            return;
                        } catch (err) {
                            console.error(err);
                            res?.status(500).json({ success: false, reason: 'Error occured' });
                        }
                    });
                    return;
                }
                res?.status(401).json({ success: false, reason: 'Incorrect password' });
            } catch (err) {
                console.error(err);
                res?.status(500).json({ success: false, reason: 'Error occured' });
            }
        });
    }

    static promoteToSuperAdmin(con, res, email) {
        try {
            con.query('UPDATE user SET role = 3112 WHERE email = ?', [email], function (err, result) {
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
    }
}

module.exports = { User };
