//import libraries for the API calls to backend
import axios from 'axios';  
import { browserHistory } from 'react-router';  
import cookie from 'react-cookie';  

const CLIENT_ROOT_URL = '';
const API_URL = '/api';
// const CLIENT_ROOT_URL = 'http://localhost:7770';
// const API_URL = 'http://localhost:7770/api';

export const AUTH_USER = 'auth_user';  
export const UNAUTH_USER = 'unauth_user';
export const AUTH_ERROR = 'auth_error';
export const PROTECTED_TEST = 'protected_test'; 



export function getData(query){
	return dispatch => {
			dispatch(getSearchResults(query));

      axios.get("/api/getStockInfo/"+query)
			.then(response=> {return response.data})
			.then(json=>dispatch(recieveSearchResults(query, json)))
		}
}

export function getContestMessages(contest){
  return dispatch => {
      dispatch(getMessages());

      axios.get("/api/getMessages/"+contest)
      .then(response=> {return response.data})
      .then(json=>dispatch(receiveMessages(json)))
    }
}

export function getCashBalance(contest){
  return dispatch => {
      dispatch(getCash());

      axios.get("/api/getcash/"+contest)
      .then(response=> {return response.data})
      .then(cash=>dispatch(receiveCash(cash)))
    }
}

export function deleteRow(id, value, contest){
  return dispatch => {
      dispatch(deleteEntry());

      axios.put("/api/position/delete/"+id, {value, contest})
      .then(response=> {return response.data})
      .then(msg=>dispatch(receiveDeleteEntry(msg)))
    }
}

export function getAccountBalance(){
  return dispatch => {
      dispatch(getAcctBal());

      axios.get("/api/accountbalance")
      .then(response=> {return response.data})
      .then(cash=>dispatch(receiveAcctBal(cash)))
    }
}

export function getContests(){
  return dispatch => {
      dispatch(getContestTable());

      axios.get("/api/getContestList")
      .then(response=> {return response.data})
      .then(json=>dispatch(receiveContestTable(json)))
    }
}

export function getHistory(){
  return dispatch => {
      dispatch(getHistoryData());

      axios.get("/api/gethistory")
      .then(response=> {return response.data})
      .then(history=>dispatch(receiveHistoryData(history)))
    }
}

export function getActiveContests(){
  return dispatch => {
      dispatch(getActiveData());

      axios.get("/api/contests/active")
      .then(response=> {return response.data})
      .then(json=>dispatch(receiveActiveData(json)))
    }
}

export function getContestInfo(contest){
  return dispatch => {
      dispatch(getInfo());

      axios.get("/api/getinfo/"+contest)
      .then(response=> {return response.data})
      .then(json=>dispatch(receiveInfo(json)))
    }
}

export function buyStock(stock, contest, volume){
  return dispatch => {
      dispatch(postPurchase());

      axios.post("/api/contests/"+contest+"/buy/"+stock, {
        volume
      })
      .then(response=> {return response.data})
      .then(json=>dispatch(receivePurchase(json)))
    }
}

export function enterContest(contest, status){
  return dispatch => {
      dispatch(postEntry());

      axios.post("/api/entry/"+contest, {status})
      .then(response=> {return response.data})
      .then(msg=>dispatch(receiveEntry(msg)))
    }
}

export function closeEntry(contest){
  return dispatch => {
      dispatch(postCloseEntry());

      axios.post("/api/entry/close/"+contest)
      .then(response=> {return response.data})
      .then(msg=>dispatch(receiveCloseEntry(msg)))
    }
}

export function retrieveSingleContestPositions(contest){
  return dispatch => {
      dispatch(getSingleContestPositions());

      axios.get("/api/contests/"+contest+"/positions")
      .then(response=> {return response.data})
      .then(json=>dispatch(receiveSingleContestPositions(json)))
    }
}


export function errorHandler(dispatch, error, type) {  

  let errorMessage = (error.data.error) ? error.data.error : error.data;
  console.log(errorMessage);

  if(error.status === 401) {
    dispatch({
      type: type,
      payload: 'You are not authorized to do this. Please login and try again.'
    });
    logoutUser();
  } else {
    dispatch({
      type: type,
      payload: errorMessage
    });
  }
}

