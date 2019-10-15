import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'

import Common from '../Common/common'
import Mgr from '../Manager/mgr'
import Log from '../Log/log'
import Login from '../Login/login'

export default class MyRoute extends React.Component {
    render() {
        return (
            <Router history={createBrowserHistory()}>
                <Switch>
                    <Route exact path='/' component={Login}></Route>
                    <Common path='/Mgr' component={Mgr}></Common>
                    <Common path='/Log' component={Log}></Common>
                </Switch>
            </Router>
        );
    }
}