function receivedHistoryData(state = [], action) {

	switch(action.type) {
		case "RECEIVE_HISTORY_DATA":
			const test = action.history;
			return [[test], ...state];
	}
	return state;
}

export default receivedHistoryData;