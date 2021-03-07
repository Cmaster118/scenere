import React from "react";
import axios from "axios";

class contact extends React.Component {
	
	// Load this fromt the rest of it if we are logged in...
	constructor(props) {
        super(props);
        this.state = {
			
			firstName: '',
			lastName: '',
			
			email: '',
			company: '',
			
			content : '',
        };
	}
	
	// Wait, are Usernames a good thing for what we are doing? Hmmmm
	firstNameFieldChange = (event) => {
		this.setState( {firstName: event.target.value} )
	}
	
	lastnameFieldChange = (event) => {
		this.setState( {lastName: event.target.value} )
	}
	
	emailFieldChange = (event) => {
		this.setState( {email: event.target.value} )
	}
	
	companyFieldChange = (event) => {
		this.setState( {company: event.target.value} )
	}
	
	contentFieldChange = (event) => {
		this.setState( {content: event.target.value} )
	}
	
	handleSubmit = (event) => {

		const data = {
			
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			
			email: this.state.email,
			company: this.state.company,
			
			content: this.state.content,
			
		};
		
		//console.log(data)

		axios.post(this.props.APIHost +"/sendContactEmail/", data )
		.then( res => { 
			
			//console.log(res.data)
			//console.log(res.status)
		
			// Successfully Sent the email, can trigger something on this side
			if (res.status === 200) {

			}
		})
		.catch( err => {
			console.log(err.response.status)
			console.log(err.response.data)
		})

		event.preventDefault();
	}
	
	render() {
		return (
		
			<div className="container">
				<form  onSubmit={this.handleSubmit}>
					<div className="row">
						<div className="col">
							<h3>Contact Us</h3>
						</div>
					</div>
					<div className="row">
						<div className="col">					
							<div className='form-group'>
								<label>First Name</label>
								<input type='text' className='form-control' value={this.state.firstName} onChange={this.firstNameFieldChange} placeholder='First Name' />
							</div>
						</div>
						<div className="col">	
							<div className='form-group'>
								<label>Last Name</label>
								<input type='text' className='form-control' value={this.state.lastName} onChange={this.lastnameFieldChange} placeholder='Last Name' />
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col">					
							<div className='form-group'>
								<label>Email Address</label>
								<input type='email' className='form-control' value={this.state.email} onChange={this.emailFieldChange} placeholder='Enter email' />
							</div>
						</div>
						<div className="col">	
							<div className='form-group'>
								<label>Company</label>
								<input type='text' className='form-control' value={this.state.company} onChange={this.companyFieldChange} placeholder='Company Name' />
							</div>
						</div>
					</div>
					
					<div className="row">
						<div className="col">	
							<div className='form-group'>
								<label>Content</label>
								<textarea  type='text' className='form-control' value={this.state.content} onChange={this.contentFieldChange} placeholder='Content' />
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
		);
	}
}

export default contact;