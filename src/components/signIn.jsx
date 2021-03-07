import React from "react";

import { Link, withRouter } from 'react-router-dom';

import { APISignIn } from "../utils";

import Store from "store"

class signIn extends React.Component {

	// Lets test this out, before we move this over to the App js file
	constructor(props) {
        super(props);
        this.state = {
          
			// Lets do a state machine for the sake of it...
			// 0 is "No result given yet"
			// 1+ would be error codes...
			// How can I change this screen as per this?
			// Eh, thats later...
			currentState: 0,

			// This can take in the response code, and we can use that, cant we?
			latestAttempt: 0,
		  
			username: '',
			
			// This needs to be hashed as fast as possible...
			// But I will worry about security...
			// Just note that this is probobly a bad idea...
			password: '',
			
			remember: true,
			
        };
	}
	
	componentDidMount() {
		//this.loadFromCookies();
	};
	
	loadFromCookies = () => {
		
		const data = Store.get('rememberUser')
		try {
			this.setState({ username:data.user ,password:data.pass })
		} catch {
			
		}
	}
	
	userFieldChange = (event) => {
		this.setState( {username: event.target.value} )
	}
	
	passFieldChange = (event) => {
		this.setState( {password: event.target.value} )
	}
	
	remFieldChange = (event) => {
		this.setState( {remember: event.target.value} )
	}
	
	handleSubmitSuccess = (incomingToken) => {
		//console.log(this.state.remember)
		const sanityCheck = this.props.loginSave( incomingToken, this.state.username, this.state.remember )
		if (sanityCheck) {
			console.log("Token registered")
			
			// Change this to a dashboard lookin thing
			this.props.history.push(this.props.reRouteTarget)
		}
		else {
			console.log("Token Failed..?")
		}
	}
	handleSubmitFailure = (errorResult) => {
		console.log("Connection failed...")
		this.setState({ latestAttempt: 400 })
	}
	handleSubmit = event => {
		
		APISignIn(this.props.APIHost, this.state.username, this.state.password, this.handleSubmitSuccess, this.handleSubmitFailure)
		event.preventDefault();
	}
	
	render() {
	
		return (
			<div className='container'>
				<form onSubmit={this.handleSubmit} >
					<h3>Sign In</h3>
					
					<div className='form-group'>
						<label>Email Address</label>
						<input type='text' className='form-control' value={this.state.username} onChange={this.userFieldChange} placeholder='Enter Username' />
					</div>
					
					<div className='form-group'>
						<label>Password</label>
						<input type='password' className='form-control' value={this.state.password} onChange={this.passFieldChange} placeholder='Enter password' />
					</div>
					
					<div className='form-group'>
						<input type='checkbox' className='form-control-input' id='customCheck1' value={this.state.remember} onChange={this.remFieldChange} />
						<label className='form-control-label' htmlFor='customCheck1' >Remember Me</label>
					</div>
					
					<button type='submit' className='btn btn-dark btn-block'>Submit</button>
					<div className="row">
							
						<p className='col forgot-password text-right text-dark'>
							<Link className="nav-link" to={this.props.forgotPath}>
								Forgot password?
							</Link>
						</p>

					</div>

				</form>
			</div>
		);
	}
}

export default withRouter(signIn);