import React from 'react';
import Navbar from './navBar';
import HistoryRow from './historyRow';


export default class History extends React.Component {
	//component will mount, make it receive new props 

	componentWillMount() {
		this.props.getHistory();
		console.log("this.props.history,", this.props.history);
	}

	render() {
	
		if (this.props.history.length > 0){
			return (
				<div className="active-contest-table-container">
					<Navbar />
					<h1 className="history-table-title">Your Past Contests</h1>
					<table className="active-contest-table">
						<tr>
							<th className="history-contest-name">Contest name</th>
							<th className="position">Your position</th>
							<th className="active-contest-buy-in">Buy in</th>
							<th className="winnings">Winnings</th>
						</tr>
						{Object.keys(this.props.history[0][0]).map((i) => <HistoryRow {...this.props} key={i} i={i} />)}

					</table>
				</div>
			)
		}
		else {
			return (
				<div className="active-contest-table-container">
					<Navbar />
					<h1 className="history-table-title">Your Past Contests</h1>
					<table className="active-contest-table">
						<tr>
							<th className="history-contest-name">Contest name</th>
							<th className="position">Your position</th>
							<th className="active-contest-buy-in">Buy in</th>
							<th className="winnings">Winnings</th>
						</tr>
					</table>
				</div>
			)
		}
	}
}