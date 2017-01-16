function receiveMessages(state = [], action) {

	switch(action.type) {
		case "RECEIVE_MESSAGES":
			const data = action.msg;
			return [data, ...state];
	}
	return state;
}

export default receiveMessages;