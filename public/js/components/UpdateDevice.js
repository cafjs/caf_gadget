'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const caf_cli = require('caf_cli');

class UpdateDevice extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.handleProperties = this.handleProperties.bind(this);
        this.handlePrivileged = this.handlePrivileged.bind(this);
        this.handleAppNameChange = this.handleAppNameChange.bind(this);
        this.doAppNameChange = this.doAppNameChange.bind(this);
        this.doReset = this.doReset.bind(this);
        this.doDisplayDeviceToken  = this.doDisplayDeviceToken.bind(this);
    }

    handlePrivileged(e) {
        if (!e && this.props.newPrivileged) {
            AppActions.setLocalState(this.props.ctx, {
                warnPrivileged: true
            });
        }

        AppActions.setLocalState(this.props.ctx, {
            newPrivileged: e
        });
    }

    submit(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            this.doAppNameChange(ev);
        }
    }

    handleAppNameChange(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newAppName: ev.target.value
        });
    }

    handleProperties(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newProperties: ev.target.value
        });
    }

    doAppNameChange(ev) {
        const p = this.props.newAppName && this.props.newAppName.split('-');
        if (Array.isArray(p) && (p.length === 2)) {
            let parseError = false;
            if (this.props.newProperties) {
                try {
                    const obj = JSON.parse(this.props.newProperties);
                    if (obj && (typeof obj === 'object')) {
                        const bad = Object.keys(obj)
                              .filter(x => typeof obj[x] !== 'string');
                        parseError = bad.length > 0;
                    } else {
                        parseError = true;
                    }
                } catch (ex) {
                    parseError = true;
                }
            }
            if (parseError) {
                const msg = 'Invalid JSON or values are not strings: ' +
                      this.props.newProperties;
                AppActions.setError(this.props.ctx, new Error(msg));
            } else {
                const meta = {
                    privileged: this.props.newPrivileged,
                    properties: this.props.newProperties
                };
                AppActions.changeApp(this.props.ctx, this.props.newAppName,
                                     meta);
            }
        } else {
            console.log('Invalid app name' + p);
            AppActions.setError(this.props.ctx,
                                new Error('Invalid app name ' + p));
        }
    }

    doReset(ev) {
        AppActions.changeApp(this.props.ctx, null,
                             {privileged: true, properties: ''});
    }

    doDisplayDeviceToken() {
        if (typeof window !== 'undefined') {
            const token =
                  window.location.href ?
                  caf_cli.extractTokenFromURL(window.location.href) :
                  null;

            AppActions.setLocalState(this.props.ctx, {
                deviceToken: token
            });
        }
    }

    render() {
        return cE(rB.Form, {horizontal: true},
                  cE(rB.FormGroup, {controlId: 'appId'},
                     cE(rB.Col, {sm: 6, xs: 12},
                        cE(rB.ControlLabel, null, 'App Name')
                       ),
                     cE(rB.Col, {sm: 6, xs: 12},
                        cE(rB.FormControl, {
                            type: 'text',
                            value: this.props.newAppName,
                            placeholder: 'foo-whatever',
                            onChange: this.handleAppNameChange,
                            onKeyPress: this.submit
                        })
                       )
                    ),
                  cE(rB.FormGroup, {controlId: 'privId'},
                     cE(rB.Col, {sm: 6, xs: 12},
                        cE(rB.ControlLabel, null, 'Privileged')
                       ),
                     cE(rB.Col, {sm: 6, xs: 12},
                        cE(rB.ToggleButtonGroup, {
                            type: 'radio',
                            name : 'privileged',
                            value: !!this.props.newPrivileged,
                            onChange: this.handlePrivileged
                        },
                           cE(rB.ToggleButton, {value: false}, 'Off'),
                           cE(rB.ToggleButton, {value: true}, 'On')
                          )
                       )
                    ),
                  cE(rB.FormGroup, {controlId: 'propsId'},
                     cE(rB.Col, {sm:6, xs: 12},
                        cE(rB.ControlLabel, null,
                           'Properties (JSON object with string values)')
                       ),
                     cE(rB.Col, {sm:6, xs: 12},
                        cE(rB.FormControl, {
                            type: 'text',
                            style: {wordWrap: "break-word"},
                            value: this.props.newProperties,
                            placeholder: '{"FOO": "1", "BAR": "xx"}',
                            onChange: this.handleProperties
                        })
                       )
                    ),
                  cE(rB.FormGroup, {controlId: 'buttonsId'},
                     cE(rB.Col, {sm: 6, xs: 12},
                        cE(rB.ButtonGroup, null,
                           cE(rB.Button, {
                               onClick: this.doAppNameChange,
                               bsStyle: 'primary'
                           }, 'Update'),
                           cE(rB.Button, {
                               onClick: this.doReset,
                               bsStyle: 'danger'
                           }, 'Reset')/*,
                           cE(rB.Button, {
                               onClick: this.doDisplayDeviceToken,
                               bsStyle: 'primary'
                           }, 'Show Token')*/
                          )
                       )
                    )
                 );
    }
};

module.exports = UpdateDevice;
