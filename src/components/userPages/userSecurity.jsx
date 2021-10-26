import React from "react";

import { withRouter } from "react-router-dom";
import { Alert, Accordion, Card } from 'react-bootstrap';
import { APIChangeUserEmail, APIChangeUserName, APIChangeUserPassword, APIGetUserDetails } from "../../utils";

import { ChevronDown } from 'react-bootstrap-icons';

const debugPageName = "User Security"

class SecurityPages extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			
			currentEmail: "No Data!",
			currentFirstName: "No Data!",
			currentLastName: "No Data!",
			
			newEmail: "",
			newFirstName: "",
			newLastName: "",
			
			oldPassword: [],
			newPassword: [],
			newPassword2: [],
			
			getCurrentDataStatus: 0,
			
			changePasswordStatus: 0,
			changeNameStatus: 0,
			changeEmailStatus: 0,
			
			getCurrentDataError: [],
			changeGeneralError: [],
			
			oldPasswordError: false,
			newPasswordError: false,
			
			newPasswordErrorMessage: "New Password Error Stuff",
		}
	}
	
	componentDidMount() {
		//this.getCurrentData()
	}
	
	oldPasswordChange = (event) => {
		this.setState({
			oldPassword: event.target.value,
			oldPasswordError: false,
		})
	}
	newPasswordChange = (event) => {
		this.setState({
			newPassword: event.target.value,
			newPasswordError: false,
		})
	}
	newPassword2Change = (event) => {
		this.setState({	
			newPassword2: event.target.value,
			newPasswordError: false,
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
			this.props.debugSet(debugPageName, "Refresh Triggered", "Get User Details")
			this.props.refreshToken(this.getCurrentData)
			return
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
		
		this.props.debugSet(debugPageName, "Get Security Data", "Failure")
		returnData = responseData['messages']
		this.setState({
			getCurrentDataError: returnData,
			getCurrentDataStatus: 3,
		})
	}
	getDataSuccess = (successData) => {
		//console.log("Data Success")
		//console.log(successData)
		
		this.props.debugSet(debugPageName, "Get Security Data", "Success")
		this.setState({
			
			getCurrentDataStatus: 2,
		})
	}
	getCurrentData = () => {
		APIGetUserDetails( this.getDataSuccess, this.getDataFailure )
		this.setState({
			getCurrentDataStatus: 1,
		})
	}
	
	changeEmailFailure = (responseData) => {
		let returnData = []
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.changeEmail)
			this.props.debugSet(debugPageName, "Refresh Triggered", "Change Email")
			return
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
		
		this.props.debugSet(debugPageName, "Change Email", "Failure")
		returnData = responseData['messages']
		// Show some error
		this.setState({
			changeGeneralError: returnData,
			changeEmailStatus: 3,
		})
	}
	changeEmailSuccess = (successData) => {
		// Set some sort of success!?
		
		this.props.debugSet(debugPageName, "Change Email", "Success")
		this.setState({
			changeEmailStatus: 2,
		})
	}
	changeEmail = () => {
		
		// Verify first...
		if (false) {
			APIChangeUserEmail(  this.state.newEmail, this.changeEmailSuccess, this.changeEmailFailure )
			this.setState({
				newEmail: "",
				changeEmailStatus: 1,
			})
		}
	}
	
	changeNameFailure = (responseData) => {
		let returnData = []
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.changeName)
			this.props.debugSet(debugPageName, "Refresh Triggered", "Change Name")
			return
		}
		
		this.props.debugSet(debugPageName, "Change Name", "Failure")
		returnData = responseData['messages']
		// Show some error
		this.setState({
			changeGeneralError: returnData,
			changeNameStatus: 3,
		})
	}
	changeNameSuccess = (successData) => {
		this.props.debugSet(debugPageName, "Change Name", "Success")
		this.setState({
			changeNameStatus: 2,
		})
	}
	changeName = () => {
		APIChangeUserName(  this.state.newFirstName, this.state.newLastName, this.changeNameSuccess, this.changeNameFailure )
		this.setState({
			newFirstName: "",
			newLastName: "",
			changeNameStatus: 1,
		})
	}
	
	changePasswordFailure = (responseData) => {
		
		let oldPassErr = false
		let newPassErr = false
		let newPassErrMess = ""
		
		//let returnData = []
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Change Password")
			this.props.refreshToken(this.changePassword)
			return
		}
		else if (responseData["action"] === 3) {
			//Hmmmmm
			for (let check in responseData['messages']) {
				if (responseData['messages'][check]["mod"] === 2) {
					newPassErr = true
					newPassErrMess = responseData['messages'][check]["text"]
				}
			}
		}
		else if (responseData["action"] === 6) {
			// OUR SPECIAL 404 ERROR?!?!?!
			oldPassErr = true
		}
		
		this.props.debugSet(debugPageName, "Change Password", "Failure")
		//returnData = responseData['messages']
		// Show some error
		this.setState({
			oldPasswordError: oldPassErr,
			newPasswordError: newPassErr,
			newPasswordErrorMessage: newPassErrMess,
			changePasswordStatus: 3,
		})
	}
	changePasswordSuccess = (successData) => {
		this.props.debugSet(debugPageName, "Change Password", "Success")
		this.setState({
			oldPassword: "",
			newPassword: "",
			newPassword2: "",
			oldPasswordError: false,
			newPasswordError: false,
			changePasswordStatus: 2,
		})
	}
	changePassword = () => {
		if (this.state.newPassword.length < 8 || this.state.newPassword2 < 8) {
			// Wrong! Too Short!
			//console.log("Wrong! Too Short!")
			this.setState({
				newPasswordError: true,
				newPasswordErrorMessage: "Passwords are too short!",
			})
			return
		}
		
		if (this.state.newPassword !== this.state.newPassword2) {
			//Wrong! Cant do it! Send that they dont match!
			//console.log("Wrong! Dont Match!")
			this.setState({
				newPasswordError: true,
				newPasswordErrorMessage: "Passwords do not match!",
			})
			return
		}
		
		APIChangeUserPassword(  this.state.oldPassword, this.state.newPassword, this.state.newPassword2, this.changePasswordSuccess, this.changePasswordFailure )
		this.setState({
			oldPasswordError: false,
			newPasswordError: false,
			changePasswordStatus: 1,
		})
	}
	//data-dismiss="modal"
	render() {
		
		let emailClass = 'form-control'
		//if (this.state.emailError) {
		//	emailClass += ' bg-warning'
		//}
		
		let oldPasswordClass = 'form-control'
		if (this.state.oldPasswordError) {
			oldPasswordClass += ' bg-warning'
		}

		let passwordClass = 'form-control'
		if (this.state.newPasswordError) {
			passwordClass += ' bg-warning'
		}

		//let showIdle = this.state.getCurrentDataStatus === 0 || this.state.changeGeneralStatus === 0
		let showWaiting = this.state.getCurrentDataStatus === 1 //|| this.state.changeGeneralStatus === 1
		let showSuccess = this.state.changePasswordStatus === 2 //this.state.getCurrentDataStatus === 2
		let showError = this.state.getCurrentDataStatus === 3// || this.state.changePasswordStatus === 3

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
										<Accordion>
											<Accordion.Toggle as={Card.Header} className="border btn btn-outline-dark btn-block" variant="link" eventKey="email">
												<div className="row">
													<div className="col-1">

													</div>
													<div className="col">
														Change Email
													</div>
													<div className="col-1">
														<ChevronDown />
													</div>
												</div>
											</Accordion.Toggle>
											
											<Accordion.Collapse className="border" eventKey="email">
												{/*
												<div>
													<div className="row mx-1 mb-0 mt-3">
														<div className="col">
															<label>
																<h5><u>{"Current Email: "}</u></h5>
															</label>
														</div>
													</div>
													<div className="row mx-3">
														<div className="col border">
															<div className="my-1">
																{this.state.currentEmail}
															</div>
														</div>
													</div>
													<div className="row mx-1 my-3">
														<div className="col">
															<div className='form-group'>
																<label><h5><u>New Email</u></h5></label>
																<input type='email' className={emailClass} value={this.state.newEmail} onChange={this.newEmailChange} placeholder='Enter Email' />
															</div>
														</div>
													</div>
													<div className="row mx-1 my-3">
														<div className="col">
															<button type="button" className="btn btn-outline-primary disabled" onClick={this.changeEmail}>Change Email</button>
														</div>
													</div>
												</div>
												*/}
												<div>
													<div className="row">
														<div className="col">
															Under Construction!
														</div>
													</div>
												</div>
											</Accordion.Collapse>
											
											<Accordion.Toggle as={Card.Header} className="border btn btn-outline-dark btn-block" variant="link" eventKey="user">
												
												<div className="row">
													<div className="col-1">

													</div>
													<div className="col">
														Change Username
													</div>
													<div className="col-1">
														<ChevronDown />
													</div>
												</div>
											</Accordion.Toggle>
										
											<Accordion.Collapse className="border" eventKey="user">
												<div>
													<div className="row">
														<div className="col">
															Under Construction!
														</div>
													</div>
												</div>
											</Accordion.Collapse>
										
											<Accordion.Toggle as={Card.Header} className="border btn btn-outline-dark btn-block" variant="link" eventKey="open">
												<div className="row">
													<div className="col-1">

													</div>
													<div className="col">
														Change Password
													</div>
													<div className="col-1">
														<ChevronDown />
													</div>
												</div>
											</Accordion.Toggle>
											
											<Accordion.Collapse className="border" eventKey="open">
												<div>
													<div className='form-group m-3'>
														<label><h5><u>Old Password</u></h5></label>
														<input type='password' className={oldPasswordClass} value={this.state.oldPassword} onChange={this.oldPasswordChange} placeholder='Enter password' />
														<p className="text-danger">{this.state.oldPasswordError ? "Invalid Password!":""}</p>
													</div>
													<div className='form-group m-3'>
														<label><h5><u>New Password</u></h5></label>
														<input type='password' className={passwordClass} value={this.state.newPassword} onChange={this.newPasswordChange} placeholder='Enter password' />
													</div>
													<div className='form-group m-3'>
														<label><h5><u>New Password (again)</u></h5></label>
														<input type='password' className={passwordClass} value={this.state.newPassword2} onChange={this.newPassword2Change} placeholder='Enter password' />
														<p className="text-danger">{this.state.newPasswordError ? this.state.newPasswordErrorMessage:""}</p>
													</div>
													<button type="button" className="mb-3 btn btn-outline-primary" onClick={this.changePassword}>Change Password</button>
												</div>
											</Accordion.Collapse>
											
										</Accordion>
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
					
			</div>
		)
	}
}

export default withRouter(SecurityPages);