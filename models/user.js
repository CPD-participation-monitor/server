const bcrypt = require("bcrypt");

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
}

module.exports = { User };
