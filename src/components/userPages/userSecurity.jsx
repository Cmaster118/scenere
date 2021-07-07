import React from "react";

import { withRouter } from "react-router-dom";
import { Alert } from 'react-bootstrap';
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
			
			getCurrentDataStatus: 0,
			changeGeneralStatus: 0,
			
			getCurrentDataError: [],
			changeGeneralError: [],
		}
	}
	
	componentDidMount() {
		//this.getCurrentData()
	}
	
	forceLogout = () => {
		// Gonna do this like this, in case we got something else we wana overwrite
		this.props.logout()
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

	getDataFailure = (responseData) => {
		let returnData = []
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.forceLogout()
		}
		// Invalid Permissions
		else if (responseData["action"] === 2) {

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
		
		returnData = responseData['messages']
		this.setState({
			getCurrentDataError: returnData,
			getCurrentDataStatus: 3,
		})
	}
	getDataSuccess = (successData) => {
		//console.log("Data Success")
		//console.log(successData)
		this.setState({
			
			getCurrentDataStatus: 2,
		})
	}
	getCurrentData = () => {
		APIGetUserDetails( this.props.authToken, this.getDataSuccess, this.getDataFailure )
		this.setState({
			getCurrentDataStatus: 1,
		})
	}
	
	changeGeneralFailure = (responseData) => {
		let returnData = []
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.forceLogout()
		}
		// Invalid Permissions
		else if (responseData["action"] === 2) {

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
		
		returnData = responseData['messages']
		// Show some error
		this.setState({
			changeGeneralError: returnData,
			changeGeneralStatus: 3,
		})
	}
	changeGeneralSuccess = (successData) => {
		console.log("Update Success")
		console.log(successData)
		// Set some sort of success!?
		this.setState({
			changeGeneralStatus: 2,
		})
	}
	changeEmail = () => {
		// Verify first...
		APIChangeUserEmail( this.props.authToken, this.state.newEmail, this.changeGeneralSuccess, this.changeGeneralFailure )
		this.setState({
			newEmail: "",
			changeGeneralStatus: 1,
		})
	}
	
	changeName = () => {
		APIChangeUserName( this.props.authToken, this.state.newFirstName, this.state.newLastName, this.changeGeneralSuccess, this.changeGeneralFailure )
		this.setState({
			newFirstName: "",
			newLastName: "",
			changeGeneralStatus: 1,
		})
	}
	
	changePassword = () => {
		APIChangeUserPassword( this.props.authToken, this.state.oldPassword, this.state.newPassword, this.state.newPassword2, this.changeGeneralSuccess, this.changeGeneralFailure )
		this.setState({
			oldPassword: "",
			setNewPassword: "",
			setNewPassword2: "",
			changeGeneralStatus: 1,
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

		//let showIdle = this.state.getCurrentDataStatus === 0 || this.state.changeGeneralStatus === 0
		let showWaiting = this.state.getCurrentDataStatus === 1 //|| this.state.changeGeneralStatus === 1
		let showSuccess = false//this.state.getCurrentDataStatus === 2 //|| this.state.changeGeneralStatus === 2
		let showError = this.state.getCurrentDataStatus === 3 //|| this.state.changeGeneralStatus === 3

		let errorParse = []
		for (let index in this.state.getCurrentDataError) {
			errorParse.push(
				this.state.getCurrentDataError[index]["text"]
			)
		}
		for (let index in this.state.changeGeneralError) {
			errorParse.push(
				this.state.changeGeneralError[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}
		
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
											<button className="btn btn-primary" data-toggle="modal" data-target="#changeEmailModal" disabled>
												Change Email
											</button>
										</div>
										<div className="list-group-item">
											<div>
												{this.state.currentFirstName + " " + this.state.currentLastName}
											</div>
											<button className="btn btn-primary" data-toggle="modal" data-target="#changeNameModal" disabled>
												Change Name
											</button>
										</div>
										<div className="list-group-item">
											<button className="btn btn-primary" data-toggle="modal" data-target="#changePasswordModal" disabled>
												Change Password
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<Alert show={showWaiting} variant="warning">
						<Alert.Heading>Waiting</Alert.Heading>
						<hr />
						<p>
						  Waiting for server response...
						</p>
						<hr />
					</Alert>
					
					<Alert show={showSuccess} variant="success">
						<Alert.Heading>Success!</Alert.Heading>
						<hr />
						<p>
						  Success!
						</p>
						<hr />
					</Alert>
					
					<Alert show={showError} variant="danger">
						<Alert.Heading>Danger!</Alert.Heading>
						<hr />
						<p>
							{errorParse}
						</p>
						<hr />
					</Alert>
					
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