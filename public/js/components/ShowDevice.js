'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;

const MESSAGE = 'Using the menu in the top left corner, create a CA for this ' +
      'app with a name similar to the device name, i.e., ';

const MESSAGE2 = '. If this CA was already created, just switch to it to ' +
      'force a token update.';

class ShowDevice extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const fullName = (x) => x + '#' + this.props.fullName.split('#')[1];

        return cE(rB.Form, {horizontal: true},
                  cE(rB.FormGroup, {controlId: 'device1Id'},
                     cE(rB.Table, {striped: true, responsive: true,
                                   bordered: true,
                                   condensed: true, hover: true},
                        cE('thead', {key:0},
                           cE('tr', {key:1},
                              cE('th', {key:2}, 'App Name'),
                              cE('th', {key:5}, 'Privileged'),
                              cE('th', {key:6}, 'Status'),
                              cE('th', {key:9}, 'Token'),
                              cE('th', {key:10}, 'Properties')
                             )
                          ),
                        cE('tbody', {key:8}, this.props.appName ?
                           [
                               cE('tr', {key:100},
                                  cE('td', {key:101}, this.props.appName),
                                  cE('td', {key:102}, this.props.privileged ?
                                     'YES' : 'NO'),
                                  cE('td', {key:107}, this.props.status),
                                  cE('td', {key:103}, this.props.token ?
                                     'YES': 'NO'),
                                  cE('td', {key:109}, this.props.properties)
                                 )
                           ] :
                           []
                          )
                       )
                    ),
                  cE(rB.FormGroup, {controlId: 'device3Id',
                                    validationState: 'error'},
                     this.props.appName && !this.props.token ?
                     [
                         cE(rB.Col, {componentClass: rB.ControlLabel, sm: 3,
                                     xs: 6, key: 32}, 'Warning: No token'),
                         cE(rB.Col, {sm: 9, xs: 12, key:76},
                            cE(rB.FormControl.Static, null, MESSAGE +
                               fullName(this.props.appName) + MESSAGE2)
                           )
                     ] :
                     []
                    )
                 );
    }
};

module.exports = ShowDevice;
