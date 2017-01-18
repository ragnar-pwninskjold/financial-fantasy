import React from 'react';
import SingleContestTable from './singleContestTable';
import TransactionsTable from './transactionsTable';
import SingleContestHistory from './singleContestHistory';
import Leaderboard from './leaderboard';



export default class SingleContestContainer extends React.Component {

	componentWillMount() {
		let contest = this.props.location.pathname.split('/')[2];
		this.props.getContestInfo(contest);

	}

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
						
						<h1>Contests begin at 9:30 AM, Monday - Friday</h1>
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
						<form className="form-table" onSubmit={this.searchStock.bind(this)}>
						<input className="searchYieldInput" type="text" name="search" placeholder="Search.." ref="search"></input>
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
						<h1>Sorry, you can't make trades here until the current trading day has ended</h1>
						</div>
					</div>
				</div>
			)
		}
		else if (this.props.receivedMessage[0] == 'CONTEST_CLOSED') {
			return (
				<div>
					<Leaderboard {...this.props}/>
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
						<Leaderboard {...this.props}/>
						</div>
					</div>
				</div>
			)
		}
	}
}