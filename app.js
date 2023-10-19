const express = require('express');

async function startServer() {
    // express app
    const app = express();
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 10 }));
    app.use(express.json());

    // set http headers for security
    app.disable('x-powered-by');

    // routes for any user (login not required)
    app.use('/', require('./routes/login'));

    // serve
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, console.log("Server has started at port " + PORT));
}

startServer();