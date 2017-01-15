import React from 'react';
import Navbar from './navBar';


export default class Funds extends React.Component {
	componentWillMount() {
		this.props.getAccountBalance();
	}

	render() {
		return (
			<div>
				<Navbar />
				<h1 className="funds-title">FUNDS: </h1>
				<h3 className="funds-amount">${this.props.accountBalance[0].toString()}</h3>
			</div>
		)
	}
}