const request = require('request');
const log = console.log;

const httpRequest = (url, callback) => {
    request(url, (err, res, body) => {
        log(`Make http request to ${url}`);
        if (err) {
            callback(err, undefined);
        }else {
            callback(undefined, body);
        }
    })
}

module.exports = httpRequest;