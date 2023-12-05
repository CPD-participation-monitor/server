const express = require('express');
const jwt = require('jsonwebtoken');

const KEY = process.env.JWT_SECRET;
if (!KEY) throw new Error("JWT_SECRET not specified");

const router = express.Router();

// if not logged in, send Unauthorized
router.all(/.*/, (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        res.sendStatus(401);
        return;
    }
    try {
        const data = jwt.verify(token, KEY);
        if (data.email) {
            req.email = data.email;
            req.role = data.role;
            if (data.orgID) req.orgID = data.orgID;
            next();
        } else {
            res.sendStatus(401);
        }
    } catch {
        return res.sendStatus(401);
    }
});

module.exports = router;