export function loginUser({ email, password }) {  
  return function(dispatch) {
    axios.post(`${API_URL}/auth/login`, { email, password })
    .then(response => {
      console.log(response);
      cookie.save('token', response.data.token, { path: '/' });
      dispatch({ type: AUTH_USER });
      window.location.href = CLIENT_ROOT_URL + '/';
    })
    .catch((error) => {
    	console.log("error", error);
    	console.log("dispatch", dispatch);
    	console.log("error.response", error.response);
    	console.log("AUTH_ERROR", AUTH_ERROR);
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
    }
  }

export function registerUser({ email, password, username }) {  
  return function(dispatch) {
    axios.post(`${API_URL}/auth/register`, { email, password, username })
    .then(response => {
      console.log(response);
      cookie.save('token', response.data.token, { path: '/' });
      dispatch({ type: AUTH_USER });
      window.location.href = CLIENT_ROOT_URL + '/';
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
  }
}

export function logoutUser() {  
  return function (dispatch) {
    dispatch({ type: UNAUTH_USER });
    cookie.remove('token', { path: '/' });

    window.location.href = CLIENT_ROOT_URL + '/login';
  }
}

export function protectedTest() {  
  return function(dispatch) {
    axios.get(`${API_URL}/protected`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
    	console.log(response);
      dispatch({
        type: PROTECTED_TEST,
        payload: response.data.content
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
  }
}












export function testAction(test) {
	return {
		type: 'TEST',
		test
	}
}

export function getActiveData() {
	return {
		type: 'ACTIVE_DATA'
	}
}

export function receiveActiveData(json) {
  return {
    type: 'RECEIVE_ACTIVE_DATA',
    json
  }
}

export function getCash() {
  return {
    type: 'GET_CASH'
  }
}

export function receiveCash(cash) {
  return {
    type: 'RECEIVE_CASH',
    cash
  }
}

export function getMessages() {
  return {
    type: 'GET_MESSAGES'
  }
}

export function receiveMessages(msg) {
  return {
    type: 'RECEIVE_MESSAGES',
    msg
  }
}

export function deleteEntry() {
  return {
    type: 'DELETE_ENTRY'
  }
}

export function receiveDeleteEntry(msg) {
  return {
    type: 'RECEIVE_DELETE_ENTRY',
    msg
  }
}

export function getAcctBal() {
  return {
    type: 'GET_ACCT_BAL'
  }
}

export function receiveAcctBal(cash) {
  return {
    type: 'RECEIVE_ACCT_BAL',
    cash
  }
}

export function postPurchase() {
  return {
    type: 'POST_PURCHASE'
  }
}

export function receivePurchase(message) {
  return {
    type: 'RECEIVE_PURCHASE',
    message
  }
}

export function postEntry() {
  return {
    type: 'POST_ENTRY'
  }
}

export function receiveEntry(msg) {
  return {
    type: 'RECEIVE_ENTRY',
    msg
  }
}


export function postCloseEntry() {
  return {
    type: 'POST_CLOSE_ENTRY'
  }
}

export function receiveCloseEntry(msg) {
  return {
    type: 'RECEIVE_CLOSE_ENTRY',
    msg
  }
}


export function getContestTable() {
	return {
		type: "CONTEST_DATA"
	}
}

export function receiveContestTable(json) {
  return {
    type: "RECEIVE_CONTEST_DATA",
    json
  }
}

export function getHistoryData() {
	return {
		type: "GET_HISTORY_DATA"
	}
}

export function receiveHistoryData(history) {
  return {
    type: "RECEIVE_HISTORY_DATA",
    history
  }
}

export function getHistoryTable() {
	return {
		type: "HISTORY_TABLE"
	}
}

export function getLeaderboard() {
	return {
		type: "LEADERBOARD"
	}
}

export function getSearchResults(query) {
	return {
		type: "SEARCH_RESULTS",
    query
	}
}

export function recieveSearchResults(query, json) {
  return {
    type: "RECIEVE_SEARCH_RESULTS",
    query,
    json
  }
}

export function getSingleContestPositions() {
	return {
		type: "SINGLE_CONTEST_POSITIONS"
	}
}

export function receiveSingleContestPositions(json) {
  return {
    type: "RECEIVE_SINGLE_CONTEST_POSITIONS",
    json
  }
}

export function getInfo() {
  return {
    type: "GET_INFO"
  }
}

export function receiveInfo(json) {
  return {
    type: "RECEIVE_INFO",
    json
  }
}
