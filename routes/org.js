const express = require('express');
const { createOrg, getOrgs } = require('../controllers/orgController');

const router = express.Router();

router.post('/createOrganization', createOrg);
router.get('/getOrgs', getOrgs);

module.exports = router;