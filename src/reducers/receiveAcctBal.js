function receiveAcctBal(state = [], action) {

	switch(action.type) {
		case "RECEIVE_ACCT_BAL":
			const data = action.cash;
			return [data, ...state];
	}
	return state;
}

export default receiveAcctBal;