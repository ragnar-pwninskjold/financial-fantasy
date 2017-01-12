import React from 'react';
import { Link } from 'react-router';
import NavBar from './navBar';
import Descriptor from './descriptor';
import SingleContestContainer from './singlecontestcontainer';

export default class SingleContest extends React.Component {
	componentWillMount() {
		let contest = this.props.location.pathname.split('/')[2];
		this.props.getContestMessages(contest);
	}

	render() {
		return (
			<div>
				<NavBar />
				<h3>This will be the individual contest after clicking enter button</h3>
				<h3>It will change routes based on contest i.d.</h3>
				<Descriptor {...this.props} />
				<SingleContestContainer {...this.props} />
			</div>
		)
	}
}