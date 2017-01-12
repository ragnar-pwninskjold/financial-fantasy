import React from 'react';

export default class Descriptor extends React.Component {

	handleClick(e) {

		let contest = this.props.location.pathname.split('/')[2];
		this.props.closeEntry(contest);
	}

	componentWillMount() {
		this.props.getCashBalance(this.props.location.pathname.split('/')[2]);
	}

	render() {
		return (
			<div className="descriptor">
				<h1>Contest name goes here</h1>
				<h3>$x buy in</h3>
				<h3>$x in prizes</h3>
				<button className="commit" onClick={this.handleClick.bind(this)}>Click to commit entry</button>
				<h2 className="cash-balance">Cash: {this.props.cash[0].toString()}</h2>
			</div>
		)
	}
}