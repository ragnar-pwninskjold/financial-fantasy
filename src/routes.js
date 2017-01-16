import React from 'react';
import {Route, IndexRoute, Router, browserHistory} from 'react-router';
import Index from './components/Index';
import PageNotFound from './components/PageNotFound';
import App from './components/App';
import { render } from 'react-dom';
import Main from './components/Main';
import SingleContest from './components/singleContest';
import History from './components/historySort';
import ActiveContests from './components/activeContests';
import Funds from './components/funds';
import Login from './components/Login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import ReduxModal from 'react-redux-modal';
import RequireAuth from './components/auth/authentication';
import {AUTH_USER} from './actions/actioncreators';


//import other components to be made


import { Provider } from 'react-redux';
import store, { history } from './store';
import cookie from 'react-cookie';  
import Logout from './components/auth/logout';

const token = cookie.load('token');

if (token) {  
  store.dispatch({ type: AUTH_USER });
}


const routes = (
	<Provider store={store}>
		<div>
			<Router history={browserHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={RequireAuth(Home)}></IndexRoute>
					<Route path="/register" component={Register} />
					<Route path="/login" component={Login} />
					<Route path="/logout" component={Logout} />
					<Route path="/contest/:contestid" component={RequireAuth(SingleContest)}></Route>
					<Route path="/history" component={RequireAuth(History)}></Route>
					<Route path="/active" component={RequireAuth(ActiveContests)}></Route>
					<Route path="/funds" component={RequireAuth(Funds)}></Route>
					<Route path="*" component={PageNotFound}></Route>
					<Route path="/dashboard" component={RequireAuth(Dashboard)}></Route>
				</Route>
			</Router>
			<ReduxModal />
		</div>
	</Provider>

);

if (typeof window !== 'undefined') {
render(routes, document.getElementById('root'));
}

// export default routes;