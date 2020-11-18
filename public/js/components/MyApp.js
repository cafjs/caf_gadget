var React = require('react');
var rB = require('react-bootstrap');
var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');
var AppStatus = require('./AppStatus');
var DisplayError = require('./DisplayError');
var ShowToken = require('./ShowToken');
var PropertyEditor = require('./PropertyEditor');
var urlParser = require('url');
var querystring = require('querystring');
var caf_cli = require('caf_cli');

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
    handlePrivileged: function() {
        AppActions.setLocalState({
            checked: this.refs.privileged.getChecked()
        });
    },
    handleAppNameChange: function() {
        AppActions.setLocalState({
            appTempName: this.refs.appName.getValue()
        });
    },
    doAppNameChange : function(ev) {
        var p = this.state.appTempName && this.state.appTempName.split('-');
        if (Array.isArray(p) && (p.length === 2)) {
            var meta = {
                privileged: this.state.checked || false,
                properties: this.state.tempProperties
            };
            AppActions.changeApp(this.state.appTempName, meta);
        } else {
            console.log('Invalid app name' + p);
            AppActions.setLocalState({
                error: new Error('Invalid app name ' + p)
            });
        }
    },
    doReset: function(ev) {
        AppActions.changeApp(null, {privileged: false, properties: "{}"});
    },
    doDisplayDeviceToken : function() {
        var token = (window.location.href ?
                     caf_cli.extractTokenFromURL(window.location.href) : null);
        AppActions.setLocalState({
            deviceToken : token
        });
    },
    doDisplayPropertyEditor: function() {
         AppActions.setLocalState({
             devicePropertyEditor : {}
        });
    },
    render: function() {
        return cE("div", {className: "container-fluid"},
                  cE(DisplayError, {
                      error: this.state.error
                  }),
                  cE(ShowToken, {
                      deviceToken: this.state.deviceToken
                  }),
                  cE(PropertyEditor, {
                      devicePropertyEditor: this.state.devicePropertyEditor
                  }),
                  cE(rB.Panel, {header: cE(rB.Grid, {fluid: true},
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
                     cE(rB.Panel, {header: "Update Device Application"},
                        cE(rB.Grid, {fluid: true},
                           cE(rB.Row, {className: 'row-center-align'},
                              cE(rB.Col, {xs:9, sm: 10},
                                 cE(rB.Input, {
                                     type: 'text',
                                     label: "Application",
                                     value: this.state.appTempName,
                                     ref: 'appName',
                                     placeholder: 'publisher-app',
                                     onChange : this.handleAppNameChange,
                                     onKeyDown: this.submit
                                 })
                                ),
                              cE(rB.Col, {xs:3, sm:2},
                                 cE(rB.Input, {
                                     type: 'checkbox',
                                     ref: 'privileged',
                                     checked: this.state.checked,
                                     onClick: this.handlePrivileged
                                 }, 'Privileged')
                                )
                             ),
                           cE(rB.Row, {className: 'row-center-align-extra'},
                              cE(rB.Col, {xs:9, sm: 10},
                                 cE(rB.Input, {
                                     type:"textarea",
                                     label: "Properties",
                                     readOnly: 'true',
                                     value:  this.state.tempProperties || "{}"
                                 })
                                ),
                              cE(rB.Col, {xs:3, sm: 2},
                                 cE(rB.Button, {
                                     onClick: this.doDisplayPropertyEditor,
                                     bsStyle: 'primary'
                                 }, 'Edit')
                                )
                             ),
                           cE(rB.Row, {className: 'row-center-align'},
                              cE(rB.Col, {xs:9, sm:8},
                                 cE(rB.ButtonGroup, null,
                                     cE(rB.Button, {
                                         onClick: this.doAppNameChange,
                                         bsStyle: 'primary'
                                     }, 'Update'),
                                    cE(rB.Button, {
                                        onClick: this.doReset,
                                        bsStyle: 'danger'
                                    }, 'Reset')
                                   )
                                )
                             )
                          )
                       ),
                     cE(rB.Panel, {header: "Device State"},
                        cE(rB.Grid, {fluid: true},
                           cE(rB.Row, null,
                              cE(rB.Col, {xs:12, sm: 3},
                                 cE(rB.Input, {
                                     label:  'Current App',
                                     type: 'text', id: 'currentApp',
                                     readOnly: 'true',
                                     value: this.state.appName,
                                     defaultValue: 'NONE'
                                 })
                                ),
                              cE(rB.Col, {xs:12, sm: 3},
                                 cE(rB.Input, {
                                     label:  'Privileged',
                                     type: 'text', id: 'privilege',
                                     readOnly: 'true',
                                     value: this.state.meta &&
                                         this.state.meta.privileged,
                                     defaultValue: 'false'
                                 })
                                ),
                              cE(rB.Col, {xs:12, sm: 3},
                                 cE(rB.Input, {
                                     label: 'Status',
                                     type: 'text', id: 'statusApp',
                                     readOnly: 'true',
                                     value: this.state.status,
                                     defaultValue: 'UNKNOWN'
                                 })
                                ),
                              cE(rB.Col, {xs:12, sm: 3},
                                 cE(rB.Input, {
                                     label: 'App Token Ready?',
                                     type: 'text', id: 'tokenReady',
                                     readOnly: 'true',
                                     value: (this.state.token ? 'YES' :
                                             'NO'),
                                     defaultValue: 'UNKNOWN'
                                 })
                                )
                             ),
                            cE(rB.Row, null,
                               cE(rB.Col, {xs:12, sm: 12},
                                  cE(rB.Input, {
                                      type:"textarea",
                                      label: "Properties",
                                      readOnly: 'true',
                                      value:  this.state.meta &&
                                          this.state.meta.properties
                                  })
                                 )
                              )
                          )
                       ),
                     cE(rB.Panel, {header: "Display Device Token"},
                        cE(rB.Grid, {fluid: true},
                           cE(rB.Row, null,
                              cE(rB.Col, {xs:12, sm:6},
                                 cE(rB.Button, {
                                     onClick: this.doDisplayDeviceToken,
                                     bsStyle: 'primary'
                                 }, 'Show')
                                )
                             )
                          )
                       )
                    )
                 );
    }
};

module.exports = React.createClass(MyApp);
