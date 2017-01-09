function contestTableTest(state = [], action) {

	switch(action.type) {
		case "RECEIVE_CONTEST_DATA":
			const data = action.json;
			return [data, ...state];
	}
	return state;
}

export default contestTableTest;