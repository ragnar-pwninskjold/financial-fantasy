function closeEntry(state = [], action) {

	switch(action.type) {
		case "RECEIVE_CLOSE_ENTRY":
			const data = action.msg;
			return [data, ...state];
	}
	return state;
}

export default closeEntry;