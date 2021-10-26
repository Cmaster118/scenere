import React from "react";
import {APIContactUsEmail} from "../../utils";

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
			
			emailContactState: 0,
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
	
	callbackFailure = () => {
		this.setState({
			emailContactState: 3,
		})
	}
	callbackSuccess = () => {
		this.setState({
			emailContactState: 2,
		})
	}
	handleSubmit = (event) => {
		
		// Need to do a check on if this is a valid email
		if (this.state.email === "") {
			return
		}

		APIContactUsEmail(this.state.firstName, this.state.lastName, this.state.email, this.state.company, this.state.content, this.callbackSuccess, this.callbackFailure)
		event.preventDefault();
		
		this.setState({
			emailContactState: 1,
		})
	}
	
	render() {
		return (
		
			<div id="contact">
				<div className="container">
					<div className="row">
						<div className="col">
							<div>
								<h2>
									Contact Us
								</h2>
								<p>
									Lorem ipsum dolor sit amet placerat
								</p>
							</div>
						</div>
					</div>
				
					<form onSubmit={this.handleSubmit}>
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
						
						<div className="row my-1">
							<div className="col">
								<button type='submit' className='btn btn-dark btn-block'>Send Message</button>
							</div>
						</div>	
					</form>
					
				</div>
			</div>
		);
	}
}

export default contact;