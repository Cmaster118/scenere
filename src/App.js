import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { SignIn, SignUp, Forgot, VerifyEmail } from "./components/authPages";
import { ContactUs } from "./components/landingPages";

import { Navigation, Footer } from "./components";
import { LandingPages, ContentCommonPages} from "./components";
//AuthPages

import { Sidebar } from "./utils";
import { APIRefreshToken } from "./utils";
import { setAccessToken, setRefreshToken } from "./utils";
//showTokens

//checkStorageContents
import { timedLoadStorage, timedSaveStorage, deleteStorageKey} from "./utils";

//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './style.css'

// Is THIS a patch for Github Pages react stuff?
// Maybe...
// Ill have to test this...
const basePath = "/scenere"

// #Minutes -> seconds -> miliseconds
const waitTimeMS = 12 * 60 * 1000

//const DEBUGMODE = false
let nonUpdateRefreshingToken = false

class App extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
          
			currentUser: undefined,
			rememberMe: false,
			
			refreshTimer: undefined,
        };
		this.timerSet = undefined;
	}
	
	componentDidMount() {
		this.loadFromLocalStorage();
	};
	
	componentWillUnmount() {

	}
	
	timedRefresh = () => {
		console.log('Token Refreshed!');
	}
	
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
	
	// I am still going to use the local and session storage until I have a grasp on cookies
	loadFromLocalStorage = () => {
		let lastUserSet = timedLoadStorage('lastUser');

		if (lastUserSet === 0) {
			//console.log("No User In the Storage!")
		}
		else if (lastUserSet === 1) {
			//console.log("Session was expired!")
		}
		else if (lastUserSet === 2) {
			//console.log("Invalid Save!")
		}
		else {
			this.changeMenuUserName(lastUserSet.user)
			
			this.login(lastUserSet.refresh, undefined, lastUserSet.user, true)
		}
	}
	
	silentTokenUpdate = (refresh, token) => {
		setAccessToken(token)
		setRefreshToken(refresh)
	}
	
	killAccessToken = () => {
		setAccessToken("")
	}
	killRefreshToken = () => {
		setRefreshToken("")
	}
	
	login = ( refresh, token, username, remember ) => {
		
		this.changeMenuUserName(username)
		
		// I am having trouble with cookies, so lets do the rest of the refresh infrastructure while I cool off...
		// I will just have to replace all references to the REFRSH token to a cookie, but right now we will use the local storage...
		if (remember === true) {
			timedSaveStorage( "lastUser", {user:username, refresh:refresh}, 2)
		}
		
		this.silentTokenUpdate(refresh, token)
		
		// Verify this before we sent it in I guess?
		this.setState({ 
			currentUser: username, 
			rememberMe: remember,
		})
		
		this.timerSet = setInterval(this.timedRefreshToken, waitTimeMS)
		
		// Return if we succeeded or not
		return true
	}
	
	refreshFailure = (incomingError, callbackSignal) => {
		// Not sure why I would want a callback Signal here but...
		//console.log(incomingError)
		//console.log("Refresh Failure")
		//console.log(callbackSignal)
		
		this.logout()
		nonUpdateRefreshingToken = false
	}
	refreshCallback = (incomingToken, callbackSignal) => {
		
		//console.log("Successful refresh")
		//console.log(callbackSignal)
		
		this.silentTokenUpdate(incomingToken.refresh, incomingToken.access)
		nonUpdateRefreshingToken = false

		// Now, trigger this function as our redo... Hm
		callbackSignal()
	}
	// Test out refreshing the token...
	// Should do this every page reload...
	silentRefreshToken = ( callbackWhenDone ) => {
		// Definetly going to have to change this crap up once the refresh token is in a cookie
		APIRefreshToken(this.refreshCallback, this.refreshFailure, callbackWhenDone)
	}
	
	timedRefreshToken = () => {
		this.silentRefreshToken(this.timedRefresh)
	}

	// Should move this over to the UTIL...
	logout = () => {

		this.setState({
			currentUser: undefined 
		})
		
		clearInterval(this.timerSet)
		this.changeMenuUserName("No User")
		this.silentTokenUpdate(undefined, undefined)
		deleteStorageKey('lastUser')
	}
	
	triggerSilentRefreshToken = ( callbackRefresh ) => {
		console.log("Triggered this thing")
		//console.log( callbackRefresh )
		
		if (this.state.currentUser === undefined) {
			//  Something is unauthorized, and we have no user! We need to logout!
			//this.logout()
		}
		else {
			if (!nonUpdateRefreshingToken) {
				this.silentRefreshToken( callbackRefresh )
				
				console.log("TRIGGERD REFRESH OF TOKEN FROM A COMPONENT!")
				nonUpdateRefreshingToken = true
				
				// Now, we have to trigger a redo of the stuff once its done...
			}
			else {
				//console.log("Already refreshing token!")
			}
		}
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
					
					{/*
					<button onClick={this.killAccessToken}>
						Kill Access Token
					</button>
					<button onClick={this.killRefreshToken}>
						Kill Refresh Token
					</button>
					*/}
					
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
								
								loginSave={this.login}

								reRouteTarget={basePath+"/dashboard"}
								forgotPath={basePath+"/forgot"}
							/>}
						/>	
						<Route path={basePath+"/signup"} exact component={() => <SignUp 
								
								reRouteTarget={basePath+"/verify"}
								
								loginSave={this.login}
								
								//currentUser={this.state.currentUser}
								authToken={this.state.accessToken}
							/>} 
						/>
						<Route path={basePath+"/verify"} exact component={() => <VerifyEmail 
								
								authToken={this.state.accessToken}
								
								refreshToken={this.triggerSilentRefreshToken}
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
								
								activateRedirect={basePath+"/verify"}
								
								refreshToken={this.triggerSilentRefreshToken}
								logout={this.logout}
								
								currentUser={this.state.currentUser}
								authToken={this.state.accessToken}
								
								reRouteSignIn={basePath+"/signin"}
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