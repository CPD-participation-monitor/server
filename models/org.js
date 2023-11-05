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

    static getOrgs(con, res){
        try{
            con.query("SELECT * FROM org", function (err, result) {
                if (err) throw err;
    
                con.query("select orgId, count(*) from admin_org group by (orgID);", function(err, result2){
                    if (err) throw err;
    
                    const orgCount = {};
                    result2.forEach(row => {
                        orgCount[row.orgId] = row['count(*)'];
                    });
    
                    let returnOrgs = [];
    
                    for(let i = 0; i < result.length; i++){
                        returnOrgs.push({
                            id: result[i].id.toString(),
                            name: result[i].orgName,
                            email: result[i].email,
                            members: orgCount[result[i].id]
                        });
                    }
    
                    res?.status(200).json({ 'success': true, 'orgs': returnOrgs });
                });
            });
        }
        catch(err){
            console.log(err);
            res?.status(500).json({ 'success': false, 'reason': 'Error occured when retrieving orgs.' });
        }
    }

    static joinOrg(con, res, data){
        try{

            

        } catch(err){
            console.log(err);
            res?.status(500).json({ 'success': false, 'reason': 'Error occured when joining org.' });
        }
    }
}

module.exports = { Org };
