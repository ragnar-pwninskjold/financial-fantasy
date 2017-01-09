function toggleReducer(state = [{hidden: false}], action) {

	switch(action.type) {
		case "TOGGLE_DIV":

			console.log("logging state inside of toggleReducer");
			console.log(state);

			return [{
				hidden: !state.hidden
			}, ...state];
	}
	return state;
}

export default toggleReducer;