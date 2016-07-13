var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');

var PropertyEditor = {

    /*
     * devicePropertyEditor type:
     * {key: string, value : string, properties: Object.<string>}
     *
     */
    doDismiss: function(ev) {
        AppActions.setLocalState({
            devicePropertyEditor : null
        });
    },

    doUpdate: function(ev) {
        var editor = this.props.devicePropertyEditor;
        var properties = JSON.stringify((editor && editor.properties) || {});
        AppActions.setLocalState({
            tempProperties : properties
        });
        this.doDismiss();
    },

    handlePropertyKey: function(ev) {
        var editor = this.props.devicePropertyEditor || {};
        var key = this.refs.propKey.getValue();
        if (key) {
            editor.key = key;
            AppActions.setLocalState({
                 devicePropertyEditor: editor
            });
        } else {
            var errMsg = 'Missing key';
            console.log(errMsg);
            AppActions.setError(new Error(errMsg));
        }
    },

    handlePropertyValue: function(ev) {
        var editor = this.props.devicePropertyEditor || {};
        var value = this.refs.propValue.getValue();
        if (value) {
            editor.value = value;
            AppActions.setLocalState({
                 devicePropertyEditor: editor
            });
        } else {
            var errMsg = 'Missing value';
            console.log(errMsg);
            AppActions.setError(new Error(errMsg));
        }
    },

    doAddProperty: function() {
        var editor = this.props.devicePropertyEditor || {};
        if (editor.key && editor.value) {
            var properties = editor.properties || {};
            properties[editor.key] = editor.value;
            AppActions.setLocalState({
                devicePropertyEditor: {
                    key: editor.key,
                    value: editor.value,
                    properties: properties
                }
            });
        } else {
            var errMsg = 'Missing arguments';
            console.log(errMsg);
            AppActions.setError(new Error(errMsg));
        }
    },

    doDeleteProperty: function() {
        var editor = this.props.devicePropertyEditor || {};
        if (editor.key) {
            var properties = editor.properties || {};
            delete properties[editor.key];
            AppActions.setLocalState({
                devicePropertyEditor: {
                    key: editor.key,
                    value: editor.value,
                    properties: properties
                }
            });
        } else {
            var errMsg = 'Missing key';
            console.log(errMsg);
            AppActions.setError(new Error(errMsg));
        }
    },

    render: function() {
        var editor = this.props.devicePropertyEditor;
        var properties = JSON.stringify((editor && editor.properties) || {});
        return cE(rB.Modal,{show: editor,
                            onHide: this.doDismiss,
                            animation: false},
                  cE(rB.Modal.Header, {
                      className : "bg-primary text-primary",
                      closeButton: true},
                     cE(rB.Modal.Title, null, "Device Properties Editor")
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Row, null,
                        cE(rB.Col, {sm:3, xs: 12},
                           cE(rB.Input, {
                               type: 'text',
                               ref: 'propKey',
                               value: editor && editor.key,
                               onChange: this.handlePropertyKey,
                               placeholder: 'Key'
                           })
                          ),
                        cE(rB.Col, {sm:3, xs: 12},
                           cE(rB.Input, {
                               type: 'text',
                               ref: 'propValue',
                               value:  editor && editor.value,
                               onChange: this.handlePropertyValue,
                               placeholder: 'Value'
                           })
                          ),
                        cE(rB.Col, {sm:3, xs:6},
                           cE(rB.Button, {onClick: this.doAddProperty,
                                          bsStyle: 'primary'}, "Add"),
                           cE(rB.Button, {onClick: this.doDeleteProperty,
                                          bsStyle: 'danger'}, "Delete")
                          )
                       ),
                     cE(rB.Row, null,
                        cE(rB.Col, {sm:12, xs: 12},
                           cE(rB.Input, {
                               type:"textarea",
                               label: "Properties",
                               readOnly: 'true',
                               value:  properties
                           })
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doUpdate}, "Update"),
                     cE(rB.Button, {onClick: this.doDismiss}, "Cancel")
                    )
                 );
    }
};

module.exports = React.createClass(PropertyEditor);
