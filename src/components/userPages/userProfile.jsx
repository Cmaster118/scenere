import React from "react";

import { withRouter } from "react-router-dom";
import { APIUserSettingsEdit} from "../../utils";

// Trying this in function form instead of class
class UserProfile extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			delViews:[],
			togSends: [],
			delGoverns: [],
        };
	}
	
	toggleDelete = (event) => {
		let valueInt = Number(event.target.value)
		//console.log("Leave")
		//console.log(valueInt)
		
		let temp = []
		let index = -1
		switch(event.target.name) {
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
					delGoverns: temp,
				})
				break;
			case "sen":
				temp = this.state.togSends.slice()
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
					togSends: temp,
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
					delViews: temp,
				})
				break;
			default:
				console.log("Failed to have the correct name")
		}
	}
	
	setSuccess = (successData) => {
		console.log("Set Data Success")
		console.log(successData)
		
		// This needs to be a props refresh..
		this.props.triggerRefresh()
	}
	setFailure = (errorCodes, errorMessages) => {
		console.log("Set Data Failure")
		console.log(errorCodes)
		console.log(errorMessages)
	}
	saveChanges = () => {
		let testData = {
			
			// Hmm, perhaps the generic way wont work...
			//"delViews":this.state.delViews,
			"togEmails":this.state.togSends,
			"delGovern":this.state.delGoverns,
		}
		
		APIUserSettingsEdit( this.props.APIHost, this.props.authToken, testData, this.setSuccess, this.setFailure )
	}
	
	render() {
		
		let displayViewSends = []
		if (this.props.viewNameList.length > 0) {
			for (let i in this.props.viewNameList) {
				let extra = ""
				// Blank will just be admin/view for now... Highlighted in green means Email...
				let index = this.props.sendIDList.indexOf(this.props.viewIDList[i])
				if (index >= 0) {
					extra = 'bg-success'
				}
				// Sends we are toggling....
				index = this.state.togSends.indexOf(this.props.viewIDList[i])
				if (index >= 0) {
					extra = 'bg-warning'
				}
				// Views we are deleting
				index = this.state.delViews.indexOf(this.props.viewIDList[i])
				if (index >= 0) {
					extra = 'bg-danger'
				}
				
				displayViewSends.push(
					<li key={i} className={"list-group-item d-flex justify-content-around "+extra}>
						{this.props.viewNameList[i]}
						<button className="badge badge-success badge-pill" name="sen" value={this.props.viewIDList[i]} onClick={this.toggleDelete}>View</button>
						<button className="badge badge-danger badge-pill" name="vie" value={this.props.viewIDList[i]} onClick={this.toggleDelete}>X</button>
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
		if (this.props.governedNameList.length > 0) {
			for (let i in this.props.governedNameList) {
				let extra = ""
				let index = this.state.delGoverns.indexOf(this.props.governedIDList[i])
				if (index >= 0) {
					extra = 'bg-danger'
				}
				
				displayOwningCompanyList.push(
					<li key={i} className={"list-group-item d-flex justify-content-around "+extra}>
						{this.props.governedNameList[i]}
						<button className="badge badge-danger badge-pill" name="gov" value={this.props.governedIDList[i]} onClick={this.toggleDelete}>X</button>
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
									<button className="btn btn-secondary" data-toggle="modal" data-target="#deleteConfirm">
										Confirm
									</button>
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
									<button className="btn btn-secondary" data-toggle="modal" data-target="#deleteConfirm">
										Confirm
									</button>
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