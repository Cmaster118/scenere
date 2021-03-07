import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import axios from "axios";

import { Navigation, Footer, Landing, SignIn, SignUp, Forgot, VerifyEmail, ContactUs} from "./components";
import { FreePages, ContentPages } from "./components";
//AuthPages

import Store from "store"

//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css'

// Is THIS a patch for Github Pages react stuff?
// Maybe...
// Ill have to test this...
const basePath = "/scenere"

//const hostName = "https://cmaster.pythonanywhere.com"
const hostName = "http://10.0.0.60:8000"

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
	
	// Test out refreshing the token...
	// Should do this every page reload...
	refresh = () => {
		const data = {
			token: this.state.sessionToken,
		};
		
		axios.post(hostName + "/apiTokenRefresh/", data)
		.then( 	res => {
			//console.log(res)
			
			// If we get here then we should have a new token
			//console.log(res.data.token)
			console.log("Token refreshed")
			// A little bit unnecessary but hey...
			this.setToken(res.data.token, this.state.currentUser, this.status.rememberMe)
			
			return true
		})
		.catch( err => {
			console.log(err)
			// Check for a specific error?
			
			this.logout()
			
			return false
		});
	}

	// Should move this over to the UTIL...
	logout = () => {
		this.setState({ 
			sessionToken: undefined, 
			currentUser: undefined 
		})

		Store.remove('lastUser')
	}
	
	// maybe I should move all the AXIOS stuff to its own file...
	
	render() {

		return (
			<Router>
				<div className="App">
			
					<Navigation 
						currentUser={this.state.currentUser}
						basePath={basePath}

						clearLogin={this.logout}
					/>
						
					<Switch>
					
						{/*To catch ONLY the landing page, this one has to be exact...*/}
						{/*That means that i CANNOT nest them in the landing page...*/}
						{/*Unless I am also missing something*/}
						<Route path={basePath+"/"} exact component={() => <Landing 
								APIHost={hostName}
								
							/>} 
						/>
						
						{/*Anything else will have to be in a different component...*/}
						<Route path={basePath+"/info"} component={() => <FreePages 
								APIHost={hostName}
								
							/>}
						/>
						{/*This can actually be replaced by a Modal in the navigational menu....
						<Route path={basePath+"/auth"} component={() => <AuthPages 
								APIHost={hostName}
								
							/>} 
						/>*/}
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
						
						{/*And depending on how complicated this gets, I may need to split this*/}
						<Route path={basePath+"/dashboard"} component={() => <ContentPages 
								APIHost={hostName}
								
								tokenRefresh={this.refresh}
								reRouteTarget={basePath+"/signin"}
								activateRedirect={basePath+"/verify"}
								
								forceLogout={this.logout}
								
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