function activeData(state = [], action) {

	switch(action.type) {
		case "RECEIVE_ACTIVE_DATA":
			const data = action.json;
			return [data, ...state];
	}
	return state;
}

export default activeData;