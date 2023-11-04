const express = require('express');
const { issueCertificate } = require('../controllers/certificateController');

const router = express.Router();

router.post('/certificate', issueCertificate);

module.exports = router;