function test1(state = [], action) {

	switch(action.type) {
		case "TEST":
			const test = action.test;
			return [[test], ...state];
	}
	return state;
}

export default test1;