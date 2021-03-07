import React from "react";

import { withRouter } from 'react-router-dom';

class forgotPassword extends React.Component {
		
	constructor(props) {
        super(props);
        this.state = {

			email: '',

			resetToken: '',

			currentState: 0,

			password1:'',
			password2:'',

			passwordsSame: false
						
        };
		
	}

	componentDidMount() {
		this.setState( 
			{email: '',
			resetToken: '',
			password1: '',
			password2: ''},
		)
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

	sendEmail = () => {
		this.setState( {currentState: 1} )
	}

	checkValue = () => {
		this.setState( {currentState: 2} )
	}

	checkPasswords = () => {
		// I can use the API for this...
		if (this.arePasswordsSame()) {
			this.setState( {currentState: 3} )
		}
	}


	emailFieldChange = (event) => {
		this.setState( {email: event.target.value} )
	}

	tokenFieldChange = (event) => {
		this.setState( {resetToken: event.target.value} )

		this.arePasswordsSame()
	}
	
	pass1FieldChange = (event) => {
		this.setState( {password1: event.target.value} )

		//this.arePasswordsSame()
	}

	pass2FieldChange = (event) => {
		this.setState( {password2: event.target.value} )

		this.arePasswordsSame()
	}


	render() {

		let currentField = null
		let currentButton = null
		let currentMessage = null

		if (this.state.currentState === 0) {
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
							<input type='text' className='form-control' value={this.state.email} onChange={this.emailFieldChange} placeholder='Enter email' />
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
		else if (this.state.currentState === 1) {

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
					<button className="btn btn-primary" onClick={this.checkValue}>
						Check...
					</button>
				</div>
			)
		}
		else if (this.state.currentState === 2) {
	
			currentMessage = [
				<div className="row"> 
					<div className="col">
						<p> Enter your new password! </p>
					</div>
				</div>
			]
			if (!this.arePasswordsSame()) {
				currentMessage.push(
					<div className="row"> 
						<div className="col">
							<p className="text-danger"> Passwords do not match! </p>
						</div>
					</div>
				)
			}

			currentField = [
				( 
					<div className="row"> 
						<div className="col">
							<div className='form-group'>
								<input type='text' className='form-control' value={this.state.resetToken} onChange={this.pass1FieldChange} placeholder='Enter Password' />
							</div>
						</div>
					</div>
				),
				(
					<div className="row"> 
						<div className="col">
							<div className='form-group'>
								<input type='text' className='form-control' value={this.state.resetToken} onChange={this.pass2FieldChange} placeholder='Re-enter Password' />
							</div>
						</div>
					</div>	
				)
			]
			currentButton = (
				<div className="row"> 
					<div className="col">
						<button className="btn btn-primary" onClick={this.checkPasswords}>
							Check...
						</button>
					</div>
				</div>
			)
		}
		else if (this.state.currentState === 2) {
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

		return (
			<div className='container-sm'>
				<div className="row">
					<div className="col">
						<h3> Forgot your password? </h3>
					</div>
				</div>

				{currentMessage}
				{currentField}
				{currentButton}

			</div>
		);
	}
}

export default withRouter(forgotPassword);