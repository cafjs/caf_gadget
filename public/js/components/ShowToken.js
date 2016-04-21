var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');

var ShowToken = {

    doDismiss: function(ev) {
        AppActions.setLocalState({
            deviceToken : null
        });
    },

    render: function() {
        return cE(rB.Modal,{show: this.props.deviceToken,
                            onHide: this.doDismiss,
                            animation: false},
                  cE(rB.Modal.Header, {
                      className : "bg-primary text-primary",
                      closeButton: true},
                     cE(rB.Modal.Title, null, "Device Token")
                    ),
                  cE(rB.ModalBody, null,
                     cE('p', null, "Cut/paste to file '/config/token'" +
                        " in your device"
                       ),
                     cE(rB.Input, {
                         type:"textarea",
                         label: "token",
                         value:  this.props.deviceToken
                     })
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doDismiss}, "Continue")
                    )
                 );
    }
};

module.exports = React.createClass(ShowToken);
