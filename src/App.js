import React from "react";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";

import { Navigation, Footer, Landing, SignIn, SignUp, ViewJournals, WriteJournals, ViewCompany } from "./components";

import Store from "store"

//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css'

class App extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
          
		  currentUser: null,
		  sessionToken: null,

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
			console.log("No user based cookies")
		};
	}
	
	setToken = ( token, username ) => {
		// Verify this before we sent it in I guess?
		this.setState({ sessionToken: token, currentUser: username })
		
		Store.set('lastUser', { user:username, session:token })
		
		// Return if we succeeded or not
		return true
	}
	
	render() {
		return (
			<Router>
				<div className="App">
					<Navigation 
						currentUser={this.state.currentUser}
					/>
						
					<Switch>
						<Route path="/" exact component={() => <Landing 
								
							/>} />
						<Route path="/signin" exact component={() => <SignIn 
								tokenSetter={this.setToken}
							/>} />
						<Route path="/signup" exact component={() => <SignUp 
						
							/>} />
						<Route path="/read" exact component={() => <ViewJournals 
								currentUser={this.state.currentUser}
								authToken={this.state.sessionToken}
							/>} />
						<Route path="/write" exact component={() => <WriteJournals 
								authToken={this.state.sessionToken}
							/>} />
						<Route path="/company" exact component={() => <ViewCompany 
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