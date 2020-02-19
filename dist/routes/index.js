const express = require('express');
const config = require('../config');
const middleware = require('../middleware');
const initializeDb = require('../db');
const message = require('../controller/message');
const account = require('../controller/account');

let router = express();

initializeDb(db => {
    router.use(middleware({config, db}));

    router.use('/messages', message ({config, db}));
    router.use('/account', account ({config, db}));
});

module.exports = router; 

