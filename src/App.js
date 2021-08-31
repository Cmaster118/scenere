import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { SignIn, SignUp, Forgot, VerifyEmail } from "./components/authPages";
import { ContactUs } from "./components/landingPages";

import { Navigation, Footer } from "./components";
import { LandingPages, ContentCommonPages} from "./components";
//AuthPages

import { Sidebar } from "./utils";
import { APIRefreshToken, APISignOut, APITestSecurity } from "./utils";
import { setAccessToken } from "./utils";
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
			
			pageIsLoaded: false,
        };
		this.timerSet = undefined;
	}
	
	componentDidMount() {
		this.loadFromLocalStorage();
	};
	
	componentWillUnmount() {

	}
	
	timedRefresh = () => {
		//console.log('Token Refreshed!');
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
	
	changeUserMenuItems = (nextState) => {
		try {
			this.refs.sidebar.setUserFlag(nextState)
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
			// Remember, this refresh needs. AND I MEAN NEEDS. TO GET TO A BETTER STROAGE SPOT
			// Load it into a cookie on the Django End....
			this.login(lastUserSet.lastAccess, lastUserSet.user, true)
		}
	}
	
	silentTokenUpdate = (token) => {
		setAccessToken(token)
	}
	
	killAccessToken = () => {
		setAccessToken("")
	}
	
	login = ( token, username, remember ) => {
		
		this.changeMenuUserName(username)
		
		// I am having trouble with cookies, so lets do the rest of the refresh infrastructure while I cool off...
		// I will just have to replace all references to the REFRSH token to a cookie, but right now we will use the local storage...
		if (remember === true) {
			//Hmmmmmmmmmmmmmmm, I will need to delete the cookies? I need to test this.....
			timedSaveStorage( "lastUser", {user:username, lastAccess:token}, 2)
		}
		
		this.silentTokenUpdate(token)
		
		// Verify this before we sent it in I guess?
		this.setState({ 
			currentUser: username, 
			rememberMe: remember,
			
			pageIsLoaded: true,
		})
		
		//console.log("App Has Finished Loading!")
		
		this.timerSet = setInterval(this.timedRefreshToken, waitTimeMS)
		
		// Return if we succeeded or not
		return true
	}
	
	refreshFailure = (incomingError, callbackSignal) => {
		// Not sure why I would want a callback Signal here but...
		//console.log(incomingError)
		
		this.logout()
		nonUpdateRefreshingToken = false
	}
	refreshCallback = (incomingToken, callbackSignal) => {
		
		this.silentTokenUpdate(incomingToken.access)
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
	
	triggerSilentRefreshToken = ( callbackRefresh ) => {
		//console.log("Triggered this thing")
		//console.log( callbackRefresh )
		
		if (this.state.currentUser === undefined) {
			//  Something is unauthorized, and we have no user! We need to logout!
			//this.logout()
		}
		else {
			if (!nonUpdateRefreshingToken) {
				this.silentRefreshToken( callbackRefresh )
				
				//console.log("TRIGGERD REFRESH OF TOKEN FROM A COMPONENT!")
				nonUpdateRefreshingToken = true
				
				// Now, we have to trigger a redo of the stuff once its done...
			}
			else {
				//console.log("Already refreshing token!")
			}
		}
	}
	
	deleteServerCookiesFailure = (incomingError) => {
		// Depends on the error honestly...
		//console.log(incomingError)
	}
	deleteServerCookiesCallback = (incomingMessage) => {
		//console.log(incomingMessage)
	}
	deleteServerCookies = () => {
		APISignOut(this.deleteServerCookiesCallback, this.deleteServerCookiesFailure)
	}
	
	// Should move this over to the UTIL...
	logout = () => {
		console.log("Triggering A Logout")
		//this.deleteServerCookies()
		
		this.setState({
			currentUser: undefined 
		})
		
		clearInterval(this.timerSet)
		this.changeMenuUserName("No User")
		this.silentTokenUpdate(undefined)
		deleteStorageKey('lastUser')
		
		deleteStorageKey('lastGotCompany')
		deleteStorageKey('lastUser')
	}
	
	booper = () => {
		APITestSecurity()
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
					<button onClick={this.booper}>
						Test!
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
								parentHasLoaded={this.state.pageIsLoaded}
								
								refreshToken={this.triggerSilentRefreshToken}
								logout={this.logout}
								
								currentUser={this.state.currentUser}
								authToken={this.state.accessToken}
								
								reRouteSignIn={basePath+"/signin"}
								reRouteCompany={basePath+"/dashboard"}
								reRouteUser={basePath+"/dashboard"}
								
								disableMenu={this.disableMenu}
								activateUserMenu={this.activateUserMenu}
								changeUserMenuItems={this.changeUserMenuItems}
								
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