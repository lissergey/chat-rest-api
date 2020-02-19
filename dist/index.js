const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const config = require('./config');
const routes = require('./routes');

let app = express();
app.server = http.createServer(app);

app.use(bodyParser.json({
    limit: config.bodyLimit
}));

app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
},
    Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/api', routes);

app.server.listen(config.port);
console.log(`Started on port ${app.server.address().port}`);

module.exports = app;