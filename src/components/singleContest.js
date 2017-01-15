import React from 'react';
import { Link } from 'react-router';
import NavBar from './navBar';
import Descriptor from './descriptor';
import SingleContestContainer from './singlecontestcontainer';
import NoFunds from './nofunds'

export default class SingleContest extends React.Component {
	componentWillMount() {
		let contest = this.props.location.pathname.split('/')[2];
		this.props.getContestMessages(contest);
	}

	render() {
		if (this.props.boughtStock[0] == "NOT_ENOUGH_FUNDS") {
			return (
				<div>
					<NavBar />
					<Descriptor {...this.props} />
					<NoFunds />
					<SingleContestContainer {...this.props} />
				</div>
			)
		}
		else {
			return (
				<div>
					<NavBar />
					<Descriptor {...this.props} />
					<SingleContestContainer {...this.props} />
				</div>
			)
		}
	}
}