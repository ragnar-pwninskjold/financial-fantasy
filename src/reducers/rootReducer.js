import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import testReducer from './testreducer';
import testReducer2 from './testreducer2';

//import the reducers here

//put the reducers into the combineReducers

const rootReducer = combineReducers({testReducer, testReducer2, routing: routerReducer});

export default rootReducer;