var React = require('react');
var rB = require('react-bootstrap');
var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');
var AppStatus = require('./AppStatus');
var NewError = require('./NewError');
var ShowToken = require('./ShowToken');
var urlParser = require('url');
var querystring = require('querystring');

var cE = React.createElement;

var MyApp = {
    getInitialState: function() {
        return AppStore.getState();
    },
    componentDidMount: function() {
        AppStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange : function(ev) {
        this.setState(AppStore.getState());
    },
    submit: function(ev) {
        if (ev.key === 'Enter') {
            this.doAppNameChange(ev);
        }
    },
    handleAppNameChange: function() {
        AppActions.setLocalState({
            appTempName: this.refs.appName.getValue()
        });
    },
    doAppNameChange : function(ev) {
        var p = this.state.appTempName && this.state.appTempName.split('-');
        if (Array.isArray(p) && (p.length === 2)) {
            AppActions.changeApp(this.state.appTempName);
        } else {
            console.log('Invalid app name' + p);
            AppActions.setLocalState({
                error: new Error('Invalid app name ' + p)
            });
        }
    },
    doDisplayDeviceToken : function() {
        var token = null;
        if (window) {
            var parsedURL = urlParser.parse(window.location.href);
            if (parsedURL.hash && (parsedURL.hash.indexOf('#') === 0)) {
                var hash = querystring.parse(parsedURL.hash.slice(1));
                token = hash.token;
            }
        }
        AppActions.setLocalState({
            deviceToken : token
        });
    },
    render: function() {
        return cE("div", {className: "container-fluid"},
                  cE(NewError, {
                         error: this.state.error
                     }),
                  cE(ShowToken, {
                         deviceToken: this.state.deviceToken
                     }),
                  cE(rB.Panel, {header: cE(rB.Grid, null,
                                           cE(rB.Row, null,
                                              cE(rB.Col, {sm:1, xs:1},
                                                 cE(AppStatus, {
                                                        isClosed:
                                                        this.state.isClosed
                                                    })
                                                ),
                                              cE(rB.Col, {
                                                     sm: 5,
                                                     xs:10,
                                                     className: 'text-right'
                                                 },
                                                 "Register Your Gadget"
                                                ),
                                              cE(rB.Col, {
                                                     sm: 5,
                                                     xs:11,
                                                     className: 'text-right'
                                                 },
                                                 this.state.fullName
                                                )
                                             )
                                          )
                               },
                     cE(rB.Panel, {header: "Display Device Token"},
                        cE(rB.Grid, null,
                           cE(rB.Row, null,
                              cE(rB.Col, {xs:12, sm:6},
                                 cE(rB.Button, {
                                     onClick: this.doDisplayDeviceToken,
                                     bsStyle: 'primary'
                                 },
                                    'Show')
                                )
                             )
                          )
                       ),
                     cE(rB.Panel, {header: "Update Application in the Device"},
                        cE(rB.Grid, null,
                           cE(rB.Row, null,
                              cE(rB.Col, {xs:12, sm: 6},
                                 cE(rB.Input, {
                                     type: 'text',
                                     value: this.state.appTempName,
                                     ref: 'appName',
                                     placeholder: 'publisherName-appName',
                                     onChange : this.handleAppNameChange,
                                     onKeyDown: this.submit
                                 })
                                ),
                              cE(rB.Col, {xs:12, sm:6},
                                 cE(rB.Button, {onClick: this.doAppNameChange,
                                                bsStyle: 'primary'},
                                    'Update app')
                                )
                             )
                          )
                       ),
                     cE(rB.Panel, {header: "Device State"},
                        cE(rB.Grid, null,
                           cE(rB.Row, null,
                              cE(rB.Col, {xs:12, sm: 4},
                                 cE('p', null, 'Current App',
                                    cE(rB.Input, {
                                           type: 'text', id: 'currentApp',
                                           readOnly: 'true',
                                           value: this.state.appName,
                                           defaultValue: 'NONE'
                                       })
                                   )
                                ),
                              cE(rB.Col, {xs:12, sm: 4},
                                 cE('p', null, 'Status',
                                    cE(rB.Input, {
                                           type: 'text', id: 'statusApp',
                                           readOnly: 'true',
                                           value: this.state.status,
                                           defaultValue: 'UNKNOWN'
                                    })
                                   )
                                ),
                              cE(rB.Col, {xs:12, sm: 4},
                                 cE('p', null, 'App Token Ready?',
                                    cE(rB.Input, {
                                           type: 'text', id: 'tokenReady',
                                           readOnly: 'true',
                                           value: (this.state.token ? 'YES' :
                                                   'NO'),
                                           defaultValue: 'UNKNOWN'
                                    })
                                   )
                                )
                             )
                          )
                       )
                    )
                 );
    }
};

module.exports = React.createClass(MyApp);
