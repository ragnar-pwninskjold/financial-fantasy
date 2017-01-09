import React from 'react';
import Navbar from './navBar';


export default class Funds extends React.Component {
	render() {
		return (
			<div>
				<Navbar />
				<h1>The total amount of remaining funds:</h1>
				<h3>$$$$$</h3>
			</div>
		)
	}
}