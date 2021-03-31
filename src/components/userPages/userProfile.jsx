import React, { useState, useEffect } from "react";
import Store from "store"

import { withRouter } from "react-router-dom";
import { APIUserInviteCode, APIUserInvitesGet, APIUserInvitesSet, APIUserSettingsEdit, APIChangeUserEmail, APIChangeUserName, APIChangeUserPassword } from "../../utils";

const inviteType = ['Invalid', 'Admin', 'Viewer', 'Governed']

// Trying this in function form instead of class
const UserProfile = (props) => {

	const [inviteCode, setInviteCode] = useState("");
	
	const currentEmail = "Not Yet"
	const currentFirstName = "Not "
	const currentLastName = "Implemented"
	
	// Try this...
	const [newEmail, setNewEmail] = useState("");
	const [newFirstName, setNewFirstName] = useState("");
	const [newLastName, setNewLastName] = useState("");
	
	const [oldPassword, setOldPassword] = useState( [] );
	const [newPassword, setNewPassword] = useState( [] );
	const [newPassword2, setNewPassword2] = useState( [] );
	
	const [inviteIDList, setInviteIDList] = useState( [] );
	const [inviteNamesList, setInviteNamesList] = useState( [] );
	const [inviteRolesList, setInviteRolesList] = useState( [] );
	
	const [delViews, setDelViews] = useState( [] );
	const [togSends, setTogSends] = useState( [] );
	const [delGoverns, setDelGoverns] = useState( [] );
	
	useEffect(() => {    
		// Update the document title using the browser API    
		console.log("Triggered Refresh!")
		tiggerReload()
		// This should be fine, for dependancies.. as this SHOULD NOT EVER refresh...
	}, []);

	function tiggerReload() {
		getUserInvites()
	}

	function inviteSuccess(successCodes, successData) {
		console.log("Invite Success")
	}
	function inviteFailure(errorCodes, errorMessages) {
		console.log("Invite Failure")
		// Is there an even better way to do this?
		// Like, hmmm... So this is literally one line? Beause the state has to be set here...
		for (let i in errorCodes) {
			if (errorCodes[i] === 0) {
				// network Error
			}
			else if (errorCodes[i] === 1) {
				// Already on the list
			}
			else if (errorCodes[i] === 2) {
				// Code doesnt match anything...
			}
			else if (errorCodes[i] === 3) {
				// Invite already exists
			}
			else {
				// unknown error
			}
		}
	}
	function submitCode() {
		console.log(inviteCode)
		console.log("Submit")
		
		APIUserInviteCode( props.APIHost, props.authToken, inviteCode, inviteSuccess, inviteFailure )
	}
	
	function getInvitesSuccess(successData) {
		console.log("Get Invites Success")
		Store.set(props.currentUser+"-Invites", successData)

		let IDList = []
		let nameList = []
		let roleList = []
		
		for (let i in successData) {
			// This.... doesnt seem secure enough...
			IDList.push( successData[i]["id"] )
			nameList.push( successData[i]["getUserFullName"] )
			roleList.push( inviteType[successData[i]["targetRole"]] )
		}
		
		setInviteIDList(IDList)
		setInviteNamesList(nameList)
		setInviteRolesList(roleList)
	}
	function getInvitesFailure(errorCodes, errorMessages) {
		console.log("Get Invites Failure")
		console.log(errorCodes)
		console.log(errorMessages)
	}
	function getUserInvites() {
		let checkData = Store.get(props.currentUser+"-Invites")
		if (checkData === undefined) {
			APIUserInvitesGet( props.APIHost, props.authToken, getInvitesSuccess, getInvitesFailure )
		}
		else {
			console.log("Data will do here...")
			getInvitesSuccess(checkData)
		}
	}
	
	function spendInviteSuccess(successData) {
		console.log("Spend Invite Success")
		console.log(successData)
		
		tiggerReload()
	}
	function spendInviteFailure(errorCodes, errorMessages) {
		console.log("Spend Invite Failure")
		console.log(errorCodes)
		console.log(errorMessages)
		
		tiggerReload()
	}
	function inviteYes(event) {
		console.log("Accept")
		
		// Lets do... 0 == Cancel
		// 1 == Accept
		let action = 1
		let targetInvite = event.target.value
		APIUserInvitesSet( props.APIHost, props.authToken, targetInvite, action, spendInviteSuccess, spendInviteFailure )
	}
	function inviteNo(event) {
		console.log("Deny")

		// 0 == Cancel
		// 1 == Accept
		let action = 0
		let targetInvite = event.target.value
		
		APIUserInvitesSet( props.APIHost, props.authToken, targetInvite, action, spendInviteSuccess, spendInviteFailure )
	}
	
	function toggleDelete(event) {
		let valueInt = Number(event.target.value)
		//console.log("Leave")
		//console.log(valueInt)
		
		let temp = []
		let index = -1
		switch(event.target.name) {
			case "gov":
				temp = delGoverns.slice()
				// It was NOT found, so add it
				index = temp.indexOf( valueInt )
				if ( index === -1) {
					temp.push( valueInt )
				}
				// It WAS found, so delete it
				else {
					temp.splice(index, 1)
				}
				setDelGoverns(temp)
				break;
			case "sen":
				temp = togSends.slice()
				// It was NOT found, so add it
				index = temp.indexOf( valueInt )
				if ( index === -1) {
					temp.push( valueInt )
				}
				// It WAS found, so delete it
				else {
					temp.splice(index, 1)
				}
				setTogSends(temp)
				break;
			case "vie":
				temp = delViews.slice()
				// It was NOT found, so add it
				index = temp.indexOf( valueInt )
				if ( index === -1) {
					temp.push( valueInt )
				}
				// It WAS found, so delete it
				else {
					temp.splice(index, 1)
				}
				setDelViews(temp)
				break;
			default:
				console.log("Failed to have the correct name")
		}
	}
	
	function codeFieldChange(event) {
		setInviteCode(event.target.value)
	}
	function oldPasswordChange(event) {
		setOldPassword(event.target.value)
	}
	function newPasswordChange(event) {
		setNewPassword(event.target.value)
	}
	function newPassword2Change(event) {
		setNewPassword2(event.target.value)
	}
	function newEmailChange(event) {
		setNewEmail(event.target.value)
	}
	function newNewFirstChange(event) {
		setNewFirstName(event.target.value)
	}
	function newLastNameChange(event) {
		setNewLastName(event.target.value)
	}
		
	function changeGeneralSuccess(successData) {
		console.log("Update Success")
		console.log(successData)
		// Set some sort of success!?
		
	}
	function changeGeneralFailure(errorCodes, errorMessages) {
		console.log("Update Failure")
		console.log(errorCodes)
		console.log(errorMessages)
		// Show some error
	}
	
	function changeEmail() {
		// Verify first...
		APIChangeUserEmail( props.APIHost, props.authToken, newEmail, changeGeneralSuccess, changeGeneralFailure )
		setNewEmail("")
	}
	
	function changeName() {
		APIChangeUserName( props.APIHost, props.authToken, newFirstName, newLastName, changeGeneralSuccess, changeGeneralFailure )
		setNewFirstName("")
		setNewLastName("")
	}
	
	function changePassword() {
		APIChangeUserPassword( props.APIHost, props.authToken, oldPassword, newPassword, newPassword2, changeGeneralSuccess, changeGeneralFailure )
		setOldPassword("")
		setNewPassword("")
		setNewPassword2("")
	}
	
	function setSuccess(successData) {
		console.log("Set Data Success")
		console.log(successData)
		
		// This needs to be a props refresh..
		props.triggerRefresh()
	}
	function setFailure(errorCodes, errorMessages) {
		console.log("Set Data Failure")
		console.log(errorCodes)
		console.log(errorMessages)
	}
	function saveChanges() {
		let testData = {
			
			// Hmm, perhaps the generic way wont work...
			//"delViews":delViews,
			"togEmails":togSends,
			"delGovern":delGoverns,
		}
		
		APIUserSettingsEdit( props.APIHost, props.authToken, testData, setSuccess, setFailure )
	}
	
	let invitesDisplayList = []
	for (let i in inviteNamesList) {
		let extra = ""
		invitesDisplayList.push(
			<li className={"list-group-item d-flex justify-content-around"+extra} key={i}>
				<div>
					{inviteNamesList[i]}
				</div>
				<div>
					{inviteRolesList[i]}
				</div>
				<button className="badge badge-success badge-pill" value={inviteIDList[i]} onClick={inviteYes}>/</button>
				<button className="badge badge-danger badge-pill" value={inviteIDList[i]} onClick={inviteNo}>X</button>
			</li>
		)
	}
	if (inviteNamesList.length === 0) {
		invitesDisplayList.push(
			<li className="list-group-item" key={0}>
				No Invites!
			</li>
		)
	}
	
	let displayViewSends = []
	if (props.viewNameList.length > 0) {
		for (let i in props.viewNameList) {
			let extra = ""
			
			// Blank will just be admin/view for now... Highlighted in green means Email...
			let index = props.sendIDList.indexOf(props.viewIDList[i])
			if (index >= 0) {
				extra = 'bg-success'
			}
			// Sends we are toggling....
			index = togSends.indexOf(props.viewIDList[i])
			if (index >= 0) {
				extra = 'bg-warning'
			}
			// Views we are deleting
			index = delViews.indexOf(props.viewIDList[i])
			if (index >= 0) {
				extra = 'bg-danger'
			}
			
			displayViewSends.push(
				<li key={i} className={"list-group-item d-flex justify-content-around "+extra}>
					{props.viewNameList[i]}
					<button className="badge badge-success badge-pill" name="sen" value={props.viewIDList[i]} onClick={toggleDelete}>View</button>
					<button className="badge badge-danger badge-pill" name="vie" value={props.viewIDList[i]} onClick={toggleDelete}>X</button>
				</li>
			)
		}
	}
	else {
		// There was nothing
		displayViewSends.push(
			<li key={0} className="list-group-item d-flex justify-content-around">
				None!
			</li>
		)
	}
	
	let displayOwningCompanyList = []
	if (props.governedNameList.length > 0) {
		for (let i in props.governedNameList) {
			let extra = ""
			let index = delGoverns.indexOf(props.governedIDList[i])
			if (index >= 0) {
				extra = 'bg-danger'
			}
			
			displayOwningCompanyList.push(
				<li key={i} className={"list-group-item d-flex justify-content-around "+extra}>
					{props.governedNameList[i]}
					<button className="badge badge-danger badge-pill" name="gov" value={props.governedIDList[i]} onClick={toggleDelete}>X</button>
				</li>
			)
		}
	}
	else {
		// There was nothing
		displayOwningCompanyList.push(
			<li key={0} className="list-group-item d-flex justify-content-around">
				None!
			</li>
		)
	}

	let emailClass = 'form-control'
	//if (this.state.emailError) {
	//	emailClass += ' bg-warning'
	//}

	let passwordClass = 'form-control'
	//if (passwordError) {
	//	passwordClass += ' bg-warning'
	//}

	return (
		<div className="defaultView">
			<div className="container-fluid">
			
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Invite Code</h5>
							</div>
							<div className="card-body">
								<div className="list-group">
									<div className="list-group-item">
										<input type='text' className='form-control' value={inviteCode} onChange={codeFieldChange} placeholder='Enter Code' />
									</div>
									<div className="list-group-item">
										<button className="btn btn-primary" onClick={submitCode}>
											Submit
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Company Invites</h5>
							</div>
							<div className="card-body">
								<ul className="list-group">
									{invitesDisplayList}
								</ul>
							</div>
						</div>
					</div>
				</div>
				
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Companies getting your Journal Info</h5>
							</div>
							<div className="card-body">
								<ul className="list-group">
									{displayViewSends}
								</ul>
								<button className="btn btn-secondary" data-toggle="modal" data-target="#deleteConfirm">
									Confirm
								</button>
							</div>
						</div>
					</div>
				</div>
				
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Companies getting your Journal Info</h5>
							</div>
							<div className="card-body">
								<ul className="list-group">
									{displayOwningCompanyList}
								</ul>
								<button className="btn btn-secondary" data-toggle="modal" data-target="#deleteConfirm">
									Confirm
								</button>
							</div>
						</div>
					</div>
				</div>
			
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Edit User Security Details</h5>
							</div>
							<div className="card-body">
								<div className="list-group">
									<div className="list-group-item">
										Under Construction...
									</div>
									<div className="list-group-item">
										<div>
											{currentEmail}
										</div>
										<button className="btn btn-primary" data-toggle="modal" data-target="#changeEmailModal">
											Change Email
										</button>
									</div>
									<div className="list-group-item">
										<div>
											{currentFirstName + " " + currentLastName}
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
			
				<div className="modal fade" id="deleteConfirm" tabIndex="-1" role="dialog" aria-labelledby="deleteConfirmation" aria-hidden="true">
				  <div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
					  <div className="modal-header">
						<h5 className="modal-title" id="deleteTitleConfirm">Delete Confirmation</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
						</button>
					  </div>
					  <div className="modal-body">
						Are you SURE you want to make these changes? 
					  </div>
					  <div className="modal-footer">
						<button type="button" className="btn btn-danger" data-dismiss="modal" onClick={saveChanges}>Yes</button>
						<button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
					  </div>
					</div>
				  </div>
				</div>
				
				<div className="modal fade" id="changeEmailModal" tabIndex="-1" role="dialog" aria-labelledby="changeEmailModal" aria-hidden="true">
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
								<label id="align-left">{"Current Email: " + currentEmail}</label>
							</div>
							<div className='form-group'>
								<label id="align-left">New Email</label>
								<input type='email' className={emailClass} value={newEmail} onChange={newEmailChange} placeholder='Enter Email' />
							</div>
					  </div>
					  <div className="modal-footer">
						<button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={changeEmail}>Change Email</button>
						<button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
					  </div>
					</div>
				  </div>
				</div>
				
				<div className="modal fade" id="changeNameModal" tabIndex="-1" role="dialog" aria-labelledby="changeNameModal" aria-hidden="true">
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
								<label id="align-left">{"Current name: " + currentFirstName + " " + currentLastName}</label>
							</div>
							<div className='form-group'>
								<label id="align-left">New First Name</label>
								<input type='text' className={emailClass} value={newFirstName} onChange={newNewFirstChange} placeholder='Enter New First Name' />
							</div>
							<div className='form-group'>
								<label id="align-left">New Last Name</label>
								<input type='text' className={emailClass} value={newLastName} onChange={newLastNameChange} placeholder='Enter New Last Name' />
							</div>
					  </div>
					  <div className="modal-footer">
						<button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={changeName}>Change Name</button>
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
								<input type='password' className={passwordClass} value={oldPassword} onChange={oldPasswordChange} placeholder='Enter password' />
							</div>
							<div className='form-group'>
								<label id="align-left">New Password</label>
								<input type='password' className={passwordClass} value={newPassword} onChange={newPasswordChange} placeholder='Enter password' />
							</div>
							<div className='form-group'>
								<label id="align-left">New Password (again)</label>
								<input type='password' className={passwordClass} value={newPassword2} onChange={newPassword2Change} placeholder='Enter password' />
							</div>
					  </div>
					  <div className="modal-footer">
						<button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={changePassword}>Change Password</button>
						<button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
					  </div>
					</div>
				  </div>
				</div>
			
			</div>
		</div>
	)
}

export default withRouter(UserProfile);