import React from 'react';
import {Route, IndexRoute, Router, hashHistory} from 'react-router';
import Index from './components/Index';
import PageNotFound from './components/PageNotFound';
import Test from './components/Test';
import App from './components/App';

//import other components to be made

//import the css

import { Provider } from 'react-redux';
import store, { history } from './store';


const routes = (
	<Provider store={store}>
		<Router history={hashHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Index}> </IndexRoute>
				<Route path="/test" component={Test}></Route>
				<Route path="*" component={PageNotFound}></Route>
			</Route>
		</Router>
	</Provider>

);

export default routes;