import React from 'react';
import TransactionsTableRow from './transactionsTableRow';




export default class TransactionsTable extends React.Component {

	render() {

		var answer = this.props.searchYield[0];
		console.log("answer",answer);


		return (
			<div>
				<table className="transactions-table">
					<tr>
						<th className="company-name-transaction"> </th>
						<th className="financials-transaction"> </th>
						<th className="buy-button-header"> </th>
					</tr>
					<tr>
						{Object.keys(this.props.searchYield[0]).map((i) => <TransactionsTableRow {...this.props} key={i} i={i} />)}
					</tr>

				</table>
			</div>
		)
	}
}