import React from 'react';
import InstructionsModal from './explanationModal';

export default class Descriptor extends React.Component {

	handleClick(e) {

		let contest = this.props.location.pathname.split('/')[2];
		this.props.closeEntry(contest);
		window.location.reload(true);
	}

	componentWillMount() {
		this.props.getCashBalance(this.props.location.pathname.split('/')[2]);
		this.props.getContestInfo(this.props.location.pathname.split('/')[2]);
		console.log("this, descriptor", this);
	}


	render() {
		console.log()
		if (this.props.receivedMessage[0] == 'ACTIVE_CONTEST' || this.props.receivedMessage[0] == 'ENTRY_CLOSED' || this.props.receivedMessage[0] == 'PENDING_NO_TRADES') {
			return (
			<div className="descriptor">
				<h1>Contest: {this.props.contestInfo[0].title}</h1>
				<InstructionsModal />
				<h3>Buy-In: {this.props.contestInfo[0].buyIn}</h3>
				<h3>Prizes: {this.props.contestInfo[0].prizeTotals}</h3>
				<h2 className="cash-balance">Cash: {this.props.cash[0].toString()}</h2>

				<h3><br></br></h3>
				
				
			</div>
		)
		}
		else if (this.props.contestInfo[0] != undefined) {
			return (
			<div className="descriptor">
				<h1>Contest: {this.props.contestInfo[0].title}</h1>
				<InstructionsModal />
				<h3>Buy-In: {this.props.contestInfo[0].buyIn}</h3>
				<h3>Prizes: {this.props.contestInfo[0].prizeTotals}</h3>
				<h2 className="cash-balance">Cash: {this.props.cash[0].toString()}</h2>
				<button className="commit" onClick={this.handleClick.bind(this)}>Click to commit entry</button>
				
				
			</div>
		)
		}
		else {
		return (
			<div className="descriptor">
				<h1>  </h1>
				<h3>  </h3>
				<h3>  </h3>
				<h2 className="cash-balance">Cash: {this.props.cash[0].toString()}</h2>
				<button className="commit" onClick={this.handleClick.bind(this)}>Click to commit entry</button>
				
			</div>
		)
		}
	}
}