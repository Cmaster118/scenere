import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { SignIn, SignUp, Forgot, VerifyEmail } from "./components/authPages";
import { ContactUs } from "./components/landingPages";

import { Navigation, Footer } from "./components";
import { LandingPages, ContentCommonPages} from "./components";
//AuthPages

import { Sidebar } from "./utils";
import { APIRefreshToken } from "./utils";

import { timedLoadStorage, timedSaveStorage, deleteStorageKey, checkStorageContents} from "./utils";

//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './style.css'

// Is THIS a patch for Github Pages react stuff?
// Maybe...
// Ill have to test this...
const basePath = "/scenere"

const hostName = "https://cmaster.pythonanywhere.com"
//const hostName = "http://10.0.0.60:8000"

//const DEBUGMODE = false

class App extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
          
			currentUser: undefined,
			sessionToken: undefined,
			remember: false,
			
			refreshTokenStatus: 0,
        };
	}
	
	componentDidMount() {
		this.loadFromCookies();
		
		checkStorageContents()
	};
	
	// Menu Controls...
	disableMenu = () => {
		try {
			this.refs.sidebar.disableMenu()
		}
		catch {
			
		}
	}
	activateUserMenu = () => {
		try {
			this.refs.sidebar.activateMenu(0)
		}
		catch {
			
		}
	}
	activateCompanyMenu = () => {
		try {
			this.refs.sidebar.activateMenu(1)
		}
		catch {
			
		}
	}
	
	changeCompanyMenuItems = (nextState) => {
		try {
			this.refs.sidebar.setCompanyFlag(nextState)
		}
		catch {
			
		}
	}
	
	changeMenuUserName = (newName) => {
		try {
			this.refs.sidebar.setUserName(newName)
		}
		catch {
			
		}
	}
	changeMenuCompanyName = (newCompany) => {
		try {
			this.refs.sidebar.setCompanyName(newCompany)
		}
		catch {
			
		}
	}
	
	loadFromCookies = () => {
		let lastUserSet = timedLoadStorage('lastUser');
		if (lastUserSet === 0) {
			console.log("No User In the Storage!")
		}
		else if (lastUserSet === 1) {
			console.log("Session was expired!")
		}
		else if (lastUserSet === 2) {
			console.log("Invalid Save!")
		}
		else {
			this.changeMenuUserName(lastUserSet.user)
			
			this.setState({ 
				currentUser: lastUserSet.user, 
				sessionToken: lastUserSet.session,
				remember: true,
			}) 
		}
	}
	
	setToken = ( token, username, remember ) => {
		
		this.changeMenuUserName(username)
		
		if (remember === true) {
			timedSaveStorage( "lastUser", {user:username, session:token}, 0 )
		}
		
		// Verify this before we sent it in I guess?
		this.setState({ 
			sessionToken: token, 
			currentUser: username, 
			rememberMe: remember,
		})
		
		// Return if we succeeded or not
		return true
	}
	
	refreshFailure = () => {
		this.logout()
		this.setState({
			refreshTokenStatus: 3,
		})
	}
	refreshCallback = (incomingToken) => {
		this.setToken(incomingToken, this.state.currentUser, this.status.rememberMe)
		this.setState({
			refreshTokenStatus: 2,
		})
	}
	// Test out refreshing the token...
	// Should do this every page reload...
	refresh = () => {
		APIRefreshToken(this.state.sessionToken, this.refreshCallback, this.refreshFailure)
		
		this.setState({
			refreshTokenStatus: 1,
		})
	}

	// Should move this over to the UTIL...
	logout = () => {
		this.setState({ 
			sessionToken: undefined, 
			currentUser: undefined 
		})

		this.changeMenuUserName("No User")

		deleteStorageKey('lastUser')
	}
	
	render() {

		return (
			<Router>
				<div className="App">
					
					<Sidebar
						ref="sidebar"
						// Note to self, I hardcoded in here....
						// Until I have a better naming system...
						basePath={basePath}
					/>
					
					<Navigation 
						currentUser={this.state.currentUser}

						logout={this.logout}
						
						reRouteSignIn={basePath+"/signin"}
						reRouteSignUp={basePath+"/signup"}
						
						reRouteLanding={basePath+"/"}
						reRouteDashboard={basePath+"/dashboard"}
						
						reRouteUserInvites={basePath+"/dashboard/userMode/userInvite"}
						reRouteUserSecurity={basePath+"/dashboard/userMode/userSecurity"}
						reRouteUserPermissions={basePath+"/dashboard/userMode/userPermissions"}
					/>
					
					<Switch>
					
						{/*To catch ONLY the landing page, this one has to be exact...*/}
						{/*Unless I am also missing something*/}
						<Route path={basePath+"/"} exact component={() => <LandingPages 
								
							/>} 
						/>
						
						<Route path={basePath+"/signin"} exact component={() => <SignIn 
								
								loginSave={this.setToken}

								reRouteTarget={basePath+"/dashboard"}
								forgotPath={basePath+"/forgot"}
							/>}
						/>	
						<Route path={basePath+"/signup"} exact component={() => <SignUp 
								
								reRouteTarget={basePath+"/verify"}
								
								loginSave={this.setToken}
								
								//currentUser={this.state.currentUser}
								authToken={this.state.sessionToken}
							/>} 
						/>
						<Route path={basePath+"/verify"} exact component={() => <VerifyEmail 
								
								authToken={this.state.sessionToken}
								
								forceLogout={this.logout}
								reRouteTarget={basePath+"/signin"}
								
								reRouteSuccessTarget={basePath+"/dashboard"}
							/>} 
						/>
						<Route path={basePath+"/forgot"} exact component={() => <Forgot 
								reRouteTarget={basePath+"/signin"}
							/>} 
						/>
						
						<Route path={basePath+"/contact"} exact component={() => <ContactUs 
								
							/>} 
						/>
						
						<Route path={basePath+"/dashboard"} component={() => <ContentCommonPages 
								
								tokenRefresh={this.refresh}
								reRouteTarget={basePath+"/signin"}
								activateRedirect={basePath+"/verify"}
								
								logout={this.logout}
								
								currentUser={this.state.currentUser}
								authToken={this.state.sessionToken}
								
								reRouteCompany={basePath+"/dashboard"}
								reRouteUser={basePath+"/dashboard"}
								
								disableMenu={this.disableMenu}
								activateUserMenu={this.activateUserMenu}
								activateCompanyMenu={this.activateCompanyMenu}
								changeMenuCompanyName={this.changeMenuCompanyName}
								changeCompanyMenuItems={this.changeCompanyMenuItems}
							/>}
						/>

					</Switch>
					
					<div className="row m-5"/>

					<Footer 
					
					/>
				</div>
			</Router>
		);
	}
}

export default App;