const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const allowedOrigins = require('./allowedOrigins');

require("dotenv").config({ path: "./.env" });

const corsOpts = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
};

async function startServer() {
    // express app
    const app = express();
    app.set('view engine', 'ejs');
    app.use(cors(corsOpts));
    app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 10 }));
    app.use(express.json());

    // set http headers for security
    app.disable('x-powered-by');

    // routes for any user (login not required)
    app.use('/', require('./routes/login'));
    app.use('/', require('./routes/signup'));

    // serve
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, console.log("Server has started at port " + PORT));
}

var mysqlConnection = null;

async function startMySQL() {

    mysqlConnection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root"
    });
      
    mysqlConnection.connect(function(err) {
        if (err) throw err;
        console.log("Connected to mysql server as root");
    });

}

startServer();
startMySQL();

module.exports = {mysqlConnection}