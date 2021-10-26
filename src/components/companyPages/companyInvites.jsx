import React from "react";

import { APIDivisionInvitesCreate, APIDivisionInvitesSet, APIDivisionSettingsGet, APIDivisionInvitesGet } from "../../utils";
import { withRouter } from "react-router-dom";
import { Alert } from 'react-bootstrap';

const inviteType = ['Invalid', 'Admin', 'Allowed to View', 'Governed User']
const debugPageName = "Division Invites"

class CompanyInvites extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
	
			// Because these are in here, these are NOT SAVED!
			inviteCode: "No Data",
			
			// These should be fine to keep this way...
			targetUser: "",
			targetRole: "",
			
			invitePendingList: [],
			inviteActiveList: [],
			
			companyFullName: "No Data",
			divisionName: "No Data",
			
			getDivisionDataStatus: 0,
			getDivisionDataError: [],
			getInvitesStatus: 0,
			getInvitesError: [],
			
			createInvitesStatus: 0,
			createInvitesError: [],
			useInvitesStatus: 0,
			useInvitesError: [],
			
			successType: -1,
		}
	}
	
	componentDidMount() {
		this.tiggerReload()
	};
	
	tiggerReload = () => {
		this.getDivisionData()
		this.getDivisionsInvites()
	}
	
	getFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Get Division Data")
			this.props.refreshToken(this.getDivisionData)
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
		
		this.props.debugSet(debugPageName, "Get Division Data", "Failure")
		returnData = responseData['messages']
		this.setState({
			getDivisionDataError: returnData,
			getDivisionDataStatus: 3,
		})
	}
	getSuccess = (successData) => {
		//console.log("Get Data Success")
		
		this.props.debugSet(debugPageName, "Get Division Data", "Success")
		this.setState({
			companyFullName: successData["fullPathName"],
			divisionName: successData["divisionName"],
			inviteCode: successData["inviteCode"],
			
			getDivisionDataStatus: 2,
		})
	}
	getDivisionData = () => {
		// Verify that the division is valid?
		if (this.props.currentDivisionID >= 0) {
			let checkData = undefined//Store.get(props.currentDivisionID+"-Data")
			if (checkData === undefined) {
				//console.log("Requesting Division Data From Server...")
				APIDivisionSettingsGet(  this.props.currentDivisionID, this.getSuccess, this.getFailure )

				this.setState({
					getDivisionDataStatus: 1,
				})
			}
			else {
				console.log("Data will do here...")
				this.getSuccess(checkData)
			}
			
		}
	}
	
	getInvitesFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Get Division Invites")
			this.props.refreshToken(this.getDivisionsInvites)
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
		
		this.props.debugSet(debugPageName, "Get Division Invites", "Failure")
		returnData = responseData['messages']
		this.setState({
			getInvitesStatus: 3,
			getInvitesError: returnData,
		})
	}
	getInvitesSuccess = (incomingData) => {
		//console.log("Get Invites Success")
		//Store.set(props.currentDivisionID+"-Invites", successData)
		
		let invitesUserSide = []
		let invitesDivisionSide = []
		
		for (let index in incomingData) {
			// If it is from a company to this user, it goes in the invite area
			if (incomingData[index].whoIsOrigin === 2) {
				invitesDivisionSide.push( incomingData[index] )
			}
			// If it is from us, to a company... then it goes in the pending field
			else if (incomingData[index].whoIsOrigin === 1) {
				invitesUserSide.push( incomingData[index] )
			}
		}
		
		this.props.debugSet(debugPageName, "Get Division Invites", "Success")
		this.setState({
			invitePendingList: invitesDivisionSide,
			inviteActiveList: invitesUserSide,
			
			getInvitesStatus: 2,
		})
	}
	getDivisionsInvites = () => {
		if (this.props.currentDivisionID >= 0) {
			let checkData = undefined//Store.get(props.currentDivisionID+"-Invites")
			if (checkData === undefined) {
				APIDivisionInvitesGet(  this.props.currentDivisionID, this.getInvitesSuccess, this.getInvitesFailure )
				this.setState({
					getInvitesStatus: 1,
				})
			}
			else {
				console.log("Data will do here...")
				this.getInvitesSuccess(checkData)
			}
		}
	}
	
	inviteFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Create Division Invites")
			this.props.refreshToken(this.tokenHasRefreshed)
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
		
		this.props.debugSet(debugPageName, "Create Division Invites", "Failure")
		returnData = responseData['messages']
		this.setState({
			createInvitesStatus: 3,
			createInvitesError: returnData,
		})
	}
	inviteSuccess = (successData) => {
		//console.log("Create Invite Success")
		//console.log(successData)
		
		this.props.debugSet(debugPageName, "Create Division Invites", "Success")
		this.setState({
			createInvitesStatus: 2,
		})
	}
	inviteUser = (event) => {
		//console.log("Send Invite")
		
		APIDivisionInvitesCreate(  this.props.currentDivisionID, this.state.targetUser, this.state.targetRole, this.inviteSuccess, this.inviteFailure )
		this.setState({
			createInvitesStatus: 1,
		})
	}
	
	spendInviteFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Spend Division Invites")
			this.props.refreshToken(this.tokenHasRefreshed)
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
		
		this.props.debugSet(debugPageName, "Spend Division Invites", "Failure")
		returnData = responseData['messages']
		this.setState({
			useInvitesStatus: 3,
			useInvitesError: returnData,
		})
		
		this.getDivisionsInvites()
	}
	spendInviteSuccessYes = (successData) => {
		//console.log("Spend Invite Success")
		//console.log(successData)
		this.props.debugSet(debugPageName, "Spend Division Invites", "Success")
		this.tiggerReload()
		
		this.setState({
			successType: 0,
			useInvitesStatus: 2,
		})
	}
	inviteYes = (event) => {
		console.log("Accept")
		
		// Lets do... 0 == Cancel
		// 1 == Accept
		let action = 1
		let targetInvite = event.target.value
		APIDivisionInvitesSet(  this.props.currentDivisionID, targetInvite, action, this.spendInviteSuccessYes, this.spendInviteFailure )
		this.setState({
			successType: -1,
			useInvitesStatus: 1,
		})
	}
	spendInviteSuccessNo = (successData) => {
		//console.log("Spend Invite Success")
		//console.log(successData)
		this.props.debugSet(debugPageName, "Spend Division Invites", "Success")
		this.tiggerReload()
		
		this.setState({
			successType: 1,
			useInvitesStatus: 2,
		})
	}
	inviteNo = (event) => {
		console.log("Deny")

		// 0 == Cancel
		// 1 == Accept
		let action = 0
		let targetInvite = event.target.value
		
		APIDivisionInvitesSet(  this.props.currentDivisionID, targetInvite, action, this.spendInviteSuccessNo, this.spendInviteFailure )
		this.setState({
			successType: -1,
			useInvitesStatus: 1,
		})
	}
	
	userFieldChange = (event) => {
		this.setState({
			targetUser: event.target.value,
		})
	}
	
	triggerDropdown = (event) => {
		this.setState({
			targetRole:event.target.value,
		})
	}
	
	tokenHasRefreshed = () => {
		console.log("Show a 'try again' here")
	}
	
	render() {
		let invitesDisplayPendingList = []
		
		for (let i in this.state.invitePendingList) {
			let extra = ""
			invitesDisplayPendingList.push(
				<li className={"list-group-item d-flex justify-content-around"+extra} key={i}>
					<div className="col">
						{this.state.invitePendingList[i].inviteDivision}
					</div>
					<div className="col">
						{inviteType[this.state.invitePendingList[i].targetRole]}
					</div>
					<div className="col-2">
						<button className="badge badge-success badge-pill" value={this.state.invitePendingList[i].id} onClick={this.inviteYes}>/</button>
					</div>
					<div className="col-1">
						<button className="badge badge-danger badge-pill" value={this.state.invitePendingList[i].id} onClick={this.inviteNo}>X</button>
					</div>
				</li>
			)
		}
		
		if (invitesDisplayPendingList.length === 0) {
			invitesDisplayPendingList.push(
				<li className="list-group-item" key={0}>
					No Pending Invites!
				</li>
			)
		}
		
		let invitesDisplayList = []
		for (let i in this.state.inviteActiveList) {
			let extra = ""
			invitesDisplayList.push(
				<li className={"list-group-item d-flex justify-content-around"+extra} key={i}>
					<div className="col">
						{this.state.inviteActiveList[i].inviteDivision}
					</div>
					<div className="col">
						{inviteType[this.state.inviteActiveList[i].targetRole]}
					</div>
					<div className="col-2">
						<button className="badge badge-success badge-pill" value={this.state.inviteActiveList[i].id} onClick={this.inviteYes}>/</button>
					</div>
					<div className="col-1">
						<button className="badge badge-danger badge-pill" value={this.state.inviteActiveList[i].id} onClick={this.inviteNo}>X</button>
					</div>
				</li>
			)
		}
		if (invitesDisplayList.length === 0) {
			invitesDisplayList.push(
				<li className="list-group-item" key={0}>
					No Invites!
				</li>
			)
		}

		let showTargetRole = "Select Role =>"
		if (this.state.targetRole !== "") {
			showTargetRole = inviteType[this.state.targetRole]
		}
		
		//let showIdle = this.state.getDivisionDataStatus === 0 || this.state.getInvitesStatus === 0 || this.state.useInvitesStatus === 1
		let showWaiting = this.state.getDivisionDataStatus === 1 || this.state.getInvitesStatus === 1 || this.state.useInvitesStatus === 1 || this.state.createInvitesStatus === 2
		let showSuccessAcc = this.state.useInvitesStatus === 2 && this.state.successType === 0
		let showSuccessRej = this.state.useInvitesStatus === 2 && this.state.successType === 1
		let showSuccessInvite = this.state.createInvitesStatus === 2
		let showError = this.state.getDivisionDataStatus === 3 || this.state.getInvitesStatus === 3 || this.state.useInvitesStatus === 3 || this.state.createInvitesStatus === 3
	
		let errorParse = []
		for (let index in this.state.getDivisionDataError) {
			errorParse.push(
				this.state.getDivisionDataError[index]["text"]
			)
		}
		for (let index in this.state.getInvitesError) {
			errorParse.push(
				this.state.getInvitesError[index]["text"]
			)
		}
		for (let index in this.state.createInvitesError) {
			errorParse.push(
				this.state.createInvitesError[index]["text"]
			)
		}
		for (let index in this.state.useInvitesError) {
			errorParse.push(
				this.state.useInvitesError[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}
	
		return (
			<div className="companySett">
				<div className="container-fluid">
				
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Invites for this division:</h5>
								</div>
								<div className="card-body">
									{this.state.companyFullName}
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Invite Code</h5>
								</div>
								<div className="card-body">
									{this.state.inviteCode}
								</div>
							</div>
						</div>
					</div>
					<div className="row">					
						<div className="col-md-12 col-lg">
							<div className="card shadow">
								<div className="card-header">
									<h5>Pending Invites List</h5>
								</div>
								<div className="card-body">
									<ul className="list-group">
										<li className="list-group-item" key={-1}>
											<div className="row">
												<div className="col-1">
												</div>
												<div className="col alignOverride">
													<u>User Name</u>
												</div>
												<div className="col alignOverride">
													<u>Target Role</u>
												</div>
												<div className="col-2">
												
												</div>
												<div className="col-1">
												</div>
											</div>
										</li>
										{invitesDisplayPendingList}
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div className="row">					
						<div className="col-md-12 col-lg">
							<div className="card shadow">
								<div className="card-header">
									<h5>Invites List</h5>
								</div>
								<div className="card-body">
									<ul className="list-group">
										<li className="list-group-item" key={-1}>
											<div className="row">
												<div className="col-1">
												</div>
												<div className="col alignOverride">
													<u>User Name</u>
												</div>
												<div className="col alignOverride">
													<u>Target Role</u>
												</div>
												<div className="col-2">
												
												</div>
												<div className="col-1">
												</div>
											</div>
										</li>
										{invitesDisplayList}
									</ul>
								</div>
							</div>
						</div>
						<div className="col-md-12 col-lg">
							<div className="card shadow">
								<div className="card-header">
									<h5>Invite User</h5>
								</div>
								<div className="card-body">
									
									<div className="row">
										<div className="col">
											<input type='text' className='form-control' value={this.state.targetUser} onChange={this.userFieldChange} placeholder='Enter Username or Email' />
										</div>
									</div>
									<div className="row">
										<div className="col">
											<div className="dropdown">
												<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													{showTargetRole}
												</button>
												<div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
													<button className="dropdown-item" value="1" onClick={this.triggerDropdown}>Admin</button>
													<button className="dropdown-item" value="2" onClick={this.triggerDropdown}>Allowed to View</button>
													<button className="dropdown-item" value="3" onClick={this.triggerDropdown}>Governed User</button>
												</div>
											</div>
										</div>
									
										<div className="col">
											<button className="btn btn-primary" onClick={this.inviteUser}>
												Invite
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
					
					<Alert show={showSuccessAcc} variant="success">
						<Alert.Heading>Success!</Alert.Heading>
						<hr />
						<p>
						  Successfully Accepted Invite!
						</p>
						<hr />
					</Alert>
					
					<Alert show={showSuccessRej} variant="success">
						<Alert.Heading>Success!</Alert.Heading>
						<hr />
						<p>
						  Successfully Rejected Invite!
						</p>
						<hr />
					</Alert>
					
					<Alert show={showSuccessInvite} variant="success">
						<Alert.Heading>Success!</Alert.Heading>
						<hr />
						<p>
						  Successfully Sent Invite!
						</p>
						<hr />
					</Alert>
					
					<Alert show={showError} variant="danger">
						<Alert.Heading>Error!</Alert.Heading>
						<hr />
						<p>
						  Failed with general error!
						</p>
						<hr />
					</Alert>
				</div>
			</div>
		)
	}
}

export default withRouter(CompanyInvites);