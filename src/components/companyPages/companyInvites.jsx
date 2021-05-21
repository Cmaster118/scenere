import React from "react";

import { APIDivisionInvitesCreate, APIDivisionInvitesSet, APIDivisionSettingsGet, APIDivisionInvitesGet } from "../../utils";
import { withRouter } from "react-router-dom";

const inviteType = ['Invalid', 'Admin', 'Viewer', 'Governed']

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
		}
	}
	
	componentDidMount() {
		this.tiggerReload()
	};
	
	tiggerReload = () => {
		this.getDivisionData()
		this.getDivisionsInvites()
	}
	
	getSuccess = (successData) => {
		//console.log("Get Data Success")
		this.setState({
			companyFullName: successData["fullPathName"],
			divisionName: successData["divisionName"],
			inviteCode: successData["inviteCode"],
		})
	}
	getFailure = (errorCodes, errorMessages) => {
		console.log("Get Data Failure")
		console.log(errorCodes)
		console.log(errorMessages)
	}
	getDivisionData = () => {
		// Verify that the division is valid?
		if (this.props.currentDivisionID >= 0) {
			let checkData = undefined//Store.get(props.currentDivisionID+"-Data")
			if (checkData === undefined) {
				console.log("Requesting Division Data From Server...")
				APIDivisionSettingsGet( this.props.APIHost, this.props.authToken, this.props.currentDivisionID, this.getSuccess, this.getFailure )
			}
			else {
				console.log("Data will do here...")
				this.getSuccess(checkData)
			}
			
		}
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
		})
	}
	getInvitesFailure = (errorCodes, errorMessages) => {
		console.log("Get Invites Failure")
		console.log(errorCodes)
		console.log(errorMessages)
	}
	getDivisionsInvites = () => {
		if (this.props.currentDivisionID >= 0) {
			let checkData = undefined//Store.get(props.currentDivisionID+"-Invites")
			if (checkData === undefined) {
				APIDivisionInvitesGet( this.props.APIHost, this.props.authToken, this.props.currentDivisionID, this.getInvitesSuccess, this.getInvitesFailure )
			}
			else {
				console.log("Data will do here...")
				this.getInvitesSuccess(checkData)
			}
		}
	}
	
	inviteSuccess = (successData) => {
		console.log("Create Invite Success")
		console.log(successData)
	}
	inviteFailure = (errorCodes, errorMessages) => {
		console.log("Create Invite Failure")
		console.log(errorCodes)
		console.log(errorMessages)
		
		//triggerLogout?
	}
	inviteUser = (event) => {
		console.log("Send Invite")
		
		APIDivisionInvitesCreate( this.props.APIHost, this.props.authToken, this.props.currentDivisionID, this.state.targetUser, this.state.targetRole, this.inviteSuccess, this.inviteFailure )
	}
	
	spendInviteSuccess = (successData) => {
		console.log("Spend Invite Success")
		console.log(successData)
		
		this.tiggerReload()
	}
	spendInviteFailure = (errorCodes, errorMessages) => {
		console.log("Spend Invite Failure")
		console.log(errorCodes)
		console.log(errorMessages)
		
		this.getDivisionsInvites()
	}
	inviteYes = (event) => {
		console.log("Accept")
		
		// Lets do... 0 == Cancel
		// 1 == Accept
		let action = 1
		let targetInvite = event.target.value
		APIDivisionInvitesSet( this.props.APIHost, this.props.authToken, this.props.currentDivisionID, targetInvite, action, this.spendInviteSuccess, this.spendInviteFailure )
	}
	inviteNo = (event) => {
		console.log("Deny")

		// 0 == Cancel
		// 1 == Accept
		let action = 0
		let targetInvite = event.target.value
		
		APIDivisionInvitesSet( this.props.APIHost, this.props.authToken, this.props.currentDivisionID, targetInvite, action, this.spendInviteSuccess, this.spendInviteFailure )
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
					<div>
						{this.state.inviteNamesList[i]}
					</div>
					<div>
						{this.state.inviteRolesList[i]}
					</div>
					<button className="badge badge-success badge-pill" value={this.state.inviteIDList[i]} onClick={this.inviteYes}>/</button>
					<button className="badge badge-danger badge-pill" value={this.state.inviteIDList[i]} onClick={this.inviteNo}>X</button>
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
							<div className="card shadow">
								<div className="card-header">
									<h5>Invite Code</h5>
								</div>
								<div className="card-body">
									{this.state.inviteCode}
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Invite User</h5>
								</div>
								<div className="card-body">
									<div className="row">
										<div className="col">
												<input type='text' className='form-control' value={this.state.targetUser} onChange={this.userFieldChange} placeholder='Enter Username or Email' />
										</div>
										<div className="col">
											<div className="dropdown">
												<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													{showTargetRole}
												</button>
												<div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
													<button className="dropdown-item" value="1" onClick={this.triggerDropdown}>Admin</button>
													<button className="dropdown-item" value="2" onClick={this.triggerDropdown}>View Permissions</button>
													<button className="dropdown-item" value="3" onClick={this.triggerDropdown}>Governed User</button>
												</div>
											</div>
										</div>
									</div>
									<button className="btn btn-primary" onClick={this.inviteUser}>
										Invite
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(CompanyInvites);