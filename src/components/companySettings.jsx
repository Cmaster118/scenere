import React from "react";
import axios from "axios";

import { withRouter } from "react-router-dom";

const sorter = ["Public", "Private"]

class companySettings extends React.Component {
	
	constructor(props) {
        super(props);
		
		const today = new Date()
		
		this.state = {
			currentDate: today,
			
			messages: "Hello, there is nothing yet here...",
			
			dropMessage: 'Select Company=>',
			currentCompany: "None",
		
			companyList: [],
			
			dataCompanyName: 'No Company Selected',
			dataCompanyPriv: 'No Company Selected',
			
			dataCompanySendTo: [],
			dataCompanyViewing: [],
			dataCompanyGoverned: [],
			
			dataCompanySendToAdded: [],
			dataCompanyViewingAdded: [],
			dataCompanyGovernedAdded: [],
			
			dataCompanySendToDeleted: [],
			dataCompanyViewingDeleted: [],
			dataCompanyGovernedDeleted: [],
			
			searchSend: "",
			searchView: "",
			searchGov: "",
			addingEmail: "",
			
			clickedList: "",
			clickedIndex: -1,
        };
		
		
	};
	
	postNewCompanyData = () => {
		
		// Verify we have a proper company before we do anyting...
		if (this.state.currentCompany === "None") {
			console.log("No company selected")
			return false
		}
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
		
		const data = {
			// These will be checked by the permissions on the other end...
			//requestUser: "",
			companyName: this.state.currentCompany,
			companyReName: this.state.dataCompanyName,
			
			summaryViewAccess: this.state.dataCompanyPriv,
			
			resultsSendTargets: this.state.dataCompanySendTo,
			privateViewingPerms: this.state.dataCompanyViewing,
			governedUsers: this.state.dataCompanyGoverned,
			
		};
		
		// This will overwrite stuff, hand ready for the deletions
		// But HOW do I handle the addings?
		axios.post(this.props.APIHost +"/postCompanyData/", data, config )
		.then( res => { 
		
			//console.log(res)
			console.log("Success")
			
			this.setState({
				dataCompanySendToDeleted: [],
				dataCompanyViewingDeleted: [],
				dataCompanyGovernedDeleted: [],
			})
			
		})
		.catch( err => {
			// Change this depending on the error...
			if (err.response.status === 401) {
				this.props.forceLogout()
				this.props.history.push(this.props.reRouteTarget)
			}
		})
	}

	getCompanyList = () => {
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
		
		// This is bad, as it gets ALL companies...
		// But we SHOULD save it with the permissions...
		// So I need to make this better...
		axios.get(this.props.APIHost +"/getUsersCompanies", config)
		.then( 	res => {
				// Should respond with a 1 length thing
				if (res.data.length > 0) {
					// Normal behaviour
					console.log("Got the list of companies")
					//console.log(res)
					
					// Companies this user is 'owner' of
					//console.log(res.data[0].companyOwner)
					
					// Merge these three into a single set for viewing for now?
					let adding = []
					
					var index;
					for (index in res.data[0].companyOwner) {
						let name = res.data[0].companyOwner[index]
						if ( !adding.includes(name) ) {
							adding.push(name)
							//console.log(name)
						}							
					}					
					this.setState({companyList: adding})
				}
				else {
					// This should not trigger
				}
			})
			.catch( err => {
				if (err.response.status === 401) {
					this.props.forceLogout()
					this.props.history.push(this.props.reRouteTarget)
				}
			});
	}
	
