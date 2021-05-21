import React from "react";

import { withRouter } from "react-router-dom";
import { APIChangeUserEmail, APIChangeUserName, APIChangeUserPassword, APIGetUserDetails } from "../../utils";

class SecurityPages extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			
			currentEmail: "",
			currentFirstName: "",
			currentLastName: "",
			
			newEmail: "",
			newFirstName: "",
			newLastName: "",
			
			oldPassword: [],
			newPassword: [],
			newPassword2: [],
		}
	}
	
	componentDidMount() {
		this.getCurrentData()
	}
	
	oldPasswordChange = (event) => {
		this.setState({
			oldPassword: event.target.value,
		})
	}
	newPasswordChange = (event) => {
		this.setState({
			newPassword: event.target.value,
		})
	}
	newPassword2Change = (event) => {
		this.setState({
			newPassword2: event.target.value,
		})
	}
	newEmailChange = (event) => {
		this.setState({
			newEmail: event.target.value,
		})
	}
	newNewFirstChange = (event) => {
		this.setState({
			newFirstName: event.target.value,
		})
	}
	newLastNameChange = (event) => {
		this.setState({
			newLastName: event.target.value,
		})
	}

	getDataSuccess = (successData) => {
		console.log("Data Success")
		console.log(successData)
	}
	getDataFailure = (errorCodes, errorMessages) => {
		console.log("Data Failure")
		console.log(errorCodes)
		console.log(errorMessages)
	}
	getCurrentData = () => {
		APIGetUserDetails( this.props.APIHost, this.props.authToken, this.getDataSuccess, this.getDataFailure )
	}
	
	changeGeneralSuccess = (successData) => {
		console.log("Update Success")
		console.log(successData)
		// Set some sort of success!?
		
	}
	changeGeneralFailure = (errorCodes, errorMessages) => {
		console.log("Update Failure")
		console.log(errorCodes)
		console.log(errorMessages)
		// Show some error
	}
	changeEmail = () => {
		// Verify first...
		APIChangeUserEmail( this.props.APIHost, this.props.authToken, this.state.newEmail, this.changeGeneralSuccess, this.changeGeneralFailure )
		this.setState({
			newEmail: "",
		})
	}
	
	changeName = () => {
		APIChangeUserName( this.props.APIHost, this.props.authToken, this.state.newFirstName, this.state.newLastName, this.changeGeneralSuccess, this.changeGeneralFailure )
		this.setState({
			newFirstName: "",
			newLastName: "",
		})
	}
	
	changePassword = () => {
		APIChangeUserPassword( this.props.APIHost, this.props.authToken, this.state.oldPassword, this.state.newPassword, this.state.newPassword2, this.changeGeneralSuccess, this.changeGeneralFailure )
		this.setState({
			oldPassword: "",
			setNewPassword: "",
			setNewPassword2: "",
		})
	}
	
	render() {
		
		let emailClass = 'form-control'
		//if (this.state.emailError) {
		//	emailClass += ' bg-warning'
		//}

		let passwordClass = 'form-control'
		//if (passwordError) {
		//	passwordClass += ' bg-warning'
		//}
		
		return (
			<div className="userSecurty">
				<div className="container">
				
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Edit User Security Details</h5>
								</div>
								<div className="card-body">
									<div className="list-group">
										<div className="list-group-item">
											<div>
												{this.state.currentEmail}
											</div>
											<button className="btn btn-primary" data-toggle="modal" data-target="#changeEmailModal">
												Change Email
											</button>
										</div>
										<div className="list-group-item">
											<div>
												{this.state.currentFirstName + " " + this.state.currentLastName}
											</div>
											<button className="btn btn-primary" data-toggle="modal" data-target="#changeNameModal">
												Change Name
											</button>
										</div>
										<div className="list-group-item">
											<button className="btn btn-primary" data-toggle="modal" data-target="#changePasswordModal">
												Change Password
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						
					</div>
				</div>
				
				<div className="modal fade" id="changeEmailModal" tabIndex="-1" role="dialog" aria-labelledby="changeEmailModal" aria-hidden="true">
					  <div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
						  <div className="modal-header">
							<h5 className="modal-title" id="deleteTitleConfirm">Change Email</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							  <span aria-hidden="true">&times;</span>
							</button>
						  </div>
						  <div className="modal-body">
						  {/*
								<div className='form-group'>
									<label id="align-left">{"Current Email: " + this.state.currentEmail}</label>
								</div>
	*/}
								<div className='form-group'>
									<label id="align-left">New Email</label>
									<input type='email' className={emailClass} value={this.state.newEmail} onChange={this.newEmailChange} placeholder='Enter Email' />
								</div>
						  </div>
						  <div className="modal-footer">
							<button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={this.changeEmail}>Change Email</button>
							<button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
						  </div>
						</div>
					  </div>
					</div>
					
					<div className="modal fade" id="changeNameModal" tabIndex="-1" role="dialog" aria-labelledby="changeNameModal" aria-hidden="true">
					  <div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
						  <div className="modal-header">
							<h5 className="modal-title" id="deleteTitleConfirm">Change Name</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							  <span aria-hidden="true">&times;</span>
							</button>
						  </div>
						  <div className="modal-body">
						  {/*<div className='form-group'>
									<label id="align-left">{"Current name: " + this.state.currentFirstName + " " + this.state.currentLastName}</label>
							</div> */}
								<div className='form-group'>
									<label id="align-left">New First Name</label>
									<input type='text' className={emailClass} value={this.state.newFirstName} onChange={this.newNewFirstChange} placeholder='Enter New First Name' />
								</div>
								<div className='form-group'>
									<label id="align-left">New Last Name</label>
									<input type='text' className={emailClass} value={this.state.newLastName} onChange={this.newLastNameChange} placeholder='Enter New Last Name' />
								</div>
						  </div>
						  <div className="modal-footer">
							<button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={this.changeName}>Change Name</button>
							<button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
						  </div>
						</div>
					  </div>
					</div>
					
					<div className="modal fade" id="changePasswordModal" tabIndex="-1" role="dialog" aria-labelledby="changePasswordModal" aria-hidden="true">
					  <div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
						  <div className="modal-header">
							<h5 className="modal-title" id="deleteTitleConfirm">Change Password</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							  <span aria-hidden="true">&times;</span>
							</button>
						  </div>
						  <div className="modal-body">
								<div className='form-group'>
									<label id="align-left">Old Password</label>
									<input type='password' className={passwordClass} value={this.state.oldPassword} onChange={this.oldPasswordChange} placeholder='Enter password' />
								</div>
								<div className='form-group'>
									<label id="align-left">New Password</label>
									<input type='password' className={passwordClass} value={this.state.newPassword} onChange={this.newPasswordChange} placeholder='Enter password' />
								</div>
								<div className='form-group'>
									<label id="align-left">New Password (again)</label>
									<input type='password' className={passwordClass} value={this.state.newPassword2} onChange={this.newPassword2Change} placeholder='Enter password' />
								</div>
						  </div>
						  <div className="modal-footer">
							<button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={this.changePassword}>Change Password</button>
							<button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
						  </div>
						</div>
					  </div>
					</div>
			</div>
		)
	}
}

export default withRouter(SecurityPages);