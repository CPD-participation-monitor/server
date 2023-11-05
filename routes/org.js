const express = require('express');
const { createOrg, getOrgs, requestToJoin, getRequests } = require('../controllers/orgController');

const router = express.Router();

router.post('/createOrganization', createOrg);
router.get('/getOrgs', getOrgs);
router.post('/requestToJoin', requestToJoin);
router.post('/getRequests', getRequests);

module.exports = router;