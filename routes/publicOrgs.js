const express = require('express');
const { getOrgsPublic } = require('../controllers/orgController');

const router = express.Router();

router.get('/getOrgDetails', getOrgsPublic);

module.exports = router;