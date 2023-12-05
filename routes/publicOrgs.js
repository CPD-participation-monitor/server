const express = require('express');
const { getOrgsPublic, getOrgSessionsPublic } = require('../controllers/orgController');

const router = express.Router();

router.get('/getOrgDetails', getOrgsPublic);
router.get('/getSessionDetails', getOrgSessionsPublic);

module.exports = router;