import { createStore, compose, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { hashHistory } from 'react-router';
import thunk from 'redux-thunk';

//get the rootReducer

import rootReducer from './reducers/rootReducer.js';

//import the data

import test from './data/testdata';

const defaultState = {
	test
};

// const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {}

const store = createStore(rootReducer, defaultState, /*persistedState,*/ applyMiddleware(thunk));

store.subscribe(() => {
	store.getState();
});

console.log(store);

// export const history = syncHistoryWithStore(hashHistory, store);

export default store;