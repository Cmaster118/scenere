import React from "react";
import { Link, withRouter } from "react-router-dom";

class navigation extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
          
		  something: null,

        };
	}

	triggerLogout = () => {
		this.props.clearLogin()
	}
	
	/*
	<li className={'nav-item'}  key='30'>
		<Link className="nav-link" to={basePath+"/test"}>
			!!TestDisplay 1!!
		</Link>
	</li>
	<li className={'nav-item'}  key='31'>
		<Link className="nav-link" to={basePath+"/test2"}>
			!!TestDisplay 2!!
		</Link>
	</li>*/
	
	render() {
		const basePath = this.props.basePath

		let iconButton = null
		let userDisplay = null

		if (this.props.currentUser === undefined) {
			iconButton = [
				(<li className={'nav-item'} key='0'>
					<Link className="nav-link" to={basePath+"/signup"}>
						Sign Up
					</Link>
				</li>),

				(<li className={'nav-item'}  key='1'>
					<Link className="nav-link" to={basePath+"/signin"}>
						Sign In
					</Link>
				</li>)
			]

			userDisplay = (
				<li className={'nav-item'}  key='2'>	
					<Link className="nav-link" to={basePath+"/menu"}>
						None
					</Link>
				</li>
			)
		}
		else {
			iconButton = (
				<li className={'nav-item'}  key='3'>
					<Link className="nav-link" to={basePath+"/"} onClick={this.triggerLogout}>
						Sign Out
					</Link>
				</li>
			)

			userDisplay = (
				<li className={'nav-item'}  key='4'>	
					<Link className="nav-link" to={basePath+"/menu"}>
						{this.props.currentUser}
					</Link>
				</li>
			)
		}

		return (
			<div className="navigation">
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="container">
						<Link className="navbar-brand" to={basePath+"/"}>
							Project Scenere
						</Link>
						
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
								<li className={'nav-link'}>	
									Current User: 
								</li>
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