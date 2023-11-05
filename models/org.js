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
                res.status(200).json({ 'success': true });
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
    
                    res.status(200).json({ 'success': true, 'orgs': returnOrgs });
                });
            });
        }
        catch(err){
            console.log(err);
            res?.status(500).json({ 'success': false, 'reason': 'Error occured when retrieving orgs.' });
        }
    }

    static requestToJoin(con, res, data){

        const orgID = data.orgID;
        const email = data.email;

        con.query(`select * from request where email = "${email}" and orgID = ${orgID};`, function(err, result){
            if(err) throw err;

            if(result.length !== 0){
                res.status(409).json({ 'success': false, 'reason': 'Request already exists' });
                return;
            }

            con.query(`insert into request values (${orgID}, "${email}");`, function(err, result){
                if(err) throw err;

                res?.status(200).json({ 'success': true });
                return;
            });
        });

    }

    static getRequests(con, res, data){

        const email = data.email;

        con.query(`select role from user where email = "${email}";`, function(err, result){
            if(err) throw err;

            if(result[0].role !== 3112){
                res.status(403).json({ 'success': false, 'reason': 'Unauthorized' });
                return;
            }

            con.query(`select * from request where orgID in (select orgID from admin_org where email = "${email}");`, function(err, result){
                if(err) throw err;

                let requests = [];

                result.forEach(row => {
                    requests.push({
                        orgID: row.orgID,
                        email: row.email
                    });
                });

                res.status(200).json({ 'success': true, 'requests': requests });
                return;
            });
        });

    }

    static acceptRequest(con, res, data){
            
            const orgID = data.orgID;
            const email = data.email;
    
            con.query(`delete from request where email = "${email}" and orgID = ${orgID};`, function(err, result){
                if(err) throw err;

                // check if user is already an admin
                con.query(`select * from admin_org where email = "${email}"`, function(err, result){
                    if(err) throw err;

                    if(result.length !== 0){
                        res.status(409).json({ 'success': false, 'reason': 'User is already an admin' });
                        return;
                    }

                    con.query(`insert into admin_org values ("${email}", ${orgID});`, function(err, result){
                        if(err) throw err;
    
                        res.status(200).json({ 'success': true });
                        return;
                    });
                });
            });
    }
}

module.exports = { Org };
