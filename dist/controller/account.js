const mongoose = require('mongoose');
const { Router } = require('express');
const Account = require('../model/account');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('../config');

const { generateAccessToken, respond, authenticate } = require('../middleware/authmiddleware');

module.exports = ({ config, db }) => {
    let api = Router();

    api.post('/register', (req, res) => {
        Account.register(new Account({ username: req.body.name}), req.body.password, function(err,account) {
            if (err) {
                res.send(err);
            }

            passport.authenticate(
                'local', {
                    session: false
                })(req, res, () => {
                    res.status(200).send('Successfully created new account');
                });
         });
    });

    api.post('/login', passport.authenticate(
        'local', {
            session: false,
            scope: []
        }), generateAccessToken, respond);

    api.get('/logout', authenticate, (req, res) => {
        res.logout();
        res.status(200).send('Successfully logged out');
    });


    return api;
}