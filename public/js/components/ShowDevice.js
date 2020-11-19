'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;

class ShowDevice extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return cE(rB.Form, {horizontal: true},
                  cE(rB.FormGroup, {controlId: 'device1Id'},
                     cE(rB.Col, {componentClass: rB.ControlLabel, sm: 3, xs: 6},
                        'App Name'),
                     cE(rB.Col, {sm: 3, xs: 6},
                        cE(rB.FormControl.Static, null, this.props.appName)
                       ),
                     cE(rB.Col, {componentClass: rB.ControlLabel, sm: 3, xs: 6},
                        'Privileged'),
                     cE(rB.Col, {sm: 3, xs: 6},
                        cE(rB.FormControl.Static, null, this.props.privileged)
                       )
                    ),

                  cE(rB.FormGroup, {controlId: 'device2Id'},
                     cE(rB.Col, {componentClass: rB.ControlLabel, sm: 3, xs: 6},
                        'Status'),
                     cE(rB.Col, {sm: 3, xs: 6},
                        cE(rB.FormControl.Static, null, this.props.status)
                       ),
                     cE(rB.Col, {componentClass: rB.ControlLabel, sm: 3, xs: 6},
                        'Token'),
                     cE(rB.Col, {sm: 3, xs: 6},
                        cE(rB.FormControl.Static, null, this.props.token)
                       )
                    ),

                  cE(rB.FormGroup, {controlId: 'device3Id'},
                     cE(rB.Col, {componentClass: rB.ControlLabel, sm: 3,
                                 xs: 6}, 'Properties'),
                     cE(rB.Col, {sm: 9, xs: 12},
                        cE(rB.FormControl.Static, null, this.props.properties)
                       )
                    )
                 );
    }
};

module.exports = ShowDevice;
