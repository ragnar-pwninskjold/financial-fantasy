import React from 'react';
import Navbar from './navBar';
import ContestContainer from './ContestContainer';

export default class Home extends React.Component {
	render() {
		return (
			<div>
				<Navbar />
				<ContestContainer {...this.props} />
			</div>
		)
	}
}