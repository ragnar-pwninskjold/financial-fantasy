function receiveCash(state = [], action) {

	switch(action.type) {
		case "RECEIVE_CASH":
			const data = action.cash;
			console.log("receive cash data", data);
			return [data, ...state];
	}
	return state;
}

export default receiveCash;