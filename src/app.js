'use strict';

const http = require('http');
const port = 3001;
const fs = require('fs');
const fileName = 'data.txt';
const path = require('path');
const url = require('url');
const filePath = path.join(__dirname, '../lib/', fileName);
const formidable = require('formidable');

/**
 * function to find first non-repeating character in the input string
 *
 * @param {String} string
 * @return {Object}
 * 
 */
function firstNonRepeatedCharacter(string) {
    for (var i = 0; i < string.length; i++) {
        var c = string.charAt(i);
        if (string.indexOf(c) == i && string.indexOf(c, i + 1) == -1) {
            return c;
        }
    }
    return null;
}

/**
 * request handler to expose the api's and host the server
 *
 * @param {Object} request
 * @param {Object} response
 * @return {Object}
 * 
 */
const requestHandler = (request, response) => {

    var urlParts = url.parse(request.url, true);
    var urlPathname = urlParts.pathname;
    var urlParams = urlParts.query;

    /* To expose /file api for downloading a file from server*/
    if (urlPathname === '/file') {
        fs.exists(filePath, function(exists) {
            if (exists) {
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-Disposition": "attachment; filename=" + fileName
                });
                fs.createReadStream(filePath).pipe(response);
            } else {
                response.writeHead(400, {
                    "Content-Type": "text/plain"
                });
                response.end("ERROR File does not exist");
            }
        });
    } 
    /* To expose /product api for finding a product of given url params - param1 & param2 */
    else if (urlPathname === '/product') {
        if (urlParams.param1 && urlParams.param2) {
            var result = urlParams.param1 * urlParams.param2;
            response.writeHead(200, {
                "Content-Type": "application/json"
            });
            response.end(JSON.stringify({
                "Product": result
            }));
        } else {
            response.writeHead(400, {
                "Content-Type": "application/json"
            });
            response.end(JSON.stringify({
                "Error": "param1 & param2 required for product"
            }));
        }
    } 
    /* To expose /repeating api to find the first non-repeating char in the given param - input */
    else if (urlPathname === '/repeating') {
        if (urlParams.input) {
            var char = firstNonRepeatedCharacter(urlParams.input);
            response.writeHead(200, {
                "Content-Type": "application/json"
            });
            response.end(JSON.stringify({
                "FirstNonRepeatingCharacter": char
            }));
        } else {
            response.writeHead(400, {
                "Content-Type": "application/json"
            });
            response.end(JSON.stringify({
                "Error": "Input param required for processing"
            }));
        }
    } 
    /* To expose /upload api to serve upload page to upload a file to the server */
    else if (urlPathname === '/upload') {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        fs.readFile('../lib/upload.html', function(err, data) {
            if (err) {
                response.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                return response.end("404 Not Found");
            }
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.write(data);
            return response.end();
        });
    } 
    /* To expose /fileupload api to upload a file to the server */
    else if (urlPathname === '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(request, function(err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = path.join('../uploads/', files.filetoupload.name);
            fs.rename(oldpath, newpath, function(err) {
                if (err) {
                    response.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    response.end(JSON.stringify(err));
                } else {
                    response.write(`File : ${files.filetoupload.name} uploaded and moved!`);
                    response.end();
                }
            });
        });
    } 
    /*To serve the home page */
    else {
      response.writeHead(200, {
        "Content-Type": "text/plain"
      });
      response.end(`Welcome to node server, use the README.md file to check for the exposed api's`);
    }
}

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
})