	getCompanyData = (targetCompany) => {

		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
		
		axios.get(this.props.APIHost +"/getCompanyData?reqComp="+targetCompany+"", config)
		.then( 	res => {
				// Should respond with a 1 length thing
				if (res.data.length > 0) {
					// Normal behaviour
					console.log("Got the company data!")
					//console.log(res)
					
					this.setState({
						dataCompanyName: res.data[0].companyName,
						dataCompanyPriv: sorter[res.data[0].summaryViewAccess],
						dataCompanySendTo: res.data[0].resultsSendTargets,
						dataCompanyViewing: res.data[0].privateViewingPerms,
						dataCompanyGoverned: res.data[0].governedUsers,
					})
				}
				else {
					// This should not trigger
				}
			})
			.catch( err => {
				console.log(err)
				if (err.response.status === 401) {
					this.props.forceLogout()
					this.props.history.push(this.props.reRouteTarget)
				}
			});
	}
	
	sendChange = (event) => {
		this.setState( {searchSend: event.target.value} )
	}
	viewChange = (event) => {
		this.setState( {searchView: event.target.value} )
	}
	govChange = (event) => {
		this.setState( {searchGov: event.target.value} )
	}
	
	emailFieldChange = (event) => {
		this.setState( {addingEmail: event.target.value} )
	}
	
	triggerCompanySwap = (event) => {
		this.setState({
			dropMessage: event.target.value, 
			currentCompany: event.target.value
		})
		
		this.getCompanyData(event.target.value)
		
	}
	
	triggerModal = (event) => {
		
		//console.log(event.target.parentElement.id)
		//console.log(event.target.parentElement.parentElement.id)
		
		this.setState({
			clickedList: event.target.parentElement.parentElement.id,
			clickedIndex: event.target.parentElement.id,
		})
	}
	
	triggerStopAdd = (event) => {
		
		let subset = []
		if (event.target.parentElement.parentElement.id === "sendUsers") {
			subset = this.state.dataCompanySendToAdded
			subset.splice( event.target.parentElement.id, 1 )
			
			this.setState({
				dataCompanySendToAdded: subset
			})
		}
		else if (event.target.parentElement.parentElement.id === "viewUsers") {
			subset = this.state.dataCompanyViewingAdded
			subset.splice( event.target.parentElement.id, 1 )
			
			this.setState({
				dataCompanyViewingAdded: subset
			})
		}
		else if (event.target.parentElement.parentElement.id === "govUsers") {
			subset = this.state.dataCompanyGovernedAdded
			subset.splice( event.target.parentElement.id, 1 )
			
			this.setState({
				dataCompanyGovernedAdded: subset
			})
		}
	}
	
	triggerReAdd = (event) => {
		
		let subset = []
		if (event.target.parentElement.parentElement.id === "sendUsers") {
			subset = this.state.dataCompanySendToDeleted
			let reAdd = this.state.dataCompanySendTo
			reAdd.push( subset.splice( event.target.parentElement.id, 1 )[0] )
			
			this.setState({
				dataCompanySendTo: reAdd,
				dataCompanySendToDeleted: subset
			})
		}
		else if (event.target.parentElement.parentElement.id === "viewUsers") {
			subset = this.state.dataCompanyViewingDeleted
			let reAdd = this.state.dataCompanyViewing
			reAdd.push( subset.splice( event.target.parentElement.id, 1 )[0] )
			
			this.setState({
				dataCompanyViewing: reAdd,
				dataCompanyViewingDeleted: subset
			})
		}
		else if (event.target.parentElement.parentElement.id === "govUsers") {
			subset = this.state.dataCompanyGovernedDeleted
			let reAdd = this.state.dataCompanyGoverned
			reAdd.push( subset.splice( event.target.parentElement.id, 1 )[0] )
			
			this.setState({
				dataCompanyGoverned: reAdd,
				dataCompanyGovernedDeleted: subset
			})
		}
	}
	
	modelAddEmail = (event) => {
		//console.log( this.state.addingEmail )
		
		// Reusing a function, so this sits in a slightly wierdly named variable
		//console.log( this.state.clickedIndex )
		
		let newArray = []
		if (this.state.clickedIndex === "sendUsers") {
			newArray = this.state.dataCompanySendToAdded
			newArray.push( this.state.addingEmail )
			
			this.setState({
				dataCompanySendToAdded: newArray,
			})
		}
		else if (this.state.clickedIndex === "viewUsers") {
			newArray = this.state.dataCompanyViewingAdded
			newArray.push( this.state.addingEmail )
			
			this.setState({
				dataCompanyViewingAdded: newArray,
			})
		}
		else if (this.state.clickedIndex === "govUsers") {
			newArray = this.state.dataCompanyGovernedAdded
			newArray.push( this.state.addingEmail )
			
			this.setState({
				dataCompanyGovernedAdded: newArray,
			})
		}
		
		this.setState({
			addingEmail: "",
		})
	}
	
	modelAcceptDelete = (event) => {
		
		let subset = []
		if (this.state.clickedList === "sendUsers") {
			subset = this.state.dataCompanySendTo
			
			let deleteQueue = this.state.dataCompanySendToDeleted
			deleteQueue.push( subset.splice( this.state.clickedIndex, 1 )[0] )
			
			this.setState({
				dataCompanySendTo: subset,
				dataCompanySendToDeleted: deleteQueue
			})
		}
		else if (this.state.clickedList === "viewUsers") {
			subset = this.state.dataCompanyViewing
			
			let deleteQueue = this.state.dataCompanyViewingDeleted
			deleteQueue.push( subset.splice( this.state.clickedIndex, 1 )[0] )
			
			this.setState({
				dataCompanyViewing: subset,
				dataCompanyViewingDeleted: deleteQueue
			})
		}
		else if (this.state.clickedList === "govUsers") {
			subset = this.state.dataCompanyGoverned
			
			let deleteQueue = this.state.dataCompanyGovernedDeleted
			deleteQueue.push( subset.splice( this.state.clickedIndex, 1 )[0] )
			
			this.setState({
				dataCompanyGoverned: subset,
				dataCompanyGovernedDeleted: deleteQueue
			})
		}
	}

	render() {
		
		var dropDownInternal = []
		
		let index;
		for (index in this.state.companyList) {
			let comp = this.state.companyList[index]
			dropDownInternal.push( 
				<button className="dropdown-item" key={index} onClick={this.triggerCompanySwap} value={ comp }>
					{comp}
				</button> 
			)
		}
		
		// Send To Set
		let companySend = []
		for (index in this.state.dataCompanySendTo) {
			let userSet = this.state.dataCompanySendTo[index]
			
			if (userSet !== undefined) {
				
				if ( userSet.indexOf(this.state.searchSend) > -1) {
				
					companySend.push(
						<li key={index} id={index} className="list-group-item d-flex justify-content-between align-items-center">
							{userSet}
							<button className="btn btn-sm btn-outline-danger" data-toggle="modal" onClick={this.triggerModal} data-target="#deleteConfirm">x</button>
						</li>
					)
					
				}
			}
			
		}
		
		let companySendAdd = []
		for (index in this.state.dataCompanySendToAdded) {
			let userSet = this.state.dataCompanySendToAdded[index]
			
			companySendAdd.push(
				<li key={index} id={index} className="list-group-item d-flex justify-content-between align-items-center">
					{userSet}
					<button className="btn btn-sm btn-outline-danger" onClick={this.triggerStopAdd}>x</button>
				</li>
			)
		}
		
		let companySendDelete = []
		for (index in this.state.dataCompanySendToDeleted) {
			let userSet = this.state.dataCompanySendToDeleted[index]
			
			companySendDelete.push(
				<li key={index} id={index} className="list-group-item d-flex justify-content-between align-items-center">
					{userSet}
					<button className="btn btn-sm btn-outline-success" onClick={this.triggerReAdd}>+</button>
				</li>
			)
		}
		
		// Viewing Permission Sets
		let companyViewing = []
		for (index in this.state.dataCompanyViewing) {
			let userSet = this.state.dataCompanyViewing[index]
			
			if ( userSet.indexOf(this.state.searchView) > -1) {
			
				companyViewing.push(
					<li key={index} id={index} className="list-group-item d-flex justify-content-between align-items-center">
						{userSet}
						<button className="btn btn-sm btn-outline-danger" data-toggle="modal" onClick={this.triggerModal} data-target="#deleteConfirm">x</button>
					</li>
				)
			}
		}
		
		let companyViewingAdd = []
		for (index in this.state.dataCompanyViewingAdded) {
			let userSet = this.state.dataCompanyViewingAdded[index]
			
			companyViewingAdd.push(
				<li key={index} id={index} className="list-group-item d-flex justify-content-between align-items-center">
					{userSet}
					<button className="btn btn-sm btn-outline-danger" onClick={this.triggerStopAdd}>x</button>
				</li>
			)
		}
		
		let companyViewingDelete = []
		for (index in this.state.dataCompanyViewingDeleted) {
			let userSet = this.state.dataCompanyViewingDeleted[index]
			
			companyViewingDelete.push(
				<li key={index} id={index} className="list-group-item d-flex justify-content-between align-items-center">
					{userSet}
					<button className="btn btn-sm btn-outline-success" onClick={this.triggerReAdd}>+</button>
				</li>
			)
		}
		
		// Goverened Users List
		let governedList = []
		for (index in this.state.dataCompanyGoverned) {
			let userSet = this.state.dataCompanyGoverned[index]
			
			if ( userSet.indexOf(this.state.searchGov) > -1) {
			
				governedList.push(
					<li key={index} id={index} className="list-group-item d-flex justify-content-between align-items-center">
						{userSet}
						<button className="btn btn-sm btn-outline-danger" data-toggle="modal" onClick={this.triggerModal} data-target="#deleteConfirm">x</button>
					</li>
				)
			}
		}
		
		let companyGovernedAdd = []
		for (index in this.state.dataCompanyGovernedAdded) {
			let userSet = this.state.dataCompanyGovernedAdded[index]
			
			companyGovernedAdd.push(
				<li key={index} id={index} className="list-group-item d-flex justify-content-between align-items-center">
					{userSet}
					<button className="btn btn-sm btn-outline-danger" onClick={this.triggerStopAdd}>x</button>
				</li>
			)
		}
		
		let companyGovernedDelete = []
		for (index in this.state.dataCompanyGovernedDeleted) {
			let userSet = this.state.dataCompanyGovernedDeleted[index]
			
			companyGovernedDelete.push(
				<li key={index} id={index} className="list-group-item d-flex justify-content-between align-items-center">
					{userSet}
					<button className="btn btn-sm btn-outline-success" onClick={this.triggerReAdd}>+</button>
				</li>
			)
		}
		
		// There is probobly a better way to do this... But the model stuff may work if it is filled out this way
		let selectedUser = "None"
		if (this.state.clickedList === "sendUsers") {
			selectedUser = this.state.dataCompanySendTo[this.state.clickedIndex]
		}
		else if (this.state.clickedList === "viewUsers") {
			selectedUser = this.state.dataCompanyViewing[this.state.clickedIndex]
		}
		else if (this.state.clickedList === "govUsers") {
			selectedUser = this.state.dataCompanyGoverned[this.state.clickedIndex]
		}
		
		// Technically we can just use currentCompany but, hey! To error check I am going to use the response...
		return (
			<div className="companySett">
				<div className="container">
				
					<div className="row">
						<div className="col">
							<div className="dropdown">
							  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								{this.state.dropMessage}
							  </button>
							  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
								{dropDownInternal}
							  </div>
							</div>
						</div>
						<div className="col">
							<button className="btn btn-primary" onClick={this.getCompanyList}> Populate Company List </button>
						</div>
						<div className="col">
							<button className="btn btn-primary" onClick={this.postNewCompanyData}>Save Changes</button>
						</div>
					</div>
					
					<div className="row">
						<div className="col">
							<div className="card">
								<div className="card-header">
									<p>
										Edit Company name
									</p>
								</div>
								<div className="card-body">
									<p className="card-text">
										{this.state.dataCompanyName}
									</p>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card">
								<div className="card-header">
									<p>
										Private/Publix
									</p>
								</div>
								<div className="card-body">
									<p className="card-text">
										{this.state.dataCompanyPriv}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<div className="card">
								<div className="card-header">
									<p>
										Users Notified:
									</p>
								</div>
								<div className="card-body">
								
									<input className="form-control" id="" type="text" onChange={this.sendChange} placeholder="Search..."/>
									
									<ul className="card-text list-group" id="sendUsers">
										{companySend}
										
										<button type="button" className="list-group-item list-group-item-action active" data-toggle="modal" onClick={this.triggerModal} data-target="#addNewUsers">
											Add user +
										</button>
										
										<li key={"rem"} id={"remLabel"} className="list-group-item d-flex justify-content-between align-items-center">
											Users To Remove:
										</li>
										{companySendDelete}
										
										<li key={"add"} id={"addLabel"} className="list-group-item d-flex justify-content-between align-items-center">
											Emails To Add:
										</li>
										{companySendAdd}
									</ul>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card">
								<div className="card-header">
									<p>
										Viewing Privilages:
									</p>
								</div>
								<div className="card-body">
								
									<input className="form-control" id="" type="text" onChange={this.viewChange} placeholder="Search..."/>
								
									<ul className="card-text list-group"  id="viewUsers">
										{companyViewing}
										
										<button type="button" className="list-group-item list-group-item-action active" data-toggle="modal" onClick={this.triggerModal} data-target="#addNewUsers">
											Add user +
										</button>
										
										<li key={"rem"} id={"remLabel"} className="list-group-item d-flex justify-content-between align-items-center">
											Users To Remove:
										</li>
										{companyViewingDelete}
										
										<li key={"add"} id={"addLabel"} className="list-group-item d-flex justify-content-between align-items-center">
											Emails To Add:
										</li>
										{companyViewingAdd}
									</ul>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card">
								<div className="card-header">
									<p>
										Target Users:
									</p>
								</div>
								<div className="card-body">
								
									<input className="form-control" id="" type="text" onChange={this.govChange} placeholder="Search..."/>
								
									<ul className="card-text list-group"  id="govUsers">
										{governedList}
										
										<button type="button" className="list-group-item list-group-item-action active" data-toggle="modal" onClick={this.triggerModal} data-target="#addNewUsers">
											Add user +
										</button>
										
										<li key={"rem"} id={"remLabel"} className="list-group-item d-flex justify-content-between align-items-center">
											Users To Remove:
										</li>
										{companyGovernedDelete}
										
										<li key={"add"} id={"addLabel"} className="list-group-item d-flex justify-content-between align-items-center">
											Emails To Add:
										</li>
										{companyGovernedAdd}
									</ul>
								</div>
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
						Are you SURE you want to delete user: {selectedUser}?
						They will be notified about this change.
					  </div>
					  <div className="modal-footer">
						<button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.modelAcceptDelete}>Yes</button>
						<button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
					  </div>
					</div>
				  </div>
				</div>
				
				<div className="modal fade" id="addNewUsers" tabIndex="-1" role="dialog" aria-labelledby="addNewUsersModal" aria-hidden="true">
				  <div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
					  <div className="modal-header">
						<h5 className="modal-title" id="deleteTitleConfirm">Add New User</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
						</button>
					  </div>
					  <div className="modal-body">
						Enter the email of the target user
					  </div>
					  <div className='form-group'>
						<label>Email Address</label>
						<input type='email' className='form-control' value={this.state.addingEmail} onChange={this.emailFieldChange} placeholder='Enter email' />
					  </div>
					  <div className="modal-footer">
						<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.modelAddEmail}>Add</button>
						<button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
					  </div>
					</div>
				  </div>
				</div>
				
			</div>
		)
	}
}

export default withRouter(companySettings);