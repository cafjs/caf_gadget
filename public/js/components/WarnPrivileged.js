const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');

class WarnPrivileged extends React.Component {

    constructor(props) {
        super(props);
        this.doHide = this.doHide.bind(this);
    }

    doHide(ev) {
        AppActions.setLocalState(this.props.ctx, {warnPrivileged: false});
    }

    render() {
        const show = this.props.warnPrivileged;

        return cE(rB.Modal, {show: show,
                             onHide: this.doHide,
                             animation: false},
                  cE(rB.Modal.Header, {
                         className : "bg-warning text-warning",
                         closeButton: true
                     },
                     cE(rB.Modal.Title, null, 'Non-Privileged Apps')
                    ),
                  cE(rB.Modal.Body, null,
                     cE(rB.Alert, {bsStyle: 'danger', style:
                                   {wordWrap: 'break-word'}},
                        'Most apps need a privileged ' +
                        'container running in the device. For example, ' +
                        'when they access Bluetooth or I2C. The exception ' +
                        'are apps that just use the GPIO pins with the ' +
                        '/dev/gpiomem interface on a Raspberry Pi.'
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doHide}, "Dismiss")
                    )
                 );
    }
};

module.exports = WarnPrivileged;
