function buyStock(state = [], action) {

	switch(action.type) {
		case "RECEIVE_PURCHASE":
			const data = action.message;
			return [data, ...state];
	}
	return state;
}

export default buyStock;