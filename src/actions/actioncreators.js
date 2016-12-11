//import libraries for the API calls to backend

//make functions for requesting and receiving data

//request should return type and query for api

//receive should have type, query, and json

/*

export function whatever(query){
	return dispatch => {
			dispatch(requestData(query));
			fetchJsonp('the api url.json')
			.then(response=> {return response.json()})
			.then(json=>dispatch(receiveData(query, json)))
		}
}
*/

const test = "test val";
const test2 = "test val 2";

export function testAction() {
	return {
		type: 'TEST',
		test
	}
}

export function testAction2() {
	return {
		type: 'TEST2',
		test2
	}
}