import React from "react";
import axios from "axios";

import { withRouter } from 'react-router-dom';

//import { withRouter } from 'react-router-dom'

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
			latestAttepmt: 0,
		  
			username: '',
			
			// This needs to be hashed as fast as possible...
			// But I will worry about security...
			// Just note that this is probobly a bad idea...
			password: '',
			
			remember: false,
			
        };
		
		//this.props.tokenSetter()
	}
	
	componentDidMount() {
		this.loadFromCookies();
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
	
	handleSubmit = event => {
		//console.log("Login Triggered")
		
		// THIS IS TERRIBLE SECIRTY! WILL SECURE THE PASSWORD IN PLAIN TEXT!
		if(this.state.remember) {
			Store.set('rememberUser', {user:this.state.username , pass: this.state.password })
			console.log("User data Stored")
		}
		
		const data = {
			username: this.state.username,
			password: this.state.password
		};
		
		//console.log(data)

		axios.post("http://10.0.0.60:8000/apiTokenAuth/", data )
		.then( res => { 
			this.setState({ latestAttept: 200 })
			const result = this.props.tokenSetter( res.data.token, this.state.username )
			console.log("Success")
			
			if (result) {
				console.log("Token registered")
				
				// Change this to a dashboard lookin thing
				this.props.history.push('/company')
			}
			else {
				console.log("Token Failed..?")
			}
		})
		.catch( err => {
			// Change this depending on the error...
			this.setState({ latestAttept: 400 })
			console.log(err)
			console.log("Connection failed...")
		})

		event.preventDefault();
	}
	
	render() {
	
		return (
			<div className='container'>
				<form onSubmit={this.handleSubmit} >
					<h3>Sign In</h3>
					
					<div className='form-group'>
						<label>Email Address</label>
						<input type='text' className='form-control' value={this.state.username} onChange={this.userFieldChange} placeholder='Enter email' />
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
						
						<p className='col forgot-password text-left text-dark'>
							<a href='10.0.0.60:3000'>Sign Up</a>
						</p>
							
						<p className='col forgot-password text-right text-dark'>
							<a href='10.0.0.60:3000'>Forgot password?</a>
						</p>

					</div>

				</form>
			</div>
		);
	}
}

export default withRouter(signIn);