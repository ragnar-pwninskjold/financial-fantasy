function singleContestPositions(state = [], action) {

	switch(action.type) {
		case "RECEIVE_SINGLE_CONTEST_POSITIONS":
			const data = action.json;
			return [data, ...state];
	}
	return state;
}

export default singleContestPositions;