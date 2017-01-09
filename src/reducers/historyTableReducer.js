function historyTable(state = [], action) {

	switch(action.type) {
		case "HISTORY_TABLE":
			const test = action.test;
			console.log(test);
			return [[test], ...state];
	}
	return state;
}

export default historyTable;