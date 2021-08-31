import React from "react";

import { withRouter } from "react-router-dom";
import { APIUserSettingsEdit} from "../../utils";
import { Alert } from 'react-bootstrap';

// Trying this in function form instead of class
class UserProfile extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			delViews:[],
			togSends: [],
			delGoverns: [],
			
			viewSubList: this.initViews(),
			sendSubList: this.initSends(),
			govSubList: this.initGovs(),
			
			selectedName: "No Name!",
			saveChangesStatus: 0,
			saveChangesError: [],
        };
	}
	
	initViews = () => {
		let viewSubList = []
		for (let index in this.props.userLoadedCompanyList) {
			// View
			if (this.props.userLoadedCompanyList[index]["perm"].indexOf(1) > -1 ) {
				viewSubList.push(this.props.userLoadedCompanyList[index])
			}
		}
		return viewSubList
	}
	
	initSends = () => {
		let sendSubList = []
		for (let index in this.props.userLoadedCompanyList) {
			// Send
			if (this.props.userLoadedCompanyList[index]["perm"].indexOf(2) > -1 ) {
				sendSubList.push(this.props.userLoadedCompanyList[index])
			}
		}
		return sendSubList
	}
	
	initGovs = () => {
		let govSubList = []
		for (let index in this.props.userLoadedCompanyList) {
			// Govern
			if (this.props.userLoadedCompanyList[index]["perm"].indexOf(3) > -1 ) {
				govSubList.push(this.props.userLoadedCompanyList[index])
			}
		}
		return govSubList
	}
	
	setCurrentData = (event) => {
		
		let valueIndex = Number(event.target.value)
		
		let selectedName = "No Name!"
		//console.log("Leave")
		//console.log(valueInt)
		
		let tempGov = []
		let tempSen = []
		let tempVie = []
		switch(event.target.name) {
			case "gov":
				tempGov.push( this.state.govSubList[valueIndex]["id"] )
				selectedName = this.state.govSubList[valueIndex]["fullname"]
				break;
			case "sen":
				tempSen.push( this.state.viewSubList[valueIndex]["id"] )
				selectedName = this.state.viewSubList[valueIndex]["fullname"]
				break;
			case "vie":
				tempVie.push( this.state.viewSubList[valueIndex]["id"] )
				selectedName = this.state.viewSubList[valueIndex]["fullname"]
				break;
			default:
				console.log("Failed to have the correct name")
		}
		
		this.setState({
			delGoverns: tempGov,
			togSends: tempSen,
			delViews: tempVie,
			
			selectedName: selectedName,
		})
	}
	
	setFailure = (responseData) => {
		let returnData = []
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.saveChanges())
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
			saveChangesError: returnData,
			saveChangesStatus: 3,
		})
	}
	setSuccess = (successData) => {
		console.log("Set Data Success")
		console.log(successData)
		
		// This needs to be a props refresh..
		this.props.triggerRefresh()
		this.setState({
			saveChangesStatus: 2,
		})
	}
	saveChanges = () => {
		let testData = {
			
			// Hmm, perhaps the generic way wont work...
			"delViews":this.state.delViews,
			"togEmails":this.state.togSends,
			"delGoverns":this.state.delGoverns,
		}
		
		APIUserSettingsEdit(  testData, this.setSuccess, this.setFailure )
		
		this.setState({
			delGoverns: [],
			togSends: [],
			delViews: [],
			
			selectedName: "No Name!",
			saveChangesStatus: 1,
		})
	}
	
	render() {
		
		let displayViewSends = []
		if (this.state.viewSubList.length > 0) {
			for (let i in this.state.viewSubList) {
				let extra = ""
				// Blank will just be admin/view for now... Highlighted in green means Email...
				let index = this.state.sendSubList.indexOf(this.state.viewSubList[i])
				if (index >= 0) {
					extra = 'bg-info'
				}
				
				// Sends we are toggling....
				index = this.state.togSends.indexOf(this.state.viewSubList[i]["id"])
				if (index >= 0) {
					extra = 'bg-warning'
				}
				// Views we are deleting
				index = this.state.delViews.indexOf(this.state.viewSubList[i]["id"])
				if (index >= 0) {
					extra = 'bg-danger'
				}
				
				displayViewSends.push(
					<li key={i} className={"list-group-item d-flex justify-content-around "+extra}>
						<div className="col alignOverride">
							{this.state.viewSubList[i]["fullname"]}
						</div>
						<div className="col-2">
							<button className="badge badge-success badge-pill" name="sen" value={i} data-toggle="modal" data-target="#viewToggleConfirm" onClick={this.setCurrentData}>View</button>
						</div>
						<div className="col-1">
							<button className="badge badge-danger badge-pill" name="vie" value={i} data-toggle="modal" data-target="#deleteConfirm" onClick={this.setCurrentData}>X</button>
						</div>
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
		if (this.state.govSubList.length > 0) {
			for (let i in this.state.govSubList) {
				let extra = ""
				
				let index = this.state.delGoverns.indexOf(this.state.govSubList[i]["id"])
				if (index >= 0) {
					extra = 'bg-danger'
				}
				
				displayOwningCompanyList.push(
					<li key={i} className={"list-group-item d-flex justify-content-around "+extra}>
						<div className="col alignOverride">
							{this.state.govSubList[i]["fullname"]}
						</div>
						<div className="col-1">
							<button className="badge badge-danger badge-pill" name="gov" value={i} data-toggle="modal" data-target="#deleteConfirm" onClick={this.setCurrentData}>X</button>
						</div>
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

		//let showIdle = this.state.saveChangesStatus === 0
		let showWaiting = this.state.saveChangesStatus === 1
		let showSuccess = false//this.state.saveChangesStatus === 2
		let showError = this.state.saveChangesStatus === 3
		
		let errorParse = []
		for (let index in this.state.saveChangesError) {
			errorParse.push(
				this.state.saveChangesError[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}

		return (
			<div className="defaultView">
				<div className="container">
					
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Companies you can View data for</h5>
								</div>
								<div className="card-body">
									<ul className="list-group">
										{displayViewSends}
									</ul>
								</div>
							</div>
						</div>
					</div>
					
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Companies getting your Journal Info</h5>
								</div>
								<div className="card-body">
									<ul className="list-group">
										{displayOwningCompanyList}
									</ul>
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
							<div>Are you SURE you want to revoke permission for:</div>
							<div>{this.state.selectedName}?</div>
							<div>You will need to be invited back!</div>
						  </div>
						  <div className="modal-footer">
							<button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.saveChanges}>Yes</button>
							<button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
						  </div>
						</div>
					  </div>
					</div>
					
					<div className="modal fade" id="viewToggleConfirm" tabIndex="-1" role="dialog" aria-labelledby="viewToggleConfirm" aria-hidden="true">
					  <div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
						  <div className="modal-header">
							<h5 className="modal-title" id="deleteTitleConfirm">Toggle Notification Confirmation</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							  <span aria-hidden="true">&times;</span>
							</button>
						  </div>
						  <div className="modal-body">
							<div>Are you SURE you want to toggle notifications for:</div>
							<div>{this.state.selectedName}?</div>
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

export default withRouter(UserProfile);