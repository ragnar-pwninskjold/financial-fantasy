import React from 'react';
import SingleContestTable from './singleContestTable';
import TransactionsTable from './transactionsTable';
import SingleContestHistory from './singleContestHistory';
import Leaderboard from './leaderboard';



export default class SingleContestContainer extends React.Component {

	searchStock (e) {
		e.preventDefault();
		let searchTerm = this.refs.search.value;
		this.props.getData(searchTerm);
	
	}

	render() {
		if (this.props.receivedMessage[0] == 'ENTRY_CLOSED') {
			return (
				<div>
					<div className="main-left-right-container">
						<div className="contest-left">
	
						
							<SingleContestTable {...this.props} />
							{/*<SingleContestHistory {...this.props} />*/}
						</div>
						<div className="contest-right">
						<h1>This will be countdown to the contest beginning</h1>
						</div>
					</div>
				</div>
			)
		}
		else if (this.props.receivedMessage[0] == 'GOOD_TO_TRADE') {
			return (
				<div>
					<div className="main-left-right-container">
						<div className="contest-left">
							
						
							<SingleContestTable {...this.props} />
							{/*<SingleContestHistory {...this.props} />*/}
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
		else if (this.props.receivedMessage[0] == 'PENDING_NO_TRADES') {
			return (
				<div>
					<div className="main-left-right-container">
						<div className="contest-left">
							
						
							<SingleContestTable {...this.props} />
							{/*<SingleContestHistory {...this.props} />*/}
						</div>
						<div className="contest-right">
						<h1>This will be countdown timer to start of tradability when its pending but you can't trade yet</h1>
						</div>
					</div>
				</div>
			)
		}
		else if (this.props.receivedMessage[0] == 'CONTEST_CLOSED') {
			return (
				<div>
					<h1>End leaderboard for contest being over</h1>
				</div>
			)
		}
		else {
			return (
				<div>
					<div className="main-left-right-container">
						<div className="contest-left">
							
						
							<SingleContestTable {...this.props} />
							{/*<SingleContestHistory {...this.props} />*/}
						</div>
						<div className="contest-right">
						<Leaderboard></Leaderboard>
						</div>
					</div>
				</div>
			)
		}
	}
}