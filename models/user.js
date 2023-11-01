const connection = require("../app.js").mysqlConnection;

class User {
    constructor (username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    create(newUser, result) {
        connection.query('INSERT INTO users SET ?', newUser, (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
    
            console.log('created user: ', { id: res.insertId, ...newUser });
            result(null, { id: res.insertId, ...newUser });
        });
    };
}

module.exports = User;
