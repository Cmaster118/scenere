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
				(<li className={'nav-item'} key='1'>
					<Link className="nav-link" to={basePath+"/signup"}>
						Sign Up
					</Link>
				</li>),

				(<li className={'nav-item'}  key='2'>
					<Link className="nav-link" to={basePath+"/signin"}>
						Sign In
					</Link>
				</li>)
			]

			userDisplay = (
				<li className={'nav-item'}  key='3'>	
					<Link className="nav-link" to={basePath+"/dashboard"}>
						None
					</Link>
				</li>
			)
		}
		else {
			iconButton = [
				(<li className={'nav-item'}  key='1'>	
					<Link className="nav-link" to={basePath+"/dashboard"}>
						Dashboard
					</Link>
				</li>),
			
				(<li className={'nav-item'}  key='2'>
					<Link className="nav-link" to={basePath+"/"} onClick={this.triggerLogout}>
						Sign Out
					</Link>
				</li>)
			]

			userDisplay = (
				<li className={'nav-item'}  key='5'>	
					<Link className="nav-link" to={basePath+"/dashboard"}>
						{this.props.currentUser}
					</Link>
				</li>
			)
		}
		
		/*
		<li className={'nav-item'}  key='10'>	
			<Link className="nav-link" to={basePath+"/contact"}>
				Contact Us Test
			</Link>
		</li>
		*/

		return (
			<div className="navigation">
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="container-fluid">
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
								<li className={'nav-item'}  key='1'>	
									<div className="nav-link">
										Current User:
									</div>
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