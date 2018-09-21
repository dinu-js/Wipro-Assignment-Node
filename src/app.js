'use strict';

const http = require('http');
const port = 3001;
const requestHandler = require('./requestHandler.js');

/**
 * creating a server 
 *
 * @param {Function} requestHandler
 * @return {Object}
 * 
 */
const server = http.createServer(requestHandler);

/**
 * listening to a server 
 *
 * @param {String} port
 * @param {Function} function
 * 
 */
server.listen(port, (err) => {
    if (err) {
        console.log('Error Occurred', err);
    }
    console.log(`server is listening on ${port}`);
});

module.exports = server;