function singleContestPositions(state = [], action) {

	switch(action.type) {
		case "RECEIVE_SINGLE_CONTEST_POSITIONS":
			const data = action.json;
			console.log("RECEIVE_SINGLE_CONTEST_POSITIONS reducer ----- action. data ------", data)
			return [data, ...state];
	}
	return state;
}

export default singleContestPositions;