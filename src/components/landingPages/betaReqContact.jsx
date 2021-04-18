import React from "react";
import {APIBetaSignEmail} from "../../utils";

class contact extends React.Component {
	
	// Load this fromt the rest of it if we are logged in...
	constructor(props) {
        super(props);
        this.state = {
			email: '',
        };
	}
	
	emailFieldChange = (event) => {
		this.setState( {email: event.target.value} )
	}
	
	callbackSuccess = () => {
		
	}
	callbackFailure = () => {
		
	}	
	handleSubmit = (event) => {

		APIBetaSignEmail(this.props.APIHost, this.state.email, this.callbackSuccess, this.callbackFailure)

		event.preventDefault();
	}
	
	render() {
		return (
		
			<div id="contact">
				<div className="container">
					<div className="row">
						<div className="col">
							<div>
								<h2>
									Beta Request
								</h2>
								<p>
									Interested in beta testing? Enter you email below
								</p>
							</div>
						</div>
					</div>
				
					<form onSubmit={this.handleSubmit}>
						<div className="row">
							<div className="col">					
								<div className='form-group'>
									<input type='email' className='form-control' value={this.state.email} onChange={this.emailFieldChange} placeholder='Enter email' />
								</div>
							</div>
							{/*					</div>
							<div className="row"> */}
							<div className="col">
								<label></label>
								<button type='submit' className='btn btn-dark btn-block'>Send!</button>
							</div>
						</div>
					</form>
					
				</div>
			</div>
		);
	}
}

export default contact;