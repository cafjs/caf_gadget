'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const caf_cli = require('caf_cli');

class UpdateDevice extends React.Component {

    constructor(props) {
        super(props);
    }

    submit(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            this.doAppNameChange(ev);
        }
    }
    handlePrivileged(e) {
        AppActions.setLocalState(this.props.ctx,{
            checked: this.refs.privileged.getChecked()
        });
    }
    handleAppNameChange(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newAppName: ev.target.value
        });
    }

    doAppNameChange(ev) {
        const p = this.state.appTempName && this.state.appTempName.split('-');
        if (Array.isArray(p) && (p.length === 2)) {
            const meta = {
                privileged: this.state.checked || false,
                properties: this.state.tempProperties
            };
            AppActions.changeApp(this.props.ctx, this.state.appTempName, meta);
        } else {
            console.log('Invalid app name' + p);
            AppActions.setLocalState(this.props.ctx, {
                error: new Error('Invalid app name ' + p)
            });
        }
    }

    doReset(ev) {
        AppActions.changeApp(this.props.ctx, null,
                             {privileged: true, properties: "{}"});
    }

    doDisplayDeviceToken() {
        if (typeof window !== 'undefined') {
            const token =
                  window.location.href ?
                  caf_cli.extractTokenFromURL(window.location.href) :
                  null;

            AppActions.setLocalState(this.props.ctx, {
                deviceToken : token
            });
        }
    }

    render() {
        return cE(rB.Form, {horizontal: true},
                  cE(rB.FormGroup, {controlId: 'appId'},
                     cE(rB.Col, {sm: 3, xs:6},
                        cE(rB.ControlLabel, null, 'Application')
                       ),
                     cE(rB.Col, {sm: 3, xs:6},
                        cE(rB.FormControl, {
                            type: 'text',
                            value: this.props.newAppName,
                            placeholder: 'you-whatever',
                            onChange: this.handleAppNameChange,
                            onKeyPress: this.submit
                        })
                       ),
                     cE(rB.Col, {sm: 3, xs:6},
                        cE(rB.ControlLabel, null, 'Privileged')
                       ),
                     cE(rB.Col, {sm:3, xs: 6},
                        cE(rB.ToggleButtonGroup, {
                            type: 'radio',
                            name : 'privileged',
                            value: this.props.privileged ? 1 : 0,
                            onChange: this.handlePrivileged
                        },
                           cE(rB.ToggleButton, {value: 0}, 'Off'),
                           cE(rB.ToggleButton, {value: 1}, 'On')
                          )
                       )
                    ),
                  cE(rB.FormGroup, {controlId: 'propsId'},
                     cE(rB.Col, {sm:6, xs: 12},
                        cE(rB.ControlLabel, null,
                           'Properties (JSON object with string values')
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
                     cE(rB.Col, {smOffset: 3, sm: 6, xs: 12},
                        cE(rB.ButtonGroup, null,
                           cE(rB.Button, {
                               onClick: this.doAppNameChange,
                               bsStyle: 'primary'
                           }, 'Update'),
                           cE(rB.Button, {
                               onClick: this.doReset,
                               bsStyle: 'danger'
                           }, 'Reset'),
                           cE(rB.Button, {
                               onClick: this.doDisplayDeviceToken,
                               bsStyle: 'primary'
                           }, 'Show Token')
                          )
                       )
                    )
                 );
    }
};

module.exports = UpdateDevice;
