import React from 'react';
import ContestTable from './contestTable';

export default class ContestContainer extends React.Component {
	render() {
		return (
			<div className="contest-container">
				<h1> This will be the giant container for contests </h1>
				<ContestTable {...this.props}/>
			</div>
		)
	}
}