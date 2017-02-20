import React from 'react';
import Navigation from './navBar';
import ContestContainer from './contestContainer';

export default class Home extends React.Component {
	render() {
		return (
			<div>
				<Navigation />
				<ContestContainer {...this.props} />
			</div>
		)
	}
}