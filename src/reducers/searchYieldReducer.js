function searchYield(state = [], action) {

	switch(action.type) {
		case "RECIEVE_SEARCH_RESULTS":
			const results = action.json;
			console.log("searchYield reducer results", results);
			return [results, ...state];
	}
	return state;
}

export default searchYield;