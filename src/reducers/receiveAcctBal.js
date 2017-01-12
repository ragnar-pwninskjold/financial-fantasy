function receiveAcctBal(state = [], action) {

	switch(action.type) {
		case "RECEIVE_ACCT_BAL":
			const data = action.cash;
			console.log("receive active data", data);
			return [data, ...state];
	}
	return state;
}

export default receiveAcctBal;