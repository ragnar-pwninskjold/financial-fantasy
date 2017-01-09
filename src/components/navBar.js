import React from 'react';
import { Link } from 'react-router';



const Navbar = React.createClass({
	render() {
		return(
			<div className="navigation">
				<ul className="navbar">
				<li>This should be a cool logo</li>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/active">Active</Link></li>
				<li><Link to="/history">History</Link></li>
				<li><button><Link to="/funds">View Funds</Link></button></li>
				<li><Link to="logout">Logout</Link></li>
				</ul>
			</div>
			
		)
	}
});

export default Navbar;