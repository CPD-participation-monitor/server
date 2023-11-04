const bcrypt = require("bcrypt");

class User {
    constructor (con, res, data) {
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

            let typeInt = 0;
            if (data.userType === "eng") {
                typeInt = 1;
            } else if (data.userType === "orgAdmin") {
                typeInt = 2;
            }

            con.query("INSERT INTO user (email, password, name, nic, type) VALUES (?, ?, ?, ?, ?)", [data.email, pwHash, data.name, data.nic, typeInt], function (err, result) {
                if (err) throw err;
                res?.status(200).json({ 'success': true });
            });
        });
    };
}

module.exports = {User};
