

class User {
    constructor (con, username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.create(con);
    }

    create(con) {
        con.query('INSERT INTO users SET ?', this, (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
    
            console.log('created user: ', this);
        });
    };
}

module.exports = {User};
