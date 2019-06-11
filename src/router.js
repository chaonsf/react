import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from './app'
import Detail from './detail'
import Chart from "./chart"


const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route exact path="/detail" component={Detail}/>
            <Route exact path="/chart" component={Chart}/>
        </Switch>
    </HashRouter>
);
export default BasicRoute