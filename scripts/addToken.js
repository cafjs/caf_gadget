#!/usr/bin/env node

var parseArgs = require('minimist');
var caf_cli = require('caf_cli');
var fs = require('fs');
var path = require('path');

// Usage : ./addToken.js --token=./token --deviceName=foo-device1

// To generate token use: caf_iot/util/newDeviceToken.js --password=<change> --accountsURL=https://root-accounts.cafjs.com --caOwner=foo --caLocalName=device1 --appLocalName=helloiot --appPublisher=root > token

var argv = parseArgs(process.argv.slice(2));

var prop = function(x, defaultValue) {
    var result =  argv[x] || process.env['CAF_' + x.toUpperCase()] ||
            defaultValue;
    if (typeof result !== 'string') {
        var msg = 'Property ' + x + ' not defined';
        console.error(msg);
        throw new Error(msg);
    }
    return result;
};


var token = fs.readFileSync(path.resolve(__dirname, 'token'),
                            {encoding:'utf8'}).trim();

var caURL = 'https://root-gadget.cafjs.com';


var cli = new caf_cli.Session(caURL, prop('deviceName'), {
    from : 'NOBODY-UNKNOWN',
    disableBackchannel: true,
    session : 'default',
    log: function(msg) {
        console.log(msg);
    }
});

cli.onclose = function(err) {
    console.log('Closing');
    if (err) {
        console.log(JSON.stringify(err));
    }
};

cli.onmessage = function(msg) {
    console.log(msg);
};

cli.onopen = function() {
    cli.addToken(token, function(err, data) {
        if (err) {
            console.log(JSON.stringify(err));
        } else {
            console.log('OK');
        }
        cli.close();
    });
};
