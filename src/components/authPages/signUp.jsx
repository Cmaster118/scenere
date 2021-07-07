import React from "react";

import { APISignIn, APISignUp, APIResendValidator } from "../../utils";
import { Alert } from 'react-bootstrap';

import { withRouter} from "react-router-dom";

class signup extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			username: '',
			email: '',
			password: '',
			password2: '',
			firstName: '',
			lastName: '',
			
			networkError:false,
			
			// Well, I can expand this to be better on our end...
			usernameError:false,
			usernameErrorDetail: 'Username is unavalible',
			
			emailError:false,
			emailErrorDetail: 'Email is invalid/taken',
			
			passwordError:false,
			passwordErrorDetail:'Passwords do not match!',
			
			unhandledError:false,
			serverError:false,
			
			checkField: false,
			
			nowSendEmailState: 0,
			nowSignInState: 0,
			handleSignUpSubmitState:0,
			
			legalError:false
        };
	}
	
	// Wait, are Usernames a good thing for what we are doing? Hmmmm
	usernameFieldChange = (event) => {
		this.setState( {username: event.target.value} )
	}
	
	emailFieldChange = (event) => {
		this.setState( {email: event.target.value} )
	}
	
	passFieldChange = (event) => {
		this.setState({
			password: event.target.value,
			
			passwordError: event.target.value !== this.state.password2,
			passwordErrorDetail:'Passwords do not match!'
		})
	}
	
	pass2FieldChange = (event) => {
		this.setState({
			password2: event.target.value,
			
			passwordError: event.target.value !== this.state.password,
			passwordErrorDetail:'Passwords do not match!'
		})
	}
	
	firstNameFieldChange = (event) => {
		this.setState( {firstName: event.target.value} )
	}
	
	lastnameFieldChange = (event) => {
		this.setState( {lastName: event.target.value} )
	}
	
	checkFieldChange = (event) => {
		this.setState( {checkField: event.target.value} )
	}
	
	// CHAIN STEP 3! 
	nowSendEmailFailure = () => {
		// If we fail here, we are totally boned...
		console.log("Oh no. We failed")
		this.props.history.push(this.props.reRouteTarget)
		this.setState({
			nowSendEmailState:3,
		})
	}
	nowSendEmailCallback = () => {
		// Change this to the validator view
		this.props.history.push(this.props.reRouteTarget)
		this.setState({
			nowSendEmailState:2,
		})
	}
	nowSendEmail = (newToken) => {
		// Now sending the validator email...
		APIResendValidator(newToken, this.nowSendEmailCallback, this.nowSendEmailFailure)
		this.setState({
			nowSendEmailState:1,
		})
	}
	
	// Chain Step 2!
	
	nowSignInFailure = () => {
		// O h n o
		console.log("Sign in failed, I dont even know what to do here... Normal errors dont work here...")
		this.props.history.push(this.props.reRouteTarget)
		// This is probobly unecessary...
		this.setState({
			nowSignInState:3,
		})
	}
	// I can probobly use this as a intemediary to straight get the incoming token instead of tossing it back up to App.js...
	nowSignInCallback = (incomingToken) => {
		const sanityCheck = this.props.loginSave( incomingToken, this.state.username, false )
		if (sanityCheck) {
			console.log("Token registered")
			this.nowSendEmail(incomingToken)
		}
		else {
			console.log("Token Failed..?")
			this.props.history.push(this.props.reRouteTarget)
		}
		this.setState({
			nowSignInState:2,
		})
	}
	nowSignIn = () => {
		APISignIn(this.state.username, this.state.password, this.nowSignInCallback, this.nowSignInFailure)
		this.setState({
			nowSignInState:1,
		})
	}
	
	handleSignUpSubmitFailure = (responseData) => {
		//console.log(errorCodes)
		let networkErrorFlag = false
		
		let usernameErrorFlag = false
		let usernameErrorDetails = ""
		
		let passwordErrorFlag = false
		let passwordErrorDetails = ""
		
		let emailErrorFlag = false
		let emailErrorDetails = ""
		
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
					usernameErrorDetails = responseData['messages'][index]['text']
				}
				else if (responseData['messages'][index]['mod'] === 2) {
					passwordErrorFlag = true
					passwordErrorDetails = responseData['messages'][index]['text']
				} 
				else if (responseData['messages'][index]['mod'] === 4) {
					emailErrorFlag = true
					//emailErrorDetails = responseData['messages'][index]['text']
					emailErrorDetails = "Email is taken!"
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
			networkError:networkErrorFlag,
			
			usernameError:usernameErrorFlag,
			usernameErrorDetail:usernameErrorDetails,
			
			passwordError:passwordErrorFlag,
			passwordErrorDetail:passwordErrorDetails,
			
			emailError:emailErrorFlag,
			emailErrorDetail:emailErrorDetails,
			
			unhandledError:unhandledErrorFlag,
			serverError:serverErrorFlag,
			
			handleSignUpSubmitState:3,
		})
	}
	handleSignUpSubmitCallback = (responseStatus) => {
		if (responseStatus === 201) {
			//this.props.history.push(this.props.reRouteTarget)
			console.log("Successful Sign up, now signing in...")
			this.nowSignIn()
			
			this.setState({
				handleSignUpSubmitState:2,
			})
		}
	}
	handleSignUpSubmit = (event) => {
		
		if (!this.state.checkField) {
			console.log("Field was not checked")
			this.setState({
				legalError: true
			})
		}
		else {
			APISignUp(this.state.username, this.state.password, this.state.password2, this.state.email, this.state.firstName, this.state.lastName, this.handleSignUpSubmitCallback, this.handleSignUpSubmitFailure)
			this.setState({
				handleSignUpSubmitState:1,
				legalError: false
			})
		}
		
		event.preventDefault();
	}
	
	render() {
		let usernameClass = 'form-control'
		if (this.state.usernameError) {
			usernameClass += ' bg-warning'
		}
		
		let emailClass = 'form-control'
		if (this.state.emailError) {
			emailClass += ' bg-warning'
		}
		
		let passwordClass = 'form-control'
		if (this.state.passwordError) {
			passwordClass += ' bg-warning'
		}
		
		let show0 = this.state.legalError
		let show1 = this.state.handleSignUpSubmitState === 1
		
		return (
			
			<div className="signUp">
				<div className="container">		
					<div className="row">
						<div className="col">
							<h3>Sign Up</h3>
						</div>
					</div>	
					<form onSubmit={this.handleSignUpSubmit}>
						<div id="align-left">
							<div className="row">
								<div className="col">
									<div className='form-group'>
										<label id="label-left">Username</label>
										<input type='text' className={usernameClass} value={this.state.username} onChange={this.usernameFieldChange} placeholder='Enter Username' />
										<p className="text-danger">{this.state.usernameError ? this.state.usernameErrorDetail:""}</p>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className='form-group'>
										<label id="align-left">Email Address</label>
										<input type='email' className={emailClass} value={this.state.email} onChange={this.emailFieldChange} placeholder='Enter email' />
										<p className="text-danger">{this.state.emailError ? this.state.emailErrorDetail:""}</p>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">		
									<div className='form-group'>
										<label id="align-left">Password</label>
										<input type='password' className={passwordClass} value={this.state.password} onChange={this.passFieldChange} placeholder='Enter password' />
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">		
									<div className='form-group'>
										<label id="align-left">Confirm Password</label>
										<input type='password' className={passwordClass} value={this.state.password2} onChange={this.pass2FieldChange} placeholder='Confirm password' />
										<p className="text-danger">{this.state.passwordError ? this.state.passwordErrorDetail:""}</p>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">		
									<div className='form-group'>
										<label id="align-left">First Name</label>
										<input type='text' className='form-control' value={this.state.firstName} onChange={this.firstNameFieldChange} placeholder='First Name' />
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">		
									<div className='form-group'>
										<label id="align-left">Last Name</label>
										<input type='text' className='form-control' value={this.state.lastName} onChange={this.lastnameFieldChange} placeholder='Last Name' />
									</div>
								</div>
							</div>
						</div>
						
						<div className="row">
							<div className="col">
								<div className='form-group'>
									<input type='checkbox' className='form-control-input' id='customCheck1' value={this.state.checkField} onChange={this.checkFieldChange} />
									<label className='form-control-label' htmlFor='customCheck1' >Legal stuff?</label>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col">		
								{this.state.networkError ? <p className="bg-warning text-danger border">Server cannot be reached!</p>:undefined}
								<button type='submit' className='btn btn-dark btn-block'>Submit</button>
							</div>
						</div>		
					</form>
					
					<Alert show={show0} variant="danger">
						<Alert.Heading>Warning</Alert.Heading>
						<hr />
						<p>
						  You have to accept the non-existant legal documents
						</p>
						<hr />
					</Alert>
					
					<Alert show={show1} variant="warning">
						<Alert.Heading>Waiting</Alert.Heading>
						<hr />
						<p>
						  This should display while waiting for the return
						</p>
						<hr />
					</Alert>
					
					<div className="row my-5">
						<div className="col">	
						
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(signup);