function testReducer2(state = [], action) {

	switch(action.type) {
		case "TEST2":
			const test = action.test;
			console.log(test);
			return [[test], ...state];
	}
	return state;
}

export default testReducer2;