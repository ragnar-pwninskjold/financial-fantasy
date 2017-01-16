function leaderboard(state = [], action) {

	switch(action.type) {
		case "LEADERBOARD":
			const test = action.test;
			return [[test], ...state];
	}
	return state;
}

export default leaderboard;