class Org{
    constructor(con, res, data) {
        this.data = data;
        this.create(con, res);
    }

    create(con, res){
        let data = this.data;

        con.query("select count(*) from org where orgName = ?", [data.orgName], async function (err, result) {
            if (err) throw err;
            let count = result[0]['count(*)'];
            if (count !== 0) {
                console.log("Org already exists");
                res?.status(409).json({ 'success': false, 'reason': 'Org already exists' });
                return;
            }

            con.query("INSERT INTO org (orgName, email) VALUES (?, ?)", [data.orgName, data.email], function (err, result) {
                if (err) throw err;
                res?.status(200).json({ 'success': true });
            });
        });
    }
}

module.exports = { Org };
