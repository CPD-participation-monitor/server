const express = require('express');
const { createOrg, getOrgs, requestToJoin, getRequests, acceptRequest } = require('../controllers/orgController');

const router = express.Router();

router.post('/createOrganization', createOrg);
router.get('/getOrgs', getOrgs);
router.post('/requestToJoin', requestToJoin);
router.get('/getRequests', getRequests);
router.post('/acceptRequest', acceptRequest);

module.exports = router;