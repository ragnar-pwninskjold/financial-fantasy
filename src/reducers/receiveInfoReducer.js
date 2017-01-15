function receivedInfo(state = [], action) {

	switch(action.type) {
		case "RECEIVE_INFO":
			const data = action.json;
			console.log("receive info", data);
			return [data, ...state];
	}
	return state;
}

export default receivedInfo;