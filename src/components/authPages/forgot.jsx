import React from "react";

import { Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { APIForgotEmailSend, APIForgotEmailValidate, APIForgotEmailChangePassword } from "../../utils";

class forgotPassword extends React.Component {
		
	constructor(props) {
        super(props);
        this.state = {

			// This page is one that we need to if the user cannot log in..
			// We need to send them to their emails, and then back to here...
			// However, we CANNOT RELY on them being logged in...
			
			// So, therefore.... We shall see if doing the email auth when not logged in will do better or worse...
			// If it somehow works better, then I should think of changing the auth page....
			currentState: 0,

			email: '',
			resetToken: '',

			password1:'',
			password2:'',

			passwordsSameError: false,
			
			networkError: false,
			
			emailError: false,
			emailErrorDetail: '',
			
			tokenError: false,
			tokenErrorDetail: '',
			
			passwordError: false,
			passwordErrorDetail: '',
			
			uncaughtError: false,
			
			sendEmailState: 0,
			validateCodeState: 0,
			submitPasswordState: 0,
        };
		
	}

	componentDidMount() {
		this.setState({
			email: '',
			resetToken: '',
			password1: '',
			password2: '',
		
		})
	}

	goSignIn = () => {
		this.props.history.push(this.props.reRouteTarget)
	}

	arePasswordsSame = () => {
		// I MAY need something more complicated than this, but it can be this for now....
		return (this.state.password1 === this.state.password2)
	}

	swapToCode = () => {
		this.setState( {currentState: 1} )
	}

	sendEmailSuccess = (successCode, successData) => {
		console.log("Email Send Success")
		this.setState({
			currentState: 1,
			networkError: false,
			uncaughtError: false,
			
			sendEmailState:2,
		})
	}
	sendEmailFailure = (responseData) => {
		
		let networkErrorFlag = false
		let emailErrorFlag = false
		let unknownErrorFlag = false
		
		let emailErrorDetails = ""
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Invalid Permissions
		else if (responseData["action"] === 2) {

		}
		// Bad Request
		else if (responseData["action"] === 3) {
			for (let index in responseData['messages']) {
				if (responseData['messages'][index]['mod'] === 4) {
					emailErrorFlag = true
					emailErrorDetails = responseData['messages'][index]['text']
				}
			}
		}
		// Server Exploded Error
		else if (responseData["action"] === 4) {

		}
		// Unknown Error
		else if (responseData["action"] === 5) {

		}

		this.setState({
			networkError:networkErrorFlag,
			emailError:emailErrorFlag,
			uncaughtError:unknownErrorFlag,
			
			emailErrorDetail:emailErrorDetails,
			
			sendEmailState:3,
		})
	}
	sendEmail = () => {
		console.log("Sending the Email Here...")
		APIForgotEmailSend(this.state.email, this.sendEmailSuccess, this.sendEmailFailure)
		
		this.setState({
			sendEmailState:1,
		})
	}

	checkTokenFailure = (responseData) => {
		
		let networkErrorFlag = false
		let tokenErrorFlag = false
		let unknownErrorFlag = false
		
		let tokenErrorDetails = ""
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Invalid Permissions
		else if (responseData["action"] === 2) {

		}
		// Bad Request
		else if (responseData["action"] === 3) {
			for (let index in responseData['messages']) {
				if (responseData['messages'][index]['mod'] === 4) {
					tokenErrorFlag = true
					tokenErrorDetails = responseData['messages'][index]['text']
				}
			}
		}
		// Server Exploded Error
		else if (responseData["action"] === 4) {

		}
		// Unknown Error
		else if (responseData["action"] === 5) {

		}
		
		this.setState({
			networkError:networkErrorFlag,
			tokenError:tokenErrorFlag,
			uncaughtError:unknownErrorFlag,
			
			tokenErrorDetail:tokenErrorDetails[1],
			
			validateCodeState:3,
		})
	}
	checkTokenSuccess = (successCode) => {
		console.log("Token Matched!")
		this.setState({
			currentState: 2,
			networkError: false,
			uncaughtError: false,
			
			validateCodeState:2,
		})
	}
	checkToken = () => {
		console.log("Send Token Here...")
		APIForgotEmailValidate( this.state.resetToken, this.checkTokenSuccess, this.checkTokenFailure)

		this.setState({
			validateCodeState:1,
		})
	}
	
	submitPasswordFailure = (responseData) => {
		let networkErrorFlag = false
		let passwordErrorFlag = false
		let unknownErrorFlag = false
		
		let passwordErrorDetail = ""
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Invalid Permissions
		else if (responseData["action"] === 2) {

		}
		// Bad Request
		else if (responseData["action"] === 3) {
			for (let index in responseData['messages']) {
				if (responseData['messages'][index]['mod'] === 2) {
					passwordErrorFlag = true
					passwordErrorDetail = responseData['messages'][index]['text']
				}
				else {
					unknownErrorFlag = true
				}
			}
		}
		// Server Exploded Error
		else if (responseData["action"] === 4) {

		}
		// Unknown Error
		else if (responseData["action"] === 5) {

		}
		
		this.setState({
			networkError:networkErrorFlag,
			passwordError:passwordErrorFlag,
			uncaughtError:unknownErrorFlag,
			
			passwordErrorDetail:passwordErrorDetail,
			
			submitPasswordState:3,
		})
	}
	submitPasswordSuccess = (successCode) => {
		console.log("Password Reset Success!")
		this.setState({
			currentState: 3,
			networkError: false,
			uncaughtError: false,
			
			submitPasswordState:2,
		})
	}
	submitPasswords = () => {
		// I can use the API for this...	
		console.log("Checking Passwords...")
		if (this.arePasswordsSame()) {
			console.log("Passwords Checked out!")
			APIForgotEmailChangePassword(this.state.resetToken, this.state.password1, this.state.password2, this.submitPasswordSuccess, this.submitPasswordFailure)
			
			this.setState({
				submitPasswordState:1,
			})
		}
		else {
			console.log("Passwords Failed!")
		}
	}
	

	emailFieldChange = (event) => {
		this.setState({
			email: event.target.value
		})
	}

	tokenFieldChange = (event) => {
		this.setState({
			resetToken: event.target.value
		})
	}
	
	pass1FieldChange = (event) => {
		this.setState({
			password1: event.target.value
		})
	}

	pass2FieldChange = (event) => {
		this.setState({
			password2: event.target.value,
			passwordsSameError: event.target.value !== this.state.password1,
		})
	}
	
	render() {

		let currentField = null
		let currentButton = null
		let currentMessage = null

		// Enter Email For Recovery State
		if (this.state.currentState === 0) {
			
			if (this.state.networkError) {
				
			}
			if (this.state.emailError) {
				
			}
			
			currentMessage = (
				<div className="row">
					<div className="col">
						<p> 
							Enter your email address.
							If it is in the system, we will send you an email address with a code.
						</p>
					</div>
				</div>
			)

			currentField = (
				<div className="row">
					<div className="col">
						<div className='form-group'>
							<label>Email Address</label>
							<input type='email' className='form-control' value={this.state.email} onChange={this.emailFieldChange} placeholder='Enter email' />
						</div>
					</div>
				</div>
			)

			currentButton = [
				(
					<div className="row" key={1}>
						<div className="col">
							<button className="btn btn-primary" onClick={this.sendEmail}>
								Send
							</button>
						</div>
					</div>
				),(
					<div className="row" key={2}>
						<div className="col m-2">
							<button className="btn btn-primary" onClick={this.swapToCode}>
								Already have the code!
							</button>
						</div>
					</div>
				)
			]
				
		}
		// Enter Token From Email State
		else if (this.state.currentState === 1) {
			
			if (this.state.networkError) {
				
			}
			if (this.state.tokenError) {
				
			}

			currentMessage = (
				<div className="col">
					<p> 
						Check your email.
						If your email is correct, then enter the code it gives you here:
					</p>
				</div>
			)

			currentField = (
				<div className="col">
					<div className='form-group'>
						<label>Reset token</label>
						<input type='text' className='form-control' value={this.state.resetToken} onChange={this.tokenFieldChange} placeholder='Enter Token' />
					</div>
				</div>
			)

			currentButton = (
				<div className="col">
					<button className="btn btn-primary" onClick={this.checkToken}>
						Check Code
					</button>
				</div>
			)
		}
		// Enter New Passwords State
		else if (this.state.currentState === 2) {
	
			if (this.state.networkError) {
				
			}
			if (this.state.passwordError) {
				
			}
	
			currentMessage = [
				<div className="row" key={1}> 
					<div className="col">
						<p> Enter your new password! </p>
					</div>
				</div>
			]
			if (this.state.passwordsSameError) {
				currentMessage.push(
					<div className="row" key={2}> 
						<div className="col">
							<p className="text-danger"> Passwords do not match! </p>
						</div>
					</div>
				)
			}

			currentField = [
				( 
					<div className="row" key={3}> 
						<div className="col">
							<div className='form-group'>
								<input type='password' className='form-control' value={this.state.password1} onChange={this.pass1FieldChange} placeholder='Enter Password' />
							</div>
						</div>
					</div>
				),
				(
					<div className="row" key={4}> 
						<div className="col">
							<div className='form-group'>
								<input type='password' className='form-control' value={this.state.password2} onChange={this.pass2FieldChange} placeholder='Re-enter Password' />
							</div>
						</div>
					</div>	
				)
			]
			currentButton = (
				<div className="row"> 
					<div className="col">
						<button className="btn btn-primary" onClick={this.submitPasswords}>
							Submit
						</button>
					</div>
				</div>
			)
		}
		// Thank You State
		else if (this.state.currentState === 3) {
			currentMessage = (
				<div className="row"> 
					<div className="col">
						<p> Password has been successfullty reset! </p>
					</div>
				</div>
			)
			currentField = null

			currentButton = (
				<div className="row"> 
					<div className="col">
						<button className="btn btn-primary" onClick={this.goSignIn}>
							Sign In!
						</button>
					</div>
				</div>
			)
		}
		
		//let showIdle = this.state.sendEmailState === 0
		let showWaiting = this.state.sendEmailState === 1 || this.state.validateCodeState === 1 || this.state.submitPasswordState === 1
		let showSuccess = this.state.sendEmailState === 2 || this.state.validateCodeState === 2 || this.state.submitPasswordState === 2
		let showError = this.state.sendEmailState === 3 || this.state.validateCodeState === 3 || this.state.submitPasswordState === 3

		return (
			<div className='container-sm'>
				
				<div className="row">
					<div className="col">
						<h3> Forgot your password? </h3>
					</div>
				</div>

				{/*Change to proper Submit Form...*/}
				{currentMessage}
				{currentField}
				{currentButton}
				
				<Alert show={showWaiting} variant="warning">
					<Alert.Heading>Waiting</Alert.Heading>
					<hr />
					<p>
					  Waiting for server response for submission...
					</p>
					<hr />
				</Alert>
				
				<Alert show={showSuccess} variant="success">
					<Alert.Heading>Waiting</Alert.Heading>
					<hr />
					<p>
					  This should display if we got a success
					</p>
					<hr />
				</Alert>
				
				<Alert show={showError} variant="danger">
					<Alert.Heading>Error!</Alert.Heading>
					<hr />
					<p>
					  This should display if we got an error
					</p>
					<hr />
				</Alert>

			</div>
		);
	}
}

export default withRouter(forgotPassword);