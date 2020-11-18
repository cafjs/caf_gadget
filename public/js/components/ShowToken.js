const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');

class ShowToken extends React.Component {

    constructor(props) {
        super(props);
        this.doDismiss = this.doDismiss.bind(this);
    }

    doDismiss(ev) {
        AppActions.setLocalState(this.props.ctx, {
            deviceToken : null
        });
    }

    render: function() {
        return cE(rB.Modal, {show: !!this.props.deviceToken,
                             onHide: this.doDismiss,
                             animation: false},
                  cE(rB.Modal.Header, {
                      className : 'bg-primary text-primary',
                      closeButton: true},
                     cE(rB.Modal.Title, null, "Copy to file '/config/token'" +
                        ' in your device')
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Form, {horizontal: true},
                        cE(rB.FormGroup, {controlId: 'tokenId'},
                           cE(rB.Col, {sm: 12},
                              cE(rB.FormControl.Static,
                                 {style: {wordWrap: 'break-word'}},
                                 this.props.deviceToken)
                             )
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doDismiss}, 'Continue')
                    )
                 );
    }
};

module.exports = ShowToken;
