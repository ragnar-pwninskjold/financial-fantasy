function toggleReducer(state = [{hidden: false}], action) {

	switch(action.type) {
		case "TOGGLE_DIV":


			return [{
				hidden: !state.hidden
			}, ...state];
	}
	return state;
}

export default toggleReducer;