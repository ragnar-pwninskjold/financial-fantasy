import React from 'react';
import SingleContestHistoryRow from './singleContestHistoryRow';


export default class SingleContestHistory extends React.Component {
	render() {
		return (
			<div>
				<table className="single-contest-table">
					<tr>
						<th className="company-name">Company Name</th>
						<th className="transaction-type">Buy/Sell</th>
						<th className="transaction-size">Transaction Size</th>
						<th className="transaction-price">Transaction Price</th>
						<th className="transaction-value">Transaction Value</th>
					</tr>
					{this.props.historyTable.map((contest, i) => <SingleContestHistoryRow {...this.props} key={i} i={i} />)}

				</table>
			</div>
		)
	}
}