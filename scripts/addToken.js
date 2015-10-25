#!/usr/bin/env node

var caf_cli = require('caf_cli');
var fs = require('fs');
var path = require('path');

// use caf_iot/util/newDeviceToken.js --password=<change> --accountsURL=https://root-accounts.cafjs.com --caOwner=foo --caLocalName=device1 --appLocalName=helloiot --appPublisher=root > token

var token = fs.readFileSync(path.resolve(__dirname, 'token'),
                            {encoding:'utf8'}).trim();

var caURL = 'https://root-gadget.cafjs.com';

var cli = new caf_cli.Session(caURL, 'foo-device1', {
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
