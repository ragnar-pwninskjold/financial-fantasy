import React from 'react';
import TransactionsTableRow from './transactionsTableRow';




export default class TransactionsTable extends React.Component {

	handleAlert(e) {
		alert("Sorry, no search results for that. Please try again");
	}

	render() {

		var answer = this.props.searchYield[0];
		console.log("answer",answer);

		if (answer == undefined) {
			return (

				<div>
					<table className="transactions-table">
						<tr>
							<th className="company-name-transaction"> </th>
							<th className="financials-transaction"> </th>
							<th className="buy-button-header"> </th>
						</tr>
						<tr>
						</tr>

					</table>
				</div>

			);
		}

		else if (answer.length == 0) {
			return (

				<div>
					<table className="transactions-table">
						<tr>
							<th className="company-name-transaction"> </th>
							<th className="financials-transaction"> </th>
							<th className="buy-button-header"> </th>
						</tr>
						<tr>
							Sorry, no valid search results for that. Try again
						</tr>

					</table>
				</div>

			);
		}
		else {

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
}