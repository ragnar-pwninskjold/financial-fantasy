import React from 'react';
import {Link} from 'react-router';

export default class PageNotFound extends React.Component {
	render() {
		return (
			<div className="notfound">
			<h1>404</h1>
			<h2>Page not found!</h2>
			<p>
				<Link to="/">Back to main page</Link>
			</p>
			</div>
		);
	}
}