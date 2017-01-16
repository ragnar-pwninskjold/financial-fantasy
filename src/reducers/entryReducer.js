function makeEntry(state = [], action) {

	switch(action.type) {
		case "RECEIVE_ENTRY":
			const data = action.message;
			return [data, ...state];
	}
	return state;
}

export default makeEntry;