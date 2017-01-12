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
				<h1>The total amount of remaining funds: {this.props.accountBalance[0].toString()}</h1>
				<h3>$$$$$</h3>
			</div>
		)
	}
}