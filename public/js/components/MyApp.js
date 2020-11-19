'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const AppStatus = require('./AppStatus');
const DisplayError = require('./DisplayError');
const ShowToken = require('./ShowToken');
const ShowDevice = require('./ShowDevice');
const UpdateDevice = require('./UpdateDevice');

const cE = React.createElement;

class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.ctx.store.getState();
    }

    componentDidMount() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.props.ctx.store
                .subscribe(this._onChange.bind(this));
            this._onChange();
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    _onChange() {
        if (this.unsubscribe) {
            this.setState(this.props.ctx.store.getState());
        }
    }

    render() {
        return cE('div', {className: 'container-fluid'},
                  cE(DisplayError, {
                      ctx: this.props.ctx,
                      error: this.state.error
                  }),
                  cE(ShowToken, {
                      ctx: this.props.ctx,
                      deviceToken: this.state.deviceToken
                  }),
                  cE(rB.Panel, null,
                     cE(rB.Panel.Heading, null,
                        cE(rB.Panel.Title, null,
                           cE(rB.Grid, {fluid: true},
                              cE(rB.Row, null,
                                 cE(rB.Col, {sm:1, xs:1},
                                    cE(AppStatus, {
                                        isClosed: this.state.isClosed
                                    })
                                   ),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:10,
                                     className: 'text-right'
                                 }, 'Manage your device'),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:11,
                                     className: 'text-right'
                                 }, this.state.fullName)
                                )
                             )
                          )
                       ),
                     cE(rB.Panel.Body, null,
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, 'Update device')
                             ),
                           cE(rB.Panel.Body, null,
                              cE(UpdateDevice, {
                                  ctx: this.props.ctx,

                              })
                             )
                          ),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, 'Current device state')
                             ),
                           cE(rB.Panel.Body, null,
                              cE(ShowDevice, {
                                  ctx: this.props.ctx,
                                  appName: this.state.appName,
                                  privileged: this.state.meta &&
                                      this.state.meta.privileged,
                                  status: this.state.status || '?',
                                  token: !!this.state.token,
                                  properties: this.state.meta &&
                                      this.state.meta.properties || ''
                              })
                             )
                          )
                       )
                    )
                 );
    }
};

module.exports = MyApp;
