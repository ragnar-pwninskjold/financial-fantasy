import React from 'react';
import Navbar from './navBar';
import ContestContainer from './contestContainer';

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