import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

export default class Navigation extends React.Component {
	render() {

		return (
  <Navbar inverse collapseOnSelect className="navigation">
    <Navbar.Header>
      <Navbar.Brand>
        <img className="logo" src="/css/dollar.png"></img>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1}><Link to="/">Home</Link></NavItem>
        <NavItem eventKey={2}><Link to="/active">Active</Link></NavItem>
        <NavItem eventKey={3}><Link to="/history">History</Link></NavItem>
        <NavItem eventKey={4}><Link to="/funds">Funds</Link></NavItem>
        <NavItem eventKey={5}><Link to="logout">Logout</Link></NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  )
}
}

// const Navbar = React.createClass({
// 	render() {
// 		return(
// 			<div className="navigation">
// 				<ul className="navbar">
// 				<li className="logo"><img src="/css/dollar.png"></img></li>
// 				<li><Link to="/">Home</Link></li>
// 				<li><Link to="/active">Active</Link></li>
// 				<li><Link to="/history">History</Link></li>
// 				<li><Link to="/funds">Funds</Link></li>
// 				<li><Link to="logout">Logout</Link></li>
// 				</ul>
// 			</div>
			
// 		)
// 	}
// });

// export default Navigation;