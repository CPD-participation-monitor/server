const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { serialize } = require('cookie');

class User {
    constructor(con, res, data) {
        this.data = data;
        this.create(con, res, data);
    }

    create(con, res) {
        const data = this.data;

        con.query("SELECT count(*) FROM user WHERE email = ?", [data.email], async function (err, result) {
            if (err) throw err;
            let count = result[0]['count(*)'];
            if (count !== 0) {
                console.log("Email already used");
                res?.status(409).json({ 'success': false, 'reason': 'Email already used' });
                return;
            }
            const pwHash = bcrypt.hashSync(data.password, 12);

            let roleInt = 0;
            if (data.role === "eng") {
                roleInt = 1;
            } else if (data.role === "orgAdmin") {
                roleInt = 2;
            }

            con.query("INSERT INTO user (email, password, name, nic, role) VALUES (?, ?, ?, ?, ?)", [data.email, pwHash, data.name, data.nic, roleInt], function (err, result) {
                if (err) throw err;
                res?.status(200).json({ 'success': true });
            });
        });
    };

    static login(con, res, data){

        const KEY = process.env.JWT_SECRET;
        if (!KEY) throw new Error("JWT_SECRET not specified");

        const email = data.email;
        const password = data.password;

        con.query("SELECT password, name, role FROM user WHERE email = ?", [email], async function (err, result) {
            
            if (err) throw err;
            if (result.length !== 1) {
                res.status(401).json({ 'success': false, 'reason': 'No such user' });
                return;
            }
            const pwHash = result[0]['password'];
            if (bcrypt.compareSync(password, pwHash)) {
                const name = result[0]['name'];
                const token = jwt.sign({ "email": email }, KEY, {
                    expiresIn: "6h",
                });
                const serialized = serialize('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 6, // 6 hours
                    path: '/',
                });

                // find role
                await con.query("SELECT type FROM role WHERE id = ?", [result[0]['role']], function (err, result) {
                    if (err) throw err;
                    if (result.length !== 1) {
                        return null;
                    }
                    const type = result[0]['type'];

                    res.setHeader('Set-Cookie', serialized);
                    res.status(200).json({ 'success': true, 'name': name, 'role': type });
                    return;

                });

                return;
            }
            res.status(401).json({ 'success': false, 'reason': 'Incorrect password' });
        });
    }
}

module.exports = { User };
