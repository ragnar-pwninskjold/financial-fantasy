function receiveCash(state = [], action) {

	switch(action.type) {
		case "RECEIVE_CASH":
			const data = action.cash;
			return [data, ...state];
	}
	return state;
}

export default receiveCash;