import React from "react";

import { APIDivisionSettingsEdit, APIDivisionSettingsGet } from "../../utils";
import { withRouter } from "react-router-dom";

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
		}
	}
	
	componentDidMount() {
		this.tiggerReload()
	};
	
	tiggerReload = () => {
		this.getDivisionData()
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
				//console.log("Requesting Division Data From Server...")
				APIDivisionSettingsGet( this.props.APIHost, this.props.authToken, this.props.currentDivisionID, this.getSuccess, this.getFailure )
			}
			else {
				//console.log("Data will do here...")
				this.getSuccess(checkData)
			}
			
		}
	}
	
	setSuccess = (successData) => {
		console.log("Set Data Success")
		console.log(successData)
		
		this.props.triggerRefresh()
	}
	setFailure = (errorCodes, errorMessages) => {
		console.log("Set Data Failure")
		console.log(errorCodes)
		console.log(errorMessages)
		
		//triggerLogout?
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
		
		APIDivisionSettingsEdit( this.props.APIHost, this.props.authToken, testData, this.setSuccess, this.setFailure )
	}
	
	toggleDelete = (event) => {
		
		let valueInt = Number(event.target.value)
		
		let temp = []
		let index = -1
		switch(event.target.name) {
			case "adm":
				temp = this.state.delAdmins.slice()
				// It was NOT found, so add it
				index = temp.indexOf( valueInt )
				if ( index === -1) {
					temp.push( valueInt )
				}
				// It WAS found, so delete it
				else {
					temp.splice(index, 1)
				}
				this.setState({
					delAdmins:temp,
				})
				break;
				
			case "vie":
				temp = this.state.delViews.slice()
				// It was NOT found, so add it
				index = temp.indexOf( valueInt )
				if ( index === -1) {
					temp.push( valueInt )
				}
				// It WAS found, so delete it
				else {
					temp.splice(index, 1)
				}
				this.setState({
					delViews:temp,
				})
				break;
				
			case "sen":
				temp = this.state.delSends.slice()
				// It was NOT found, so add it
				index = temp.indexOf( valueInt )
				if ( index === -1) {
					temp.push( valueInt )
				}
				// It WAS found, so delete it
				else {
					temp.splice(index, 1)
				}
				this.setState({
					delSends:temp,
				})
				break;
				
			case "gov":
				temp = this.state.delGoverns.slice()
				// It was NOT found, so add it
				index = temp.indexOf( valueInt )
				if ( index === -1) {
					temp.push( valueInt )
				}
				// It WAS found, so delete it
				else {
					temp.splice(index, 1)
				}
				this.setState({
					delGoverns:temp,
				})
				break;
				
			default:
				console.log("Failed to have the correct name")
		}
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
					{/*<button className="badge badge-danger badge-pill" name="adm" value={adminsIDs[i]} onClick={toggleDelete}>
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
					<button className="badge badge-danger badge-pill" name="vie" value={this.state.viewsIDs[i]} onClick={this.toggleDelete}>
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
					<button className="badge badge-danger badge-pill" name="sen" value={this.state.sendsIDs[i]} onClick={this.toggleDelete}>
						X
					</button>
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
					<button className="badge badge-danger badge-pill" name="gov" value={this.state.governsIDs[i]} onClick={this.toggleDelete}>
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
					
					<button className="btn btn-primary" onClick={this.saveChanges}>
						Save Changes
					</button>
				</div>
			</div>
		)
	}
}

export default withRouter(CompanyPermissions);