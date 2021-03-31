import React, { useState, useEffect  } from "react";
import Store from "store"

import { APIDivisionInvitesCreate, APIDivisionInvitesSet, APIDivisionSettingsEdit, APIDivisionSettingsGet, APIDivisionInvitesGet } from "../../utils";
import { withRouter } from "react-router-dom";

const viewingPermsCheck = ['Public', 'Private', 'Governed Users']
const inviteType = ['Invalid', 'Admin', 'Viewer', 'Governed']

const CompanySettings = (props) => {
	
	// Because these are in here, these are NOT SAVED!
	const [inviteCode, setInviteCode] = useState( "No Data" );
	
	// These should be fine to keep this way...
	const [targetUser, setTargetUser] = useState( "" );
	const [targetRole, setTargetRole] = useState( "" );
	
	const [inviteIDList, setInviteIDList] = useState( [] );
	const [inviteNamesList, setInviteNamesList] = useState( [] );
	const [inviteRolesList, setInviteRolesList] = useState( [] );
	
	const [viewPerms, setViewPerms] = useState( "No Data" );
	const [expiryDate, setExpiryDate] = useState( "No Data" );	
	
	const [companyFullName, setCompanyFullName] = useState( "No Data" );
	const [divisionName, setDivisionName] = useState( "No Data" );
	
	const [adminsIDs, setAdminsIDs] = useState( [] );
	const [viewsIDs, setViewsIDs] = useState( [] );
	const [sendsIDs, setSendsIDs] = useState( [] );
	const [governsIDs, setGovernsIDs] = useState( [] );
	
	const [admins, setAdmins] = useState( [] );
	const [views, setViews] = useState( [] );
	const [sends, setSends] = useState( [] );
	const [governs, setGoverns] = useState( [] );
	
	const [delAdmins, setDelAdmins] = useState( [] );
	const [delViews, setDelViews] = useState( [] );
	const [delSends, setDelSends] = useState( [] );
	const [delGoverns, setDelGoverns] = useState( [] );
	
	const [numChild, setNumChild] = useState( 0 );
	
	useEffect(() => {    
		// Update the document title using the browser API    
		console.log("Triggered Refresh!")
		tiggerReload()
		// This should be fine, for dependancies.. as this SHOULD NOT EVER refresh other than the base one...
	}, []);
	
	function tiggerReload() {
		getDivisionData()
		getDivisionsInvites()
	}
	
	function getSuccess(successData) {
		console.log("Get Data Success")
		Store.set(props.currentDivisionID+"-Data", successData)
		
		setCompanyFullName( successData["fullPathName"] )
		setDivisionName( successData["divisionName"] )
		setNumChild( successData["getNumChildUsers"] )
		
		setInviteCode( successData["inviteCode"] )
		
		setExpiryDate( successData["getCompanyExpiryDate"] )
		
		setAdmins( successData["adminAccountNames"] )
		setViews( successData["privateViewingNames"] )
		setSends( successData["resultsSendTargetsNames"] )
		setGoverns( successData["governedUsersNames"] )
		
		setAdminsIDs( successData["adminAccounts"] )
		setViewsIDs( successData["privateViewingPerms"] )
		setSendsIDs( successData["resultsSendTargets"] )
		setGovernsIDs( successData["governedUsers"] )
		
		setDelAdmins( [] )
		setDelViews( [] )
		setDelSends( [] )
		setDelGoverns( [] )
		
		setViewPerms( viewingPermsCheck[ successData["summaryViewAccess"] ] )

	}
	function getFailure(errorCodes, errorMessages) {
		console.log("Get Data Failure")
		console.log(errorCodes)
		console.log(errorMessages)
	}
	function getDivisionData() {
		// Verify that the division is valid?
		if (props.currentDivisionID >= 0) {
			let checkData = Store.get(props.currentDivisionID+"-Data")
			if (checkData === undefined) {
				console.log("Requesting Division Data From Server...")
				APIDivisionSettingsGet( props.APIHost, props.authToken, props.currentDivisionID, getSuccess, getFailure )
			}
			else {
				console.log("Data will do here...")
				getSuccess(checkData)
			}
			
		}
	}
	
	function getInvitesSuccess(successData) {
		console.log("Get Invites Success")
		Store.set(props.currentDivisionID+"-Invites", successData)

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
	function getDivisionsInvites() {
		if (props.currentDivisionID >= 0) {
			let checkData = Store.get(props.currentDivisionID+"-Invites")
			if (checkData === undefined) {
				APIDivisionInvitesGet( props.APIHost, props.authToken, props.currentDivisionID, getInvitesSuccess, getInvitesFailure )
			}
			else {
				console.log("Data will do here...")
				getInvitesSuccess(checkData)
			}
		}
	}
	
	function setSuccess(successData) {
		console.log("Set Data Success")
		console.log(successData)
		
		props.triggerRefresh()
	}
	function setFailure(errorCodes, errorMessages) {
		console.log("Set Data Failure")
		console.log(errorCodes)
		console.log(errorMessages)
		
		//triggerLogout?
	}
	function saveChanges() {
		
		// I will need to put a validator in here... Definetly...
		// For now I will not allow it...
		let chName = ""
		
		let testData = {
			"reqDiv":props.currentDivisionID,
			
			"chName": chName,
			
			"delAdmins":delAdmins,
			"delViews":delViews,
			"delEmails":delSends,
			"delGovern":delGoverns,
		}
		
		APIDivisionSettingsEdit( props.APIHost, props.authToken, testData, setSuccess, setFailure )
	}
	
	function inviteSuccess(successData) {
		console.log("Create Invite Success")
		console.log(successData)
	}
	function inviteFailure(errorCodes, errorMessages) {
		console.log("Create Invite Failure")
		console.log(errorCodes)
		console.log(errorMessages)
		
		//triggerLogout?
	}
	function inviteUser(event) {
		console.log("Send Invite")
		
		APIDivisionInvitesCreate( props.APIHost, props.authToken, props.currentDivisionID, targetUser, targetRole, inviteSuccess, inviteFailure )
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
		
		getDivisionsInvites()
	}
	function inviteYes(event) {
		console.log("Accept")
		
		// Lets do... 0 == Cancel
		// 1 == Accept
		let action = 1
		let targetInvite = event.target.value
		APIDivisionInvitesSet( props.APIHost, props.authToken, props.currentDivisionID, targetInvite, action, spendInviteSuccess, spendInviteFailure )
	}
	function inviteNo(event) {
		console.log("Deny")

		// 0 == Cancel
		// 1 == Accept
		let action = 0
		let targetInvite = event.target.value
		
		APIDivisionInvitesSet( props.APIHost, props.authToken, props.currentDivisionID, targetInvite, action, spendInviteSuccess, spendInviteFailure )
	}
	
	function userFieldChange(event) {
		setTargetUser(event.target.value)
	}
	
	function toggleDelete(event) {
		
		let valueInt = Number(event.target.value)
		
		let temp = []
		let index = -1
		switch(event.target.name) {
			case "adm":
				temp = delAdmins.slice()
				// It was NOT found, so add it
				index = temp.indexOf( valueInt )
				if ( index === -1) {
					temp.push( valueInt )
				}
				// It WAS found, so delete it
				else {
					temp.splice(index, 1)
				}
				setDelAdmins(temp)
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
				
			case "sen":
				temp = delSends.slice()
				// It was NOT found, so add it
				index = temp.indexOf( valueInt )
				if ( index === -1) {
					temp.push( valueInt )
				}
				// It WAS found, so delete it
				else {
					temp.splice(index, 1)
				}
				setDelSends(temp)
				break;
				
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
				
			default:
				console.log("Failed to have the correct name")
		}
	}
	
	function triggerDropdown(event) {
		setTargetRole(event.target.value)
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
	
	let adminUserList = []
	for (let i in admins) {
		let extra = ""
		let index = delAdmins.indexOf(adminsIDs[i])
		if (index >= 0) {
			extra = 'bg-warning'
		}
		
		adminUserList.push(
			<li className={"list-group-item d-flex justify-content-around"+extra} key={i}>
				{admins[i]}
				{/*<button className="badge badge-danger badge-pill" name="adm" value={adminsIDs[i]} onClick={toggleDelete}>
					X
				</button>*/}
			</li>
		)
	}
	if (admins.length === 0) {
		adminUserList.push(
			<li className="list-group-item" key={0}>
				No Users!
			</li>
		)
	}
	
	let viewingUserList = []
	for (let i in views) {
		let extra = ""
		let index = delViews.indexOf(viewsIDs[i])
		if (index >= 0) {
			extra = 'bg-warning'
		}
		
		viewingUserList.push(
			<li className={"list-group-item d-flex justify-content-around "+extra} key={i}>
				{views[i]}
				<button className="badge badge-danger badge-pill" name="vie" value={viewsIDs[i]} onClick={toggleDelete}>
					X
				</button>
			</li>
		)
	}
	if (views.length === 0) {
		viewingUserList.push(
			<li className="list-group-item" key={0}>
				No Users!
			</li>
		)
	}
	
	let sentUserList = []
	for (let i in sends) {
		let extra = ""
		let index = delSends.indexOf(sendsIDs[i])
		if (index >= 0) {
			extra = 'bg-warning'
		}
		
		sentUserList.push(
		<li className={"list-group-item d-flex justify-content-around "+extra} key={i}>
				{sends[i]}
				<button className="badge badge-danger badge-pill" name="sen" value={sendsIDs[i]} onClick={toggleDelete}>
					X
				</button>
			</li>
		)
	}
	if (sends.length === 0) {
		sentUserList.push(
			<li className="list-group-item" key={0}>
				No Users!
			</li>
		)
	}

	let governedUserList = []
	for (let i in governs) {
		let extra = ""
		let index = delGoverns.indexOf(governsIDs[i])
		if (index >= 0) {
			extra = 'bg-warning'
		}
		
		governedUserList.push(
			<li className={"list-group-item d-flex justify-content-around "+extra} key={i}>
				{governs[i]}
				<button className="badge badge-danger badge-pill" name="gov" value={governsIDs[i]} onClick={toggleDelete}>
					X
				</button>
			</li>
		)
	}	
	if (governs.length === 0) {
		governedUserList.push(
			<li className="list-group-item" key={0}>
				No Users!
			</li>
		)
	}
	governedUserList.push(
		<li className="list-group-item" key={"end"}>
			And {numChild} others in child nodes
		</li>
	)

	let showTargetRole = "Select Role =>"
	if (targetRole !== "") {
		showTargetRole = inviteType[targetRole]
	}
	
	return (
		<div className="companySett">
			<div className="container-fluid">
			
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Full Company Path</h5>
							</div>
							<div className="card-body">
								{companyFullName}
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Change Division Name</h5>
							</div>
							<div className="card-body">
								<div>
									<input type='text' className='form-control' value={divisionName} onChange={userFieldChange} placeholder='No Name?!' />
								</div>
							</div>
						</div>
					</div>
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Invites List</h5>
							</div>
							<div className="card-body">
								<ul>
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
								<h5>Invite Code</h5>
							</div>
							<div className="card-body">
								{inviteCode}
							</div>
						</div>
					</div>
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Viewing Permissions</h5>
							</div>
							<div className="card-body">
								{viewPerms}
							</div>
						</div>
					</div>
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Subscription Expiry</h5>
							</div>
							<div className="card-body d-inline-flex justify-content-around">
								{expiryDate}
							</div>
						</div>
					</div>
				</div>
				
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Invite User</h5>
							</div>
							<div className="card-body">
								<div className="row">
									<div className="col">
											<input type='text' className='form-control' value={targetUser} onChange={userFieldChange} placeholder='Enter Username or Email' />
									</div>
									<div className="col">
										<div className="dropdown">
											<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												{showTargetRole}
											</button>
											<div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
												<button className="dropdown-item" value="1" onClick={triggerDropdown}>Admin</button>
												<button className="dropdown-item" value="2" onClick={triggerDropdown}>View Permissions</button>
												<button className="dropdown-item" value="3" onClick={triggerDropdown}>Governed User</button>
											</div>
										
										</div>
									</div>
								</div>
								<button className="btn btn-primary" onClick={inviteUser}>
									Invite
								</button>
							</div>
						</div>
					</div>
				</div>
				
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Administrators</h5>
							</div>
							<div className="card-body">
								{adminUserList}
							</div>
						</div>
					</div>
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Viewing Privilages:</h5>
							</div>
							<div className="card-body">
								<ul>
									{viewingUserList}
								</ul>
							</div>
						</div>
					</div>
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Users Notified:</h5>
							</div>
							<div className="card-body">
								<ul>
									{sentUserList}
								</ul>
							</div>
						</div>
					</div>
				</div>
				
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h5>Target Users:</h5>
							</div>
							<div className="card-body">
								<ul>
									{governedUserList}
								</ul>
							</div>
						</div>
					</div>
				</div>
				
				<button className="btn btn-primary" onClick={saveChanges}>
					Save Changes
				</button>
			</div>
		</div>
	)
}

export default withRouter(CompanySettings);