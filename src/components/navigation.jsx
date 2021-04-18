import React from "react";
import { Link, withRouter } from "react-router-dom";

import {testSaveStorage, testLoadStorage, clearStorage, checkStorageContents} from "../utils";

class navigation extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
          
		  

        };
	}

	triggerLogout = () => {
		this.props.clearLogin()
	}
	
	saveToStorage = () => {
		const keyTest = "asdf"
		//const valueTest = ["derp","dorp","yaboi"]
		const valueTest = {"SecondKey":"asdf","thirdKey":"boop"}
		
		testSaveStorage(keyTest, valueTest)
	};
	
	getFromStorage = () => {
		const keyTest = "asdf"
		let dataTest = testLoadStorage(keyTest)		
		console.log(dataTest)
	};
	
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
					<Link className="nav-link" to={basePath+"/signin"}>
						None
					</Link>
				</li>
			)
		}
		else {
			iconButton = [
				(<li className={'nav-item'}  key='1'>	
					<Link className="nav-link" to={this.props.reRouteCompany}>
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
					{/*Go to specifically User Settings? Call a dropdown?*/}
					<Link className="nav-link" to={this.props.reRouteUser}>
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

		//fixed-top
		return (
			<div className="navigation">
			
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="container-fluid">
						<Link className="navbar-brand" to={basePath+"/"}>
							Project Scenere
						</Link>
						
						{/*
						<button onClick={this.saveToStorage}>
							Test Save
						</button>
						<button onClick={this.getFromStorage}>
							Test Load
						</button>
						<button onClick={clearStorage}>
							Clear
						</button>
						<button onClick={checkStorageContents}>
							Check Contents
						</button> */}
						
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