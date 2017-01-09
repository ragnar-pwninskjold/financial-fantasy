function buyStock(state = [], action) {

	switch(action.type) {
		case "RECEIVE_PURCHASE":
			const data = action.message;
			console.log("receive active data", data);
			return [data, ...state];
	}
	return state;
}

export default buyStock;