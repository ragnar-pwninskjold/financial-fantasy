import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as modalReducer} from 'react-redux-modal'


import test1 from './testreducer';
import contestTableTest from './contestTableTest';
import toggleReducer from './toggleReducer';
import activeData from './activeDataReducer';
import historyData from './historyDataReducer';
import historyTable from './historyTableReducer';
import leaderboard from './leaderboardReducer';
import searchYield from './searchYieldReducer';
import singleContestPositions from './singleContestPositionsReducer';
import { reducer as formReducer } from 'redux-form';  
import authReducer from './authenticationReducer';
import buyStock from './buyStockReducer';
import makeEntry from './entryReducer';
import closeEntry from './closeEntryReducer';
import receiveCash from './receiveCashReducer';
import receiveAcctBal from './receiveAcctBal';
import receiveEntryClose from './receiveEntryCloseReducer';
import receiveMessages from './receiveMessagesReducer';



//import the reducers here

//put the reducers into the combineReducers

const rootReducer = combineReducers({
	test1, 
	contestTableTest, 
	buyStock,
	modals: modalReducer, 
	toggleReducer,
	activeData,
	historyData,
	historyTable,
	leaderboard,
	searchYield,
	makeEntry,
	singleContestPositions,
	closeEntry,
	receiveCash,
	receiveAcctBal,
	receiveEntryClose,
	receiveMessages,
	auth: authReducer,
	form: formReducer, 
	routing: routerReducer
});

export default rootReducer;