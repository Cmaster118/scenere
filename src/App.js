import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { SignIn, SignUp, Forgot, VerifyEmail } from "./components/authPages";
import { ContactUs } from "./components/landingPages";

import { Navigation, Footer } from "./components";
import { LandingPages, ContentCommonPages} from "./components";
//AuthPages

import { APIRefreshToken } from "./utils";
import Store from "store"

//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './style.css'

// Is THIS a patch for Github Pages react stuff?
// Maybe...
// Ill have to test this...
const basePath = "/scenere"

const hostName = "https://cmaster.pythonanywhere.com"
//const hostName = "http://10.0.0.60:8000"

class App extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
          
		  currentUser: undefined,
		  sessionToken: undefined,
		  remember: false,

        };
	}
	
	componentDidMount() {
		this.loadFromCookies();
	};
	
	loadFromCookies = () => {
		const lastUserSet = Store.get('lastUser');
			
		try{ 
			// IF we are successful, then we also want to set remember to true... As it must have been in that state to get this
			this.setState({ 
				currentUser: lastUserSet.user, 
				sessionToken: lastUserSet.session,
				remember: true,
			}) 
		}
		catch{
			console.log("User was NOT found in the storage")
		};
	}
	
	setToken = ( token, username, remember ) => {
		// Verify this before we sent it in I guess?
		this.setState({ 
			sessionToken: token, 
			currentUser: username, 
			rememberMe: remember,
		})
		
		if (remember === true) {
			Store.set('lastUser', { user:username, session:token })
			//console.log("Remembered User")
		}
		
		// Return if we succeeded or not
		return true
	}
	
	
	refreshCallback = (incomingToken) => {
		this.setToken(incomingToken, this.state.currentUser, this.status.rememberMe)
	}
	refreshFailure = () => {
		this.logout()
	}
	// Test out refreshing the token...
	// Should do this every page reload...
	refresh = () => {
		APIRefreshToken(hostName, this.state.sessionToken, this.refreshCallback, this.refreshFailure)
	}

	// Should move this over to the UTIL...
	logout = () => {
		this.setState({ 
			sessionToken: undefined, 
			currentUser: undefined 
		})

		// Store this as a cookie instead?
		Store.remove('lastUser')
	}
	
	render() {

		return (
			<Router>
				<div className="App">
					
					<Navigation 
						currentUser={this.state.currentUser}
						basePath={basePath}

						clearLogin={this.logout}
						
						reRouteCompany={basePath+"/dashboard"}
						reRouteUser={basePath+"/dashboard"}
					/>
						
					<Switch>
					
						{/*To catch ONLY the landing page, this one has to be exact...*/}
						{/*Unless I am also missing something*/}
						<Route path={basePath+"/"} exact component={() => <LandingPages 
								APIHost={hostName}
								
							/>} 
						/>
						
						<Route path={basePath+"/signin"} exact component={() => <SignIn 
								APIHost={hostName}
								loginSave={this.setToken}

								reRouteTarget={basePath+"/dashboard"}
								forgotPath={basePath+"/forgot"}
							/>}
						/>	
						<Route path={basePath+"/signup"} exact component={() => <SignUp 
								APIHost={hostName}
								reRouteTarget={basePath+"/verify"}
								
								loginSave={this.setToken}
								
								//currentUser={this.state.currentUser}
								authToken={this.state.sessionToken}
							/>} 
						/>
						<Route path={basePath+"/verify"} exact component={() => <VerifyEmail 
								APIHost={hostName}
								authToken={this.state.sessionToken}
								
								forceLogout={this.logout}
								reRouteTarget={basePath+"/signin"}
								
								reRouteSuccessTarget={basePath+"/dashboard"}
							/>} 
						/>
						<Route path={basePath+"/forgot"} exact component={() => <Forgot 
								APIHost={hostName}
								
								reRouteTarget={basePath+"/signin"}
							/>} 
						/>
						
						<Route path={basePath+"/contact"} exact component={() => <ContactUs 
								APIHost={hostName}
							/>} 
						/>
						
						<Route path={basePath+"/dashboard"} component={() => <ContentCommonPages 
								APIHost={hostName}
								
								tokenRefresh={this.refresh}
								reRouteTarget={basePath+"/signin"}
								activateRedirect={basePath+"/verify"}
								
								logout={this.logout}
								
								currentUser={this.state.currentUser}
								authToken={this.state.sessionToken}
							/>}
						/>

					</Switch>

					<Footer 
					
					/>
				</div>
			</Router>
		);
	}
}

export default App;