import React from 'react';
import Navbar from './navBar';
import HistoryRow from './historyRow';


export default class History extends React.Component {
	render() {
		return (
			<div className="active-contest-table-container">
				<Navbar />
				<table className="active-contest-table">
					<tr>
						<th className="history-contest-name">Contest name</th>
						<th className="position">Your position</th>
						<th className="active-contest-buy-in">Buy in</th>
						<th className="winnings">Winnings</th>
					</tr>
					{this.props.historyData.map((contest, i) => <HistoryRow {...this.props} key={i} i={i} />)}

				</table>
			</div>
		)
	}
}