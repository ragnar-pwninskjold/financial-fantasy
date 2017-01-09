import { createStore, compose, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

//get the rootReducer

import rootReducer from './reducers/rootReducer.js';

//import the data

import test1 from './data/testdata';
import contestTableTest from './data/contestTableData';
import activeData from './data/activeData';
import historyData from './data/historyData';
import historyTable from './data/historyTable';
import leaderboard from './data/leaderboardData';
import searchYield from './data/searchYieldData';
import singleContestPositions from './data/singleContestPositions';

const defaultState = {
	test1,
	contestTableTest,
	activeData,
	historyData,
	historyTable,
	leaderboard,
	searchYield,
	singleContestPositions
};

// const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {}



const store = createStore(rootReducer, defaultState, applyMiddleware(thunk));

store.subscribe(() => {
	store.getState();

});

// export const history = syncHistoryWithStore(browserHistory, store);


export default store;