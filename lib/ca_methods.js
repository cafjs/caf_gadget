/*!
Copyright 2013 Hewlett-Packard Development Company, L.P.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

"use strict";
var caf = require('caf_core');
var json_rpc = caf.caf_transport.json_rpc;
var app = require('../public/js/app.js');

var IOT_SESSION='iot';

exports.methods = {
    '__ca_init__' : function(cb) {
        this.$.security.addRule(this.$.security.newSimpleRule('addToken'));
        this.$.security.addRule(this.$.security
                                .newSimpleRule('__external_ca_touch__'));
        this.$.session.limitQueue(1); // only the last notification
        this.$.session.limitQueue(1, IOT_SESSION); // only the last notification
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        cb(null);
    },
    '__ca_pulse__' : function(cb) {
        this.$._.$.log && this.$._.$.log.debug('calling PULSE!!! ');
        this.$.react.render(app.main, [this.state]);
        cb(null, null);
    },
    'hello' : function(key, cb) {
        this.$.react.setCacheKey(key);
        this.getState(cb);
    },
    // can be called by user *nobody*, see __ca_init__
    'addToken' : function(tokenStr, cb) {
        var token = this.$.security.verifyToken(tokenStr);
        if (!token) {
            var err = new Error('Invalid Token');
            err.tokenStr = tokenStr.slice(0, 10);
            cb(err);
        } else {
            var appName = json_rpc.joinName(token.appPublisher,
                                            token.appLocalName);
            var caName = json_rpc.joinName(token.caOwner,
                                           token.caLocalName);
            if ((caName !==  this.__ca_getName__()) ||
                (appName !== this.state.appName)) {
                err = new Error('Token not matching current app or CA');
                err.tokenStr = tokenStr.slice(0, 10);
                cb(err);
            } else {
                this.state.token = tokenStr;
                this.$.session.notify(['token'], 'default');
                this.$.session.notify(['token'], IOT_SESSION);
                cb(null);
            }
        }
    },
    'changeApp' : function(newApp, cb) {
        if (newApp !== this.state.appName) {
            this.state.token = null;
        }
        this.state.appName = newApp;
        this.$.session.notify(['newApp'], 'default');
        this.$.session.notify(['newApp'], IOT_SESSION);
        this.getState(cb);
    },
    'updateStatus' : function(newStatus, cb) {
        this.state.status = newStatus;
        this.$.session.notify(['status'], 'default');
        this.getState(cb);
    },
    'getState' : function(cb) {
        this.$.react.coin();
        cb(null, this.state);
    }
};


caf.init(module);

