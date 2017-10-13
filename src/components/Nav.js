import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/nav.css";

const Nav = () => {
	return (
		<nav className="nav">
			<div className="nav-title">Validar Quickscan Central</div>
			<div className="nav-items">
				<NavLink to="/" exact activeClassName="nav-active">
					Summary
				</NavLink>
				<NavLink to="/data" activeClassName="nav-active">
					Data
				</NavLink>
				<NavLink to="/devices" activeClassName="nav-active">
					Devices
				</NavLink>
			</div>
		</nav>
	);
};

export default Nav;
