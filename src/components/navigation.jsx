import React from "react";
import { Link, withRouter } from "react-router-dom";
const debugPageName = "NavBar"

class navigation extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
        };
	}
	
	triggerLogout = () => {
		this.props.debugSet(debugPageName, "Manual Logout", "Triggered")
		this.props.logout()
		this.props.history.push(this.props.reRouteSignIn)
	}
	
	render() {
		let iconButton = null
		let userDisplay = null

		if (this.props.currentUser === undefined) {
			iconButton = [
				(<li className={'nav-item'} key='1'>
					<Link className="nav-link" to={this.props.reRouteSignUp}>
						Sign Up
					</Link>
				</li>),

				(<li className={'nav-item'}  key='2'>
					<Link className="nav-link" to={this.props.reRouteSignIn}>
						Sign In
					</Link>
				</li>)
			]

			/*
			userDisplay = (
				<li className={'nav-item'}  key='3'>	
					<Link className="nav-link" to={this.props.reRouteSignIn}>
						None
					</Link>
				</li>
			)
			*/
		}
		else {
			iconButton = [
				(<li className={'nav-item'}  key='1'>	
					<Link className="nav-link" to={this.props.reRouteDashboard}>
						Dashboard
					</Link>
				</li>)
			]

			userDisplay = (
				<div className='dropdown'  key='5'>
					<div className="nav-link" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{this.props.currentUser}
					</div>
					<div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
						<Link className="dropdown-item" to={this.props.reRouteUserInvites}>
							Invites
						</Link>
						<Link className="dropdown-item" to={this.props.reRouteUserSecurity}>
							Security
						</Link>
						<Link className="dropdown-item" to={this.props.reRouteUserPermissions}>
							Permissions
						</Link>
						<Link className="dropdown-item" to={this.props.reRouteLanding} onClick={this.triggerLogout}>
							Sign Out
						</Link>
					</div>
				</div>
			)
		}

		//fixed-top
		return (
			<div className="navigation">
			
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="container-fluid">
						<Link className="navbar-brand" to={this.props.reRouteLanding}>
							Project Scenere
						</Link>
						
						{/*
						<button onClick={this.saveToStorage}>
							Test Save
						</button>
						<button onClick={this.getFromStorage}>
							Test Load
						</button>
						<button onClick={this.clearTheStorage}>
							Clear
						</button>
						<button onClick={this.checkTheStorage}>
							Check Contents
						</button> 
						*/}
						
						<div className="dropdown">
							
						</div>
						
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
								{iconButton}
								{userDisplay}
							</ul>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}

export default withRouter(navigation);