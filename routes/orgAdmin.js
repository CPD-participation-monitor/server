const express = require('express');
const { createOrg } = require('../controllers/orgAdminController');

const router = express.Router();

router.post('/createOrganization', createOrg);

module.exports = router;