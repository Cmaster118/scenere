import React from "react";
import { Link, withRouter } from "react-router-dom";

class navigation extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
          
		  something: null,

        };
	}
	
	render() {
		return (
			<div className="navigation">
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="container">
						<Link className="navbar-brand" to="/">
							Unnamed Journaling Site
						</Link>
						
						<p className="text-light">
							Current User: {this.props.currentUser}
						</p>
						
						<button
							className="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarResponsive"
							aria-controls="navbarResponsive"
							aria-expanded="false"
							aria-label="Toggle navigation"
							>
							
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarResponsive">
							<ul className="navbar-nav ml-auto">
								<li
									className={`nav-item  ${
									this.props.location.pathname === "/" ? "active" : ""
									}`}
									>
									<Link className="nav-link" to="/">
										Landing
										<span className="sr-only">(current)</span>
									</Link>
								</li>
								
								<li
									className={`nav-item  ${
									this.props.location.pathname === "/signup" ? "active" : ""
									}`}
									>
									<Link className="nav-link" to="/signup">
										Sign Up
									</Link>
								</li>
								
								<li
									className={`nav-item  ${
									this.props.location.pathname === "/signin" ? "active" : ""
									}`}
									>
									<Link className="nav-link" to="/signin">
										Sign In
									</Link>
								</li>
								
								<li
									className={`nav-item  ${
									this.props.location.pathname === "/read" ? "active" : ""
									}`}
									>
									<Link className="nav-link" to="/read">
										JournalScan
									</Link>
								</li>
								
								<li
									className={`nav-item  ${
									this.props.location.pathname === "/write" ? "active" : ""
									}`}
									>
									<Link className="nav-link" to="/write">
										JournalWrite
									</Link>
								</li>
								
								<li
									className={`nav-item  ${
									this.props.location.pathname === "/company" ? "active" : ""
									}`}
									>
									<Link className="nav-link" to="/company">
										Company
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}

export default withRouter(navigation);