import React from "react";

import { APISignIn, APISignUp, APIResendValidator } from "../utils";

import { withRouter} from "react-router-dom";

class signup extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			username: 'dummyUser',
			email: 'jjwallace314@gmail.com',
			password: 'dummyPassword',
			password2: 'dummyPassword',
			firstName: 'Dummy',
			lastName: 'User',
			
			// Well, I can expand this to be better on our end...
			usernameError:false,
			usernameErrorDetail: 'Username is unavalible',
			
			emailError:false,
			emailErrorDetail: 'Email is invalid/taken',
			
			passwordError:false,
			passwordErrorDetail:'Passwords do not match!',
			
			checkField: false,
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
		this.setState( {password: event.target.value} )
	}
	
	pass2FieldChange = (event) => {
		this.setState({
			password2: event.target.value,
			passwordError: event.target.value !== this.state.password,
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
	nowSendEmailCallback = () => {
		// Change this to the validator view
		this.props.history.push(this.props.reRouteTarget)
	}
	nowSendEmailFailure = () => {
		// If we fail here, we are totally boned...
		console.log("Oh no. We failed")
	}
	nowSendEmail = (newToken) => {
		// Now sending the validator email...
		APIResendValidator(this.props.APIHost, newToken, this.nowSendEmailCallback, this.nowSendEmailFailure)
	}
	
	// Chain Step 2!
	
	// I can probobly use this as a intemediary to straight get the incoming token instead of tossing it back up to App.js...
	nowSignInCallback = (incomingToken) => {
		const sanityCheck = this.props.loginSave( incomingToken, this.state.username, false )
		if (sanityCheck) {
			console.log("Token registered")
			this.nowSendEmail(incomingToken)
		}
		else {
			console.log("Token Failed..?")
		}
	}
	nowSignInFailure = () => {
		// O h n o
		console.log("Connection failed...")
	}
	nowSignIn = () => {
		APISignIn(this.props.APIHost, this.state.username, this.state.password, this.nowSignInCallback, this.nowSignInFailure)
	}
	
	handleSignUpSubmitCallback = (responseStatus) => {
		if (responseStatus === 201) {
			//this.props.history.push(this.props.reRouteTarget)
			console.log("Successful Sign up, now signing in...")
			this.nowSignIn()
		}
	}
	handleSignUpSubmitFailure = (errorStatus, errorData) => {
		if (errorStatus === 400) {
			for (let index in errorData) {
				//console.log(index)
				//console.log(errorData[index])
				// This is ultratrash............. Redo this
				if (index === "username") {
					this.setState({
						usernameError:true,
						usernameErrorDetail:errorData[index]
					})
				}
				if (index === "email") {
					this.setState({
						emailError:true,
						emailErrorDetail:errorData[index]
					})
				}
				if (index === "password") {
					this.setState({
						passwordError:true,
						passwordErrorDetail:errorData[index]
					})
				}
			}
		}
	}
	handleSignUpSubmit = (event) => {
		
		if (!this.state.checkField) {
			console.log("Field was not checked")
		}
		else {
			APISignUp(this.props.APIHost, this.state.username, this.state.password, this.state.password2, this.state.email, this.state.firstName, this.state.lastName, this.handleSignUpSubmitCallback, this.handleSignUpSubmitFailure)
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
								<button type='submit' className='btn btn-dark btn-block'>Submit</button>
							</div>
						</div>		
					</form>
				</div>
			</div>
		);
	}
}

export default withRouter(signup);