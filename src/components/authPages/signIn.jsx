import React from "react";

import { Link, withRouter } from 'react-router-dom';

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
			currentState: 0,

			// This can take in the response code?
			// Or Data?
			lastAttemptCode: -1,
			lastAttemptMessage: "",
			
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
	
	userFieldChange = (event) => {
		this.setState({
			username: event.target.value,
		
			// Reset Errors
			usernameError: false,
			passwordError: false,
			isWrongError: false,
			networkError: false,			
			miscError: false,
		})
	}
	
	passFieldChange = (event) => {
		this.setState({
			password: event.target.value,
			
			// Reset Errors
			usernameError: false,
			passwordError: false,
			isWrongError: false,
			networkError: false,			
			miscError: false,
		})
	}
	
	remFieldChange = (event) => {

		this.setState({
			remember: !this.state.remember,
			
			// Reset Errors
			usernameError: false,
			passwordError: false,
			isWrongError: false,
			networkError: false,			
			miscError: false,
		})
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
			console.log("Token Set on OUR END Failed..?")
		}
	}
	// Alrighty, so error code, lets simplify it to simply hardcoding the errors that can come out of the API call
	// Just in order, so:
	// 0 = Network Error
	// 1 = username blank Error
	// 2 = password blank Error
	// 3 = Credentials are wrong error
	// Other = Uncaught
	handleSubmitFailure = (errorCodes, errorDatas) => {
		console.log("Connection failed...")
		
		let errorSet = [false, false, false, false]
		let extra = false
		
		for (let index in errorCodes) {
			//console.log(errorCodes)
			if (errorCodes[index] > errorSet.length) {
				extra = true
			}
			else {
				errorSet[ errorCodes[index] ] = true
			}
		}
		
		this.setState({ 
			networkError: errorSet[0],	
			usernameError: errorSet[1],
			passwordError: errorSet[2],
			isWrongError: errorSet[3],
					
			miscError: extra,
		})
	}
	handleSubmit = event => {
		
		APISignIn(this.props.APIHost, this.state.username, this.state.password, this.handleSubmitSuccess, this.handleSubmitFailure)
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
			</div>
		);
	}
}

export default withRouter(signIn);