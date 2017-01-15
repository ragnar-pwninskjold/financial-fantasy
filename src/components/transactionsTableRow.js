import React from 'react';


export default class SingleContestTable extends React.Component {


	handleBuy(e) {

		let contest = this.props.location.pathname.split('/')[2];
		let ticker = this.props.searchYield[0][this.props.i].ticker;
		let volume = prompt("How many shares?");
		this.props.buyStock(ticker, contest, volume);
		this.props.retrieveSingleContestPositions(contest);
	}

	

	render() {

		let searchYield = this.props.searchYield[0];
		console.log("this.props.searchYield[0]", searchYield);

		if (this.props.searchYield[0] != undefined) {
			return (
					<tr className="transaction-contest-table-row">
						<td className="rowdata-transaction">{this.props.searchYield[0][this.props.i].ticker}<br />{this.props.searchYield[0][this.props.i].name}</td>
						<td className="rowdata-transaction">{this.props.searchYield[0][this.props.i].price}<br />{/*this.props.searchYield[this.props.i].change*/}</td>
						<td><button className="buy-button-transaction" onClick={this.handleBuy.bind(this)}>Buy stock</button></td>
					</tr>
			)
		}
		else {
			return (
				<tr className="transaction-contest-table-row">
					<td className="rowdata-transaction"> <br />{this.props.searchYield[0][this.props.i].name}</td>
					<td className="rowdata-transaction"> <br />{/*this.props.searchYield[this.props.i].change*/}</td>
				</tr>
		)
		}

		
	}
}