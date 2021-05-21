import React from "react";

import { APIDivisionSettingsEdit, APIDivisionSettingsGet } from "../../utils";
import { withRouter } from "react-router-dom";

const viewingPermsCheck = ['Public', 'Private', 'Governed Users']

class CompanySettings extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			newViewPerms: 0,
			viewPerms: -1,
			
			expiryDate: "No Data",
			
			companyFullName: "No Data",
			divisionName: "No Data",
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
			
			expiryDate: successData["getCompanyExpiryDate"],
			
			viewPerms: successData["summaryViewAccess"],
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
				console.log("Data will do here...")
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
		}
		
		APIDivisionSettingsEdit( this.props.APIHost, this.props.authToken, testData, this.setSuccess, this.setFailure )
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
				</div>
			</div>
		)
	}
}

export default withRouter(CompanySettings);