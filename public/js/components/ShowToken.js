var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');

var ShowToken = {
    mixins: [rB.OverlayMixin],

    getInitialState : function() {
        return {
            isModalOpen: false
        };
    },

    handleToggle: function(props) {
        this.setState({
            isModalOpen: props.deviceToken
        });
    },

    componentWillReceiveProps: function(nextProps) {
        this.handleToggle(nextProps);
    },

    render: function() {
        return (cE('span',{}));
    },

    doDismiss: function(ev) {
        AppActions.setLocalState({
            deviceToken : null
        });
    },

  // This is called by the `OverlayMixin` when this component
  // is mounted or updated and the return value is appended to the body.
    renderOverlay: function() {
        if (this.props.deviceToken) {
            return cE(rB.Modal, React.__spread({},  this.props,
                                               {
                                                   bsStyle: "primary",
                                                   title: "Device Token",
                                                   animation: false
                                               }),
                      cE("div", {className: "modal-body"},
                         cE('p', null, "Cut/paste to file '/config/token'" +
                            " in your device"
                           ),
                         this.props.deviceToken
                        ),
                      cE("div", {className: "modal-footer"},
                         cE(rB.Button, {onClick: this.doDismiss}, "Continue")
                        )
                     );
        } else {
            return cE('span',{});
        }
    }
};

module.exports = React.createClass(ShowToken);
