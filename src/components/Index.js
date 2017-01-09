import React, {Component} from 'react';
import {modal} from 'react-redux-modal';
import CreateContestModal from './testModal';
import ShowHide from './showHideDiv';

export default class Index extends React.Component {
	render() {
		return (
			<div className="index">
			<h1>This will be the login page</h1>
			<h2> Going to set this up later to avoid logging in after each change </h2>
			<CreateContestModal />
			<ShowHide {...this.props}/>
			</div>
		)
	}
}
