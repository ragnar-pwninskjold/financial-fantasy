import React from 'react';
import SingleContestTable from './singleContestTable';
import TransactionsTable from './transactionsTable';
import SingleContestHistory from './singleContestHistory';



export default class SingleContestContainer extends React.Component {

	searchStock (e) {
		e.preventDefault();
		let searchTerm = this.refs.search.value;
		this.props.getData(searchTerm);
	
	}

	render() {
		return (
			<div>
				<div className="main-left-right-container">
					<div className="contest-left">
						<div className="sorters">
							<button className="stocks">Stocks</button>
							<button className="history">History</button>
							<button className="leader-board">Leaderboard</button>
						</div>
					
						<SingleContestTable {...this.props} />
						<SingleContestHistory {...this.props} />
					</div>
					<div className="contest-right">
					<form onSubmit={this.searchStock.bind(this)}>
					<input type="text" name="search" placeholder="Search.." ref="search"></input>
					</form>
					<TransactionsTable {...this.props} />
					</div>
				</div>
			</div>
		)
	}
}