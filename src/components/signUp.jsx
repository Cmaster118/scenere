import React from "react";
import axios from "axios";

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
		this.setState( {password2: event.target.value} )
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
	
	handleSubmit = event => {
		
		if (this.state.checkField) {
			console.log("Field was not checked")
		}
		
		const data = {
			username: this.state.username,
			
			password: this.state.password,
			password2: this.state.password2,
			
			email: this.state.email,
			
			first_name: this.state.firstName,
			last_name: this.state.firstName,
		};
		
		//DISABLE SIGNUP FOR NOW
		
		//console.log(data)

		/*axios.post("http://10.0.0.60:8000/registerUser/", data )
		.then( res => { 
			this.setState({ latestAttept: 200 })
			console.log("Success")
		})
		.catch( err => {
			// Change this depending on the error...
			this.setState({ latestAttept: 400 })
			console.log(err)
			console.log("Connection failed...")
		})*/

		event.preventDefault();
	}
	
	render() {
		return (
		
			<div className="container">
				<form  onSubmit={this.handleSubmit}>
					<h3>Sign Up</h3>
					
					<div className='form-group'>
						<label>Username</label>
						<input type='text' className='form-control' value={this.state.username} onChange={this.usernameFieldChange} placeholder='Enter Username' />
					</div>
					
					<div className='form-group'>
						<label>Email Address</label>
						<input type='email' className='form-control' value={this.state.email} onChange={this.emailFieldChange} placeholder='Enter email' />
					</div>
					
					<div className='form-group'>
						<label>Password</label>
						<input type='password' className='form-control' value={this.state.password} onChange={this.passFieldChange} placeholder='Enter password' />
					</div>
					
					<div className='form-group'>
						<label>Confirm Password</label>
						<input type='password' className='form-control' value={this.state.password2} onChange={this.pass2FieldChange} placeholder='Confirm password' />
					</div>
					
					<div className='form-group'>
						<label>First Name</label>
						<input type='text' className='form-control' value={this.state.firstName} onChange={this.firstNameFieldChange} placeholder='First Name' />
					</div>
					
					<div className='form-group'>
						<label>Last Name</label>
						<input type='text' className='form-control' value={this.state.lastName} onChange={this.lastnameFieldChange} placeholder='Last Name' />
					</div>

					<div className='form-group'>
						<input type='checkbox' className='form-control-input' id='customCheck1' value={this.state.checkField} onChange={this.checkFieldChange} />
						<label className='form-control-label' htmlFor='customCheck1' >Legal stuff? Not sure...</label>
					</div>
					
					<button type='submit' className='btn btn-dark btn-block'>Submit</button>
					
					<p className='forgot-password text-right text-dark'>
						<a href='10.0.0.60:3000'>Already Registered?</a>
					</p>
							
				</form>
			
			</div>
		);
	}
}

export default signup;