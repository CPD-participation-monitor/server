const express = require('express');
const { issueCertificate, verifyCertificate } = require('../controllers/certificateController');

const router = express.Router();

router.post('/certificate/generate', issueCertificate);
router.post('/certificate/verify', verifyCertificate);

module.exports = router;