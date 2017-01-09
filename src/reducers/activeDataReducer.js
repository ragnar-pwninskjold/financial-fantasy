function activeData(state = [], action) {

	switch(action.type) {
		case "RECEIVE_ACTIVE_DATA":
			const data = action.json;
			console.log("receive active data", data);
			return [data, ...state];
	}
	return state;
}

export default activeData;