import React from 'react';

export default class Descriptor extends React.Component {
	render() {
		return (
			<div className="descriptor">
				<h1>Contest name goes here</h1>
				<h3>$x buy in</h3>
				<h3>$x in prizes</h3>
				<button className="commit">Click to commit entry</button>
			</div>
		)
	}
}