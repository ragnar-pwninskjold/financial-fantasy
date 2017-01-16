function receiveEntryClose(state = [], action) {

	switch(action.type) {
		case "RECEIVE_ACTIVE_DATA":
			const data = action.msg;
			return [data, ...state];
	}
	return state;
}

export default receiveEntryClose;