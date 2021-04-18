import React from "react";

import { withRouter} from "react-router-dom";

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
        };
	}
	
	forceLogout = () => {
		// Gonna do this like this, in case we got something else we wana do on logout...
		this.props.forceLogout()
		this.props.history.push(this.props.reRouteTarget);
	}
	
	// Wait, are Usernames a good thing for what we are doing? Hmmmm
	tokenFieldChange = (event) => {
		this.setState( {token: event.target.value} )
	}
	gotoDash = () => {
		this.props.history.push(this.props.reRouteSuccessTarget)
	}
	
	handleVerifyCallback = (incomingStatus, incomingData) => {
		if (incomingStatus === 200) {
			// Successful verification!!
			console.log("Successful Verification!")
			this.setState({
				done:true,
			})
			
		}
	}
	// Data is mostly used for error displaying here honestly
	handleVerifyFailure = (incomingStatus, incomingData) => {
		if (incomingStatus === 400) {
			for (let index in incomingData) {
				if (index === "status") {
					this.setState({
						tokenError:true,
						tokenErrorDetail:incomingData[index]
					})
				}
			}
		}
	}
	handleVerifySubmit = (event) => {
		
		APIValidateAccount(this.props.APIHost, this.props.authToken, this.state.token, this.handleVerifyCallback, this.handleVerifyFailure)
		
		event.preventDefault();
	}
	
	reSendEmailCallback = () => {
		// Change this to the validator view
		this.setState({
			resend:"A new code has been sent!",
		})
		
	}
	reSendEmailFailure = (code, data) => {
		// If we fail here, we are totally boned...
		console.log("Oh no. We failed....")
		// Is it because of a login failure?
		if (code === 401) {
			this.props.forceLogout()
		}
	}
	reSendEmail = () => {
		// Now sending the validator email...
		APIResendValidator(this.props.APIHost, this.props.authToken, this.reSendEmailCallback, this.reSendEmailFailure)
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
		
		return (
			
			<div className="signUp">
				<div className="container">
					{displayBody}
				</div>
			</div>
		);
	}
}

export default withRouter(verifyEmail);