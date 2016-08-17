var request = require('request');
var games = require('./endpoints');

module.exports = results;

function toJSON(response) {
    var data = response.toString(),
        result = data.match(/(^{[\s\w\W]+}$)/gm).join('');

    return JSON.parse(result);
}

function results(options) {
    if (!options ||  !options.type) throw new Error('Expected option object with key: type');

    var endpoint = games[options.type],
        fromDrawID = options.fromDrawID || 0,
        toDrawID = options.toDrawID || 0,
        numberOfReqs = (toDrawID - fromDrawID) + 1;


    var promises = Array(numberOfReqs)
        .fill(fromDrawID)
        .map(function (val, index) {
            return new Promise(function (resolve, reject) {
                var url = fromDrawID === 0 ? endpoint : endpoint + (fromDrawID + index);

                request(url, function (error, response, body) {
                    if (error) {
                        return reject(error);
                    }

                    var data = toJSON(body);
                    resolve(data);
                });
            });
        });

    return Promise.all(promises);
}