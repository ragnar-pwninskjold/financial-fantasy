function historyData(state = [], action) {

	switch(action.type) {
		case "HISTORY_DATA":
			const test = action.test;
			console.log(test);
			return [[test], ...state];
	}
	return state;
}

export default historyData;