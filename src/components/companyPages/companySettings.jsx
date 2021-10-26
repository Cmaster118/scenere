import React from "react";

import { APIDivisionSettingsEdit, APIDivisionSettingsGet } from "../../utils";
import { withRouter } from "react-router-dom";
import { Alert } from 'react-bootstrap';

const viewingPermsCheck = ['Public', 'Private', 'Governed Users']
const debugPageName = "Division Settings"

class CompanySettings extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			newViewPerms: 0,
			viewPerms: -1,
			
			expiryDate: "No Data",
			
			companyFullName: "No Data",
			divisionName: "No Data",
			
			getSettingsStatus: 0,
			getSettingsError: [],
			
			saveChangesStatus: 0,
			saveChangesError: [],
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
			getSettingsStatus: 3,
			getSettingsError: returnData,
		})
	}
	getSuccess = (successData) => {
		//console.log("Get Data Success")
		
		this.props.debugSet(debugPageName, "Get Division Data", "Success")
		this.setState({
		
			companyFullName: successData["fullPathName"],
			divisionName: successData["divisionName"],
			
			expiryDate: successData["getCompanyExpiryDate"],
			
			viewPerms: successData["summaryViewAccess"],
			
			getSettingsStatus: 2,
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
					getSettingsStatus: 1,
				})
			}
			else {
				console.log("Data will do here...")
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
			this.props.debugSet(debugPageName, "Refresh Triggered", "Get Division Data Settings")
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
		
		this.props.debugSet(debugPageName, "Get Division Data Settings", "Failure")
		returnData = responseData['messages']
		this.setState({
			saveChangesStatus: 3,
			saveChangesError: returnData,
		})
	}
	setSuccess = (successData) => {
		//console.log("Set Data Success")
		//console.log(successData)
		
		this.props.debugSet(debugPageName, "Get Division Data Settings", "Success")
		this.props.triggerRefresh()
		
		this.setState({
			saveChangesStatus: 2,
		})
	}
	saveChanges = () => {
		
		// I will need to put a validator in here... Definetly...
		// For now I will not allow it...
		let chName = ""
		
		let testData = {
			"reqDiv": this.props.currentDivisionID,
			
			"chName": chName,
		}
		
		APIDivisionSettingsEdit(  testData, this.setSuccess, this.setFailure )
		this.setState({
			saveChangesStatus: 1,
		})
	}
	
	divisionFieldChange = (event) => {
		this.setState({
			divisionName: event.target.value,
		})
	}
	
	triggerDropdown = (event) => {
		this.setState({
			viewPerms:event.target.name,
		})
	}
	
	render() {
		
		//let showIdle = this.state.getSettingsStatus === 0
		let showWaiting = this.state.getSettingsStatus === 1
		let showSuccess = false//this.state.getSettingsStatus === 2
		let showError = this.state.getSettingsStatus === 3
	
		let errorParse = []
		for (let index in this.state.getSettingsError) {
			errorParse.push(
				this.state.getSettingsError[index]["text"]
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
									<h5>Full Company Path</h5>
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
									<h5>Change Division Name</h5>
								</div>
								<div className="card-body">
									<div>
										<input type='text' className='form-control' value={this.state.divisionName} onChange={this.divisionFieldChange} placeholder='No Name?!' />
									</div>
								</div>
							</div>
						</div>
					</div>
				
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Viewing Permissions</h5>
								</div>
								<div className="card-body">
									<div className="dropdown">
										<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
											{viewingPermsCheck[this.state.viewPerms]}
										</button>
										<div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
											<button className="dropdown-item" name="0" onClick={this.triggerDropdown}>Public</button>
											<button className="dropdown-item" name="1" onClick={this.triggerDropdown}>Private</button>
											<button className="dropdown-item" name="2" onClick={this.triggerDropdown}>Governed Users</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Subscription Expiry</h5>
								</div>
								<div className="card-body d-inline-flex justify-content-around">
									{this.state.expiryDate}
								</div>
							</div>
						</div>
					</div>
					
					<button className="btn btn-primary" onClick={this.saveChanges} disabled>
						Save Changes
					</button>
					
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
						  Successfully obtained data!
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
					
				</div>
			</div>
		)
	}
}

export default withRouter(CompanySettings);