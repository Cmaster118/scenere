import React from "react";

import { Link, withRouter } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import { APISignIn } from "../../utils";

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
			signInState: 0,
			
			// Switches to display errors on the front page
			// Hm, this seems a little bad.... Can I mesh these together while still being readable?
			usernameError: false,
			passwordError: false,
			isWrongError: false,
			
			networkError: false,			
			miscError: false,
		  
			username: '',
			
			// This needs to be hashed as fast as possible...
			// But I will worry about security...
			// Just note that this is probobly a bad idea...
			password: '',
			
			remember: false,
			
        };
	}
	
	componentDidMount() {
		
	};
	
	resetErrors = () => {
		this.setState({
			usernameError: false,
			passwordError: false,
			isWrongError: false,
			networkError: false,			
			miscError: false,
		})
	}
	
	userFieldChange = (event) => {
		this.setState({
			username: event.target.value,
		})
		this.resetErrors()
	}
	
	passFieldChange = (event) => {
		this.setState({
			password: event.target.value,
		})
		this.resetErrors()
	}
	
	remFieldChange = (event) => {

		this.setState({
			remember: !this.state.remember,
		})
		this.resetErrors()
	}
	
	handleSubmitFailure = (responseData) => {
		
		let networkErrorFlag = false
		
		let usernameErrorFlag = false
		let passwordErrorFlag = false
		let isWrongErrorFlag = false
		
		let unhandledErrorFlag = false
		let serverErrorFlag = false
		
		// Server is dead
		if (responseData["action"] === 0) {
			networkErrorFlag = true
		}
		// Bad Request
		else if (responseData["action"] === 3) {
			for (let index in responseData['messages']) {
				if (responseData['messages'][index]['mod'] === 1) {
					usernameErrorFlag = true
				}
				else if (responseData['messages'][index]['mod'] === 2) {
					passwordErrorFlag = true
				} 
				else if (responseData['messages'][index]['mod'] === 3) {
					isWrongErrorFlag = true
				}
				else {
					unhandledErrorFlag = true
				}
			}
		}
		// Server Exploded Error
		else if (responseData["action"] === 4) {
			serverErrorFlag = true
		}
		// Unknown Error
		else if (responseData["action"] === 5) {
			serverErrorFlag = true
		}
		
		this.setState({
			
			networkError: networkErrorFlag,
				
			usernameError: usernameErrorFlag,
			passwordError: passwordErrorFlag,
			isWrongError: isWrongErrorFlag,
					
			unhandledError: unhandledErrorFlag,
			serverError: serverErrorFlag,
			
			signInState:3,
		})
	}
	handleSubmitSuccess = (incomingToken) => {

		let sanityCheck = this.props.loginSave( incomingToken, this.state.username, this.state.remember )
		if (sanityCheck) {
			//console.log("Token registered")
			
			/*
			this.setState({
				signInState:2,
			})
			*/

			this.props.history.push(this.props.reRouteTarget)			
		}
		else {
			console.log("Token Set on OUR END Failed..?")
		}
	}
	handleSubmit = event => {
		
		APISignIn(this.state.username, this.state.password, this.handleSubmitSuccess, this.handleSubmitFailure)
		
		this.setState({
			signInState:1,
		})
		
		event.preventDefault();		
	}
	
	render() {
	
		let usernameClass = ''
		if (this.state.usernameError || this.state.isWrongError) {
			usernameClass = 'bg-warning'
		}
		
		let passwordClass = ''
		if (this.state.passwordError || this.state.isWrongError) {
			passwordClass = 'bg-warning'
		}
		
		//let show0 = this.state.signInState === 0
		let show1 = this.state.signInState === 1
		//let show2 = this.state.signInState === 2
		//let show3 = this.state.signInState === 3
	
		return (
			<div className='container text-center'>

				<form onSubmit={this.handleSubmit} >
					<h3>Sign In</h3>
					
					<p className="text-danger">{this.state.isWrongError ? "Username and/or Password are incorrect":""}</p>
					
					<div className='form-group'>
						<label>Username</label>
						<input type='text' className={'form-control '+usernameClass} value={this.state.username} onChange={this.userFieldChange} placeholder='Enter Username' />
						<p className="text-danger">{this.state.usernameError ? "Username cant be blank":""}</p>
					</div>
					
					<div className='form-group'>
						<label>Password</label>
						<input type='password' className={'form-control '+passwordClass} value={this.state.password} onChange={this.passFieldChange} placeholder='Enter password' />
						<p className="text-danger">{this.state.passwordError ? "Password cannot be blank":""}</p>
					</div>

					<div className='form-group'>
						<label className='form-control-label' htmlFor='customCheck1' >Remember Me</label>
						<input type='checkbox' className='form-control-input' id='customCheck1' value={this.state.remember} onChange={this.remFieldChange} />
					</div>
					
					{this.state.miscError ? <p className="text-danger border">Unknown Error</p>:undefined}
					{this.state.networkError ? <p className="bg-warning text-danger border">Server cannot be reached!</p>:undefined}
					<button type='submit' className='btn btn-dark btn-block'>Submit</button>
					
					<div className="row">
							
						<div className="col"/>
						<div className="col"/>
						<div className="col"/>
						<p className='col forgot-password text-dark'>
							<Link className="nav-link border" to={this.props.forgotPath}>
								Forgot password?
							</Link>
						</p>

					</div>

				</form>
				
				<Alert show={show1} variant="warning">
					<Alert.Heading>Waiting</Alert.Heading>
					<hr />
					<p>
					  Waiting for server...
					</p>
					<hr />
				</Alert>
			</div>
		);
	}
}

export default withRouter(signIn);