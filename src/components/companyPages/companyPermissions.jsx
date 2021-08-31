import React from "react";

import { APIDivisionSettingsEdit, APIDivisionSettingsGet } from "../../utils";
import { withRouter } from "react-router-dom";
import { Alert } from 'react-bootstrap';

class CompanyPermissions extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			companyFullName: "No Data",
			divisionName: "No Data",
			
			adminsIDs: [],
			viewsIDs: [],
			sendsIDs: [],
			governsIDs: [],
			
			admins: [],
			views: [],
			sends: [],
			governs: [],
			
			delAdmins: [],
			delViews: [],
			delSends: [],
			delGoverns: [],
			
			numChild: 0,
			
			getPermissionsStatus: 0,
			getPermissionsError: [],
			setPermissionsStatus: 0,
			setPermissionsError: [],
		}
	}
	
	componentDidMount() {
		this.tiggerReload()
	};
	
	tiggerReload = () => {
		this.getDivisionData()
	}
	
	getFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
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
		
		returnData = responseData['messages']
		this.setState({
			getPermissionsStatus: 3,
			getPermissionsError: returnData,
		})
	}
	getSuccess = (successData) => {
		//console.log("Get Data Success")
		this.setState({
		
			companyFullName: successData["fullPathName"],
			divisionName: successData["divisionName"],
			numChild: successData["getNumChildUsers"],
			
			admins: successData["adminAccountNames"],
			views: successData["privateViewingNames"],
			sends: successData["resultsSendTargetsNames"],
			governs: successData["governedUsersNames"],
			
			adminsIDs: successData["adminAccounts"],
			viewsIDs: successData["privateViewingPerms"],
			sendsIDs: successData["resultsSendTargets"],
			governsIDs: successData["governedUsers"],
			
			delAdmins: [],
			delViews: [],
			delSends: [],
			delGoverns: [],
			
			getPermissionsStatus: 2,
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
					getPermissionsStatus: 1,
				})
			}
			else {
				//console.log("Data will do here...")
				this.getSuccess(checkData)
			}
			
		}
	}
	
	setFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.saveChanges)
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
		
		returnData = responseData['messages']
		this.setState({
			setPermissionsStatus: 3,
			setPermissionsError: returnData,
		})
	}
	setSuccess = (successData) => {
		console.log("Set Data Success")
		console.log(successData)
		
		this.props.triggerRefresh()
		
		this.setState({
			setPermissionsStatus: 2,
		})
	}
	saveChanges = () => {
		
		// I will need to put a validator in here... Definetly...
		// For now I will not allow it...
		let chName = ""
		
		let testData = {
			"reqDiv": this.props.currentDivisionID,
			
			"chName": chName,
			
			"delAdmins": this.state.delAdmins,
			"delViews": this.state.delViews,
			"delEmails": this.state.delSends,
			"delGovern": this.state.delGoverns,
		}
		
		APIDivisionSettingsEdit(  testData, this.setSuccess, this.setFailure )
		this.setState({
			setPermissionsStatus: 1,
		})
	}
	
	toggleDelete = (event) => {
		
		let splitEvent = event.target.value.split(",")
		let valueNameIndex = Number(splitEvent[0])
		let valueInt = Number(splitEvent[1])
		
		let selectedName = "No Name!"
		
		let tempAdm = []
		let tempVie = []
		let tempSen = []
		let tempGov = []
		switch(event.target.name) {
			case "adm":
				tempAdm.push( valueInt )
				selectedName = this.state.admins[valueNameIndex]
				break;
				
			case "vie":
				tempVie.push( valueInt )
				selectedName = this.state.views[valueNameIndex]
				break;
				
			case "sen":
				tempSen.push( valueInt )
				selectedName = this.state.sends[valueNameIndex]
				break;
				
			case "gov":
				tempGov.push( valueInt )
				selectedName = this.state.governs[valueNameIndex]
				break;
				
			default:
				console.log("Failed to have the correct name")
		}
		
		this.setState({
			delAdmins:tempAdm,
			delViews:tempVie,
			delSends:tempSen,
			delGoverns:tempGov,
			
			selectedName: selectedName,
		})
	}
	
	render() {
		let adminUserList = []
		for (let i in this.state.admins) {
			let extra = ""
			let index = this.state.delAdmins.indexOf(this.state.adminsIDs[i])
			if (index >= 0) {
				extra = 'bg-warning'
			}
			
			adminUserList.push(
				<li className={"list-group-item d-flex justify-content-around"+extra} key={i}>
					{this.state.admins[i]}
					{/*<button className="badge badge-danger badge-pill" name="adm" value={ [i, adminsIDs[i]] } onClick={toggleDelete}>
						X
					</button>*/}
				</li>
			)
		}
		if (this.state.admins.length === 0) {
			adminUserList.push(
				<li className="list-group-item" key={0}>
					No Users!
				</li>
			)
		}
		
		let viewingUserList = []
		for (let i in this.state.views) {
			let extra = ""
			let index = this.state.delViews.indexOf(this.state.viewsIDs[i])
			if (index >= 0) {
				extra = 'bg-warning'
			}
			
			viewingUserList.push(
				<li className={"list-group-item d-flex justify-content-around "+extra} key={i}>
					{this.state.views[i]}
					<button className="badge badge-danger badge-pill" name="vie" value={ [i, this.state.viewsIDs[i]] } data-toggle="modal" data-target="#deleteConfirm" onClick={this.toggleDelete}>
						X
					</button>
				</li>
			)
		}
		if (this.state.views.length === 0) {
			viewingUserList.push(
				<li className="list-group-item" key={0}>
					No Users!
				</li>
			)
		}
		
		let sentUserList = []
		for (let i in this.state.sends) {
			let extra = ""
			let index = this.state.delSends.indexOf(this.state.sendsIDs[i])
			if (index >= 0) {
				extra = 'bg-warning'
			}
			
			sentUserList.push(
			<li className={"list-group-item d-flex justify-content-around "+extra} key={i}>
					{this.state.sends[i]}
					{/*
					<button className="badge badge-danger badge-pill" name="sen" value={ [i, this.state.sendsIDs[i]] } data-toggle="modal" data-target="#deleteConfirm" onClick={this.toggleDelete}>
						X
					</button>
					*/}
				</li>
			)
		}
		if (this.state.sends.length === 0) {
			sentUserList.push(
				<li className="list-group-item" key={0}>
					No Users!
				</li>
			)
		}

		let governedUserList = []
		for (let i in this.state.governs) {
			
			let extra = ""
			let index = this.state.delGoverns.indexOf(this.state.governsIDs[i])
			if (index >= 0) {
				extra = 'bg-warning'
			}
			
			governedUserList.push(
				<li className={"list-group-item d-flex justify-content-around "+extra} key={i}>
					{this.state.governs[i]}
					<button className="badge badge-danger badge-pill" name="gov" value={ [i, this.state.governsIDs[i]] } data-toggle="modal" data-target="#deleteConfirm" onClick={this.toggleDelete}>
						X
					</button>
				</li>
			)
		}	
		if (this.state.governs.length === 0) {
			governedUserList.push(
				<li className="list-group-item" key={0}>
					No Users!
				</li>
			)
		}
		governedUserList.push(
			<li className="list-group-item" key={"end"}>
				And {this.state.numChild} others in child nodes
			</li>
		)
		
		//let showIdle = this.state.setPermissionsStatus === 0
		let showWaiting = this.state.setPermissionsStatus === 1 || this.state.getPermissionsStatus === 1
		let showSuccess = this.state.setPermissionsStatus === 2 //|| this.state.getPermissionsStatus === 2 
		let showError = this.state.setPermissionsStatus === 3 || this.state.getPermissionsStatus === 3
		
		let errorParse = []
		for (let index in this.state.getPermissionsError) {
			errorParse.push(
				this.state.getPermissionsError[index]["text"]
			)
		}
		for (let index in this.state.getPermissionsError) {
			errorParse.push(
				this.state.getPermissionsError[index]["text"]
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
									<h5>Changing Permissions for:</h5>
								</div>
								<div className="card-body">
									{this.state.companyFullName}
								</div>
							</div>
						</div>
					</div>
					
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Administrators</h5>
								</div>
								<div className="card-body">
									{adminUserList}
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow">
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
						
						{/*
						<div className="col">
							<div className="card shadow">
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
						*/}
					</div>
					
					<div className="row">
						<div className="col">
							<div className="card shadow">
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
						  Successfull!
						</p>
						<hr />
					</Alert>
					
					<Alert show={showError} variant="danger">
						<Alert.Heading>Error!</Alert.Heading>
						<hr />
						<p>
							{errorParse}
						</p>
						<hr />
					</Alert>
					
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
							<div>Are you SURE you want to revoke permission for:</div>
							<div>{this.state.selectedName}?</div>
							<div>You will need to reinvite the user!</div>
						  </div>
						  <div className="modal-footer">
							<button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.saveChanges}>Yes</button>
							<button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
						  </div>
						</div>
					  </div>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(CompanyPermissions);