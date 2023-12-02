const express = require('express');
const { verifyCertificate } = require('../controllers/certificateController');

const router = express.Router();

router.post('/verify', verifyCertificate);

module.exports = router;