import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import axios from "axios";

import { Navigation, Footer, Landing, SignIn, SignUp, Forgot, ViewJournals, WriteJournals, ViewCompany, SetCompany, MainMenu, Test} from "./components";

import Store from "store"

//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css'

// Is THIS a patch for Github Pages react stuff?
// Maybe...
// Ill have to test this...
const basePath = "/scenere"

const hostName = "https://cmaster.pythonanywhere.com"
//const hostName = "10.0.0.60:8000"

class App extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
          
		  currentUser: undefined,
		  sessionToken: undefined,

        };
	}
	
	componentDidMount() {
		this.loadFromCookies();
	};
	
	loadFromCookies = () => {
		const lastUserSet = Store.get('lastUser');
			
		try{ 
			this.setState({ currentUser: lastUserSet.user, sessionToken: lastUserSet.session }) 
		}
		catch{
			console.log("User was NOT found in the storage")
		};
	}
	
	setToken = ( token, username ) => {
		// Verify this before we sent it in I guess?
		this.setState({ sessionToken: token, currentUser: username })
		
		Store.set('lastUser', { user:username, session:token })
		
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
			this.setToken( res.data.token, this.state.currentUser)
			
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
		this.setState({ sessionToken: undefined, currentUser: undefined })

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

						clearLogin={this.setToken}
					/>
						
					<Switch>
					
						<Route path={basePath+"/test"} component={() => <Test 
								APIHost={hostName}
								forceLogout={this.logout}
								
								currentUser={this.state.currentUser}
								
								tokenRefresh={this.refresh}
								reRouteTarget={basePath+"/signin"}
								authToken={this.state.sessionToken}
								
							/>} />
					
						<Route path={basePath+"/"} exact component={() => <Landing 
								APIHost={hostName}
								
							/>} />
							
						<Route path={basePath+"/signin"} exact component={() => <SignIn 
								loginSave={this.setToken}
								APIHost={hostName}

								reRouteTarget={basePath+"/menu"}
								forgotPath={basePath+"/forgot"}
							/>} />
							
						<Route path={basePath+"/signup"} exact component={() => <SignUp 
								APIHost={hostName}
								reRouteTarget={basePath+"/signin"}
						
							/>} />
							
						<Route path={basePath+"/forgot"} exact component={() => <Forgot 
								APIHost={hostName}
								
								reRouteTarget={basePath+"/signin"}
							/>} />

						<Route path={basePath+"/menu"} exact component={() => <MainMenu 
								APIHost={hostName}
								tokenRefresh={this.refresh}
								reRouteTarget={basePath+"/signin"}

								journalWriteDirect={basePath+"/write"}
								journalReadDirect={basePath+"/read"}
								companyReadDirect={basePath+"/companyCheck"}
								companySettingDirect={basePath+"/companySet"}	

								currentUser={this.state.currentUser}
								authToken={this.state.sessionToken}
							/>} />

						<Route path={basePath+"/read"} exact component={() => <ViewJournals 
								APIHost={hostName}
								tokenRefresh={this.refresh}
								reRouteTarget={basePath+"/signin"}
								forceLogout={this.logout}
								
								currentUser={this.state.currentUser}
								authToken={this.state.sessionToken}
							/>} />
							
						<Route path={basePath+"/write"} exact component={() => <WriteJournals 
								APIHost={hostName}
								tokenRefresh={this.refresh}
								reRouteTarget={basePath+"/signin"}
								
								authToken={this.state.sessionToken}
							/>} />
							
						<Route path={basePath+"/companyCheck"} exact component={() => <ViewCompany 
								APIHost={hostName}
								forceLogout={this.logout}
								
								currentUser={this.state.currentUser}
								
								tokenRefresh={this.refresh}
								reRouteTarget={basePath+"/signin"}
								authToken={this.state.sessionToken}
							/>} />
							
						<Route path={basePath+"/companySet"} exact component={() => <SetCompany 
								APIHost={hostName}
								tokenRefresh={this.refresh}
								reRouteTarget={basePath+"/signin"}
								
								authToken={this.state.sessionToken}
							/>} />

					</Switch>

					<Footer 
					
					/>
				</div>
			</Router>
		);
	}
}

export default App;