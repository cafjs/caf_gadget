// Modifications copyright 2020 Caf.js Labs and contributors
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

'use strict';
const caf = require('caf_core');
const json_rpc = caf.caf_transport.json_rpc;
const app = require('../public/js/app.js');

const APP_SESSION = 'default';
const IOT_SESSION = 'iot';

const notifyIoT = function(self, msg) {
    self.$.session.notify([msg], IOT_SESSION);
};

const notifyWebApp = function(self, msg) {
    self.$.session.notify([msg], APP_SESSION);
};

exports.methods = {
    async __ca_init__() {
        this.$.security.addRule(this.$.security.newSimpleRule('addToken'));
        this.$.security.addRule(this.$.security
                                .newSimpleRule('__external_ca_touch__'));
        this.$.session.limitQueue(1); // only the last notification
        this.$.session.limitQueue(1, IOT_SESSION); // only the last notification
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        this.state.allTokens = {};
        this.state.token = null;
        return [];
    },

    async __ca_pulse__() {
        this.$.log && this.$.log.debug('calling PULSE!!! ');
        this.$.react.render(app.main, [this.state]);
        return [];
    },

    async hello(key) {
        this.$.react.setCacheKey(key);
        return this.getState();
    },

    // can be called by user *nobody*, see __ca_init__ and framework++.json
    async addToken(tokenStr) {
        const token = this.$.security.verifyToken(tokenStr);
        if (!token) {
            const err = new Error('Invalid Token');
            err.tokenStr = tokenStr.slice(0, 10);
            return [err];
        } else {
            const appName = json_rpc.joinName(token.appPublisher,
                                              token.appLocalName);
            const caName = json_rpc.joinName(token.caOwner,
                                             token.caLocalName);
            if (caName !== this.__ca_getName__()) {
                const err = new Error('Token not matching current app or CA');
                err.tokenStr = tokenStr.slice(0, 10);
                return [err];
            } else {
                this.state.allTokens[appName] = tokenStr;
                if (appName == this.state.appName) {
                    this.state.token = tokenStr;
                    notifyWebApp(this, 'token');
                    notifyIoT(this, 'token');
                    return [null, this.state.meta];
                } else {
                    return [];
                }
            }
        }
    },

    async changeApp(newApp, meta) {
        if (newApp !== this.state.appName) {
            this.state.token = this.state.allTokens[newApp] || null;
        }
        this.state.appName = newApp;
        this.state.meta = meta;
        notifyWebApp(this, 'newApp');
        notifyIoT(this, 'newApp');
        if (newApp) {
            return this.getState();
        } else {
            return this.updateStatus('N/A');
        }
    },

    async updateStatus(newStatus) {
        this.state.status = newStatus;
        notifyWebApp(this, 'status');
        return this.getState();
    },

    async getState() {
        this.$.react.coin();
        return [null, this.state];
    }
};


caf.init(module);
