import React from "react";

import { APIDivisionInvitesCreate, APIDivisionInvitesSet, APIDivisionSettingsGet, APIDivisionInvitesGet } from "../../utils";
import { withRouter } from "react-router-dom";
import { Alert } from 'react-bootstrap';

const inviteType = ['Invalid', 'Admin', 'Allowed to View', 'Governed User']

class CompanyInvites extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
	
			// Because these are in here, these are NOT SAVED!
			inviteCode: "No Data",
			
			// These should be fine to keep this way...
			targetUser: "",
			targetRole: "",
			
			inviteIDList: [],
			inviteNamesList: [],
			inviteRolesList: [],
			
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
			getDivisionDataError: returnData,
			getDivisionDataStatus: 3,
		})
	}
	getSuccess = (successData) => {
		//console.log("Get Data Success")
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
				APIDivisionSettingsGet( this.props.authToken, this.props.currentDivisionID, this.getSuccess, this.getFailure )

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
			getInvitesStatus: 3,
			getInvitesError: returnData,
		})
	}
	getInvitesSuccess = (successData) => {
		//console.log("Get Invites Success")
		//Store.set(props.currentDivisionID+"-Invites", successData)

		let IDList = []
		let nameList = []
		let roleList = []
		
		for (let i in successData) {
			// This.... doesnt seem secure enough...
			IDList.push( successData[i]["id"] )
			nameList.push( successData[i]["getUserFullName"] )
			roleList.push( inviteType[successData[i]["targetRole"]] )
		}
		this.setState({
			inviteIDList: IDList,
			inviteNamesList: nameList,
			inviteRolesList: roleList,
			
			getInvitesStatus: 2,
		})
	}
	getDivisionsInvites = () => {
		if (this.props.currentDivisionID >= 0) {
			let checkData = undefined//Store.get(props.currentDivisionID+"-Invites")
			if (checkData === undefined) {
				APIDivisionInvitesGet( this.props.authToken, this.props.currentDivisionID, this.getInvitesSuccess, this.getInvitesFailure )
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
			createInvitesStatus: 3,
			createInvitesError: returnData,
		})
	}
	inviteSuccess = (successData) => {
		console.log("Create Invite Success")
		console.log(successData)
		this.setState({
			createInvitesStatus: 2,
		})
	}
	inviteUser = (event) => {
		console.log("Send Invite")
		
		APIDivisionInvitesCreate( this.props.authToken, this.props.currentDivisionID, this.state.targetUser, this.state.targetRole, this.inviteSuccess, this.inviteFailure )
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
			useInvitesStatus: 3,
			useInvitesError: returnData,
		})
		
		this.getDivisionsInvites()
	}
	spendInviteSuccess = (successData) => {
		console.log("Spend Invite Success")
		console.log(successData)
		
		this.tiggerReload()
		
		this.setState({
			useInvitesStatus: 2,
		})
	}
	inviteYes = (event) => {
		console.log("Accept")
		
		// Lets do... 0 == Cancel
		// 1 == Accept
		let action = 1
		let targetInvite = event.target.value
		APIDivisionInvitesSet( this.props.authToken, this.props.currentDivisionID, targetInvite, action, this.spendInviteSuccess, this.spendInviteFailure )
		this.setState({
			useInvitesStatus: 1,
		})
	}
	inviteNo = (event) => {
		console.log("Deny")

		// 0 == Cancel
		// 1 == Accept
		let action = 0
		let targetInvite = event.target.value
		
		APIDivisionInvitesSet( this.props.authToken, this.props.currentDivisionID, targetInvite, action, this.spendInviteSuccess, this.spendInviteFailure )
		this.setState({
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
	
	render() {
		let invitesDisplayList = []
		for (let i in this.state.inviteNamesList) {
			let extra = ""
			invitesDisplayList.push(
				<li className={"list-group-item d-flex justify-content-around"+extra} key={i}>
					<div className="col">
						{this.state.inviteNamesList[i]}
					</div>
					<div className="col">
						{this.state.inviteRolesList[i]}
					</div>
					<div className="col">
						<button className="badge badge-success badge-pill" value={this.state.inviteIDList[i]} onClick={this.inviteYes}>/</button>
					</div>
					<div className="col">
						<button className="badge badge-danger badge-pill" value={this.state.inviteIDList[i]} onClick={this.inviteNo}>X</button>
					</div>
				</li>
			)
		}
		if (this.state.inviteNamesList.length === 0) {
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
		
		//let showIdle = this.state.getDivisionDataStatus === 0 || this.state.getInvitesStatus === 0
		let showWaiting = this.state.getDivisionDataStatus === 1 || this.state.getInvitesStatus === 1
		let showSuccess = false//this.state.getDivisionDataStatus === 2 || this.state.getInvitesStatus === 2
		let showError = this.state.getDivisionDataStatus === 3 || this.state.getInvitesStatus === 3
	
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
									<h5>Invites List</h5>
								</div>
								<div className="card-body">
									<ul>
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
					
					<Alert show={showSuccess} variant="success">
						<Alert.Heading>Success!</Alert.Heading>
						<hr />
						<p>
						  Successful!
						</p>
						<hr />
					</Alert>
					
					<Alert show={showError} variant="danger">
						<Alert.Heading>Error!</Alert.Heading>
						<hr />
						<p>
						  Failure!
						</p>
						<hr />
					</Alert>
				</div>
			</div>
		)
	}
}

export default withRouter(CompanyInvites);