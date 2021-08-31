import React from "react";

import { withRouter} from "react-router-dom";
import { Alert } from 'react-bootstrap';
import { APIValidateAccount, APIResendValidator } from "../../utils";

class verifyEmail extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			// You need to enter a token from the email address...
			// The user will also NEED to be logged in at this point in order for this to work...
			// User will be redirected to this page if they are not active...
			// And ALL API CALLS WILL FAIL! Unless they enter this code correctly, before it expires
			token: '',
			tokenError:false,
			tokenErrorDetail:'???',
			
			done:false,
			
			resend:"",
			
			validateStatus: 0,
			sendEmailStatus: 0,
        };
	}
	
	// Wait, are Usernames a good thing for what we are doing? Hmmmm
	tokenFieldChange = (event) => {
		this.setState( {token: event.target.value} )
	}
	gotoDash = () => {
		this.props.history.push(this.props.reRouteSuccessTarget)
	}
	
	// Data is mostly used for error displaying here honestly
	handleVerifyFailure = (responseData) => {
		
		let tokenErrorFlag = false
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
				if (responseData['messages'][index]['mod'] === 1) {
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
			tokenError:tokenErrorFlag,
			tokenErrorDetail:tokenErrorDetails,
			
			validateStatus: 3,
		})
	}
	handleVerifyCallback = (incomingStatus, incomingData) => {
		if (incomingStatus === 200) {
			// Successful verification!!
			console.log("Successful Verification!")
			this.setState({
				done:true,
				validateStatus: 2,
			})
			
		}
	}
	handleVerifySubmit = (event) => {
		
		APIValidateAccount( this.state.token, this.handleVerifyCallback, this.handleVerifyFailure)
		
		this.setState({
			validateStatus: 1,
		})
		
		event.preventDefault();
	}
	
	reSendEmailFailure = (responseData) => {
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Invalid Permissions
		else if (responseData["action"] === 2) {
			this.props.refreshToken( this.reSendEmail )
		}
		// Bad Request
		else if (responseData["action"] === 3) {

		}
		// Server Exploded Error
		else if (responseData["action"] === 4) {

		}
		// Unknown Error
		else if (responseData["action"] === 5) {

		}
		
		this.setState({
			sendEmailStatus: 3,
		})
	}
	reSendEmailCallback = () => {
		// Change this to the validator view
		this.setState({
			resend:"A new code has been sent!",
			sendEmailStatus: 2,
		})
		
	}
	reSendEmail = () => {
		// Now sending the validator email...
		APIResendValidator( this.reSendEmailCallback, this.reSendEmailFailure)
		this.setState({
			sendEmailStatus: 1,
		})
	}
	
	render() {
		
		let tokenClass = 'form-control'
		if (this.state.tokenError) {
			tokenClass += ' bg-warning'
		}
		
		let displayBody = []
		if (!this.state.done) {
			displayBody = (
				<div>			
					<div className="row">
						<div className="col">
							<h3>Activate your account</h3>
						</div>
					</div>	
					<form onSubmit={this.handleVerifySubmit}>
						<div id="align-left">
							<div className="row">
								<div className="col">
									<p> Check your email, you should have received a code, enter it here and your account will be activated!</p>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className='form-group'>
										<label id="label-left">Enter token here:</label>
										<input type='text' className={tokenClass} value={this.state.username} onChange={this.tokenFieldChange} placeholder='Token' />
										<p className="text-danger">{this.state.tokenError ? this.state.tokenErrorDetail:""}</p>
									</div>
								</div>
							</div>
							<div className="row my-2">
								<div className="col">		
									<button type='submit' className='btn btn-dark btn-block'>Submit</button>
								</div>
							</div>
						</div>		
					</form>
					<div className="row my-2">
						<div className="col">
							<button onClick={this.reSendEmail} className='btn btn-dark btn-block'>Re-send Activation code</button>
						</div>
					</div>	
					<div className="row my-2">
						<div className="col">
							{this.state.resend}
						</div>
					</div>
				</div>
			)
		}
		else {
			displayBody = (
				<div>
					<div className="row">
						<div className="col">
							<h3>Thank you!</h3>
							<p>Account has been activated! Press here to go to the dashboard:</p>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<button className="btn btn-dark" onClick={this.gotoDash}>To the Dashboard!</button>
						</div>
					</div>
				</div>
			)
		}
		
		//let showIdle = this.state.validateStatus === 0 || this.state.sendEmailStatus === 0
		let showWaiting = this.state.validateStatus === 1 || this.state.sendEmailStatus === 1
		let showSuccess = this.state.validateStatus === 2 || this.state.sendEmailStatus === 2
		let showError = this.state.validateStatus === 3 || this.state.sendEmailStatus === 3
		
		return (
			
			<div className="signUp">
				<div className="container">
					{displayBody}
					
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
			</div>
		);
	}
}

export default withRouter(verifyEmail);