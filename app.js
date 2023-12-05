const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const allowedOrigins = require('./allowedOrigins');

require("dotenv").config({ path: "./.env" });

const corsOpts = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
};

async function startServer() {
    // express app
    const app = express();
    app.set('view engine', 'ejs');
    app.set('env', 'production')
    app.use(cors(corsOpts));
    app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 10 }));
    app.use(express.json());
    app.use(cookieParser());

    // set http headers for security
    app.disable('x-powered-by');

    app.use('/public/publicKey.pem', express.static(path.join(__dirname, 'keys/publicKey.pem')));

    // routes for any user (login not required)
    app.use('/', require('./routes/login'));
    app.use('/', require('./routes/signup'));
    app.use('/', require('./routes/publicOrgs'));
    app.use('/certificate/', require('./routes/certificatePub'));

    // authorization route
    app.use('/', require('./routes/auth'));

    // routes for authorized users (login required)
    app.use('/certificate/', require('./routes/certificate'));
    app.use('/api-org', require('./routes/org'));

    // serve
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, console.log("Server has started at port " + PORT));
}

startServer();