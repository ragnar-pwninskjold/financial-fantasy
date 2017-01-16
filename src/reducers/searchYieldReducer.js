function searchYield(state = [], action) {

	switch(action.type) {
		case "RECIEVE_SEARCH_RESULTS":
			const results = action.json;
			return [results, ...state];
	}
	return state;
}

export default searchYield;