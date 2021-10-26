import React from "react";

import { withRouter } from "react-router-dom";
import { APIUserInvitesGet, APIUserInvitesSet, APIUserInviteCode } from "../../utils";
import { Alert } from 'react-bootstrap';

const inviteType = ['Invalid', 'Admin User', 'Viewing User', 'Governed User']

const debugPageName = "User Invites"

class UserInvitePage extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			inviteCode: "",
			
			invitePendingList: [],
			inviteActiveList: [],
			
			getUserInvitesStatus: 0,
			submitCodeStatus: 0,
			spendInviteStatus : 0,
			
			getUserInvitesErrors: [],
			submitCodeErrors: [],
			spendInviteErrors: [],
		}
	}
	
	componentDidMount() {
		this.getUserInvites()
	};
	
	getUserInvitesFailure = ( responseData ) => {
		let returnData = []
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "User Invites")
			this.props.refreshToken(this.getUserInvites)
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
		
		this.props.debugSet(debugPageName, "User Invites", "Failure")
		returnData = responseData['messages']
		this.setState({
			getUserInvitesErrors: returnData,
			getUserInvitesStatus:3,
		})
	}
	getUserInvitesSuccess = ( incomingData ) => {
		//console.log(incomingData)
		//console.log("Got the Invites")
		
		let invitesUserSide = []
		let invitesDivisionSide = []
		
		for (let index in incomingData) {
			// If it is from a company to this user, it goes in the invite area
			if (incomingData[index].whoIsOrigin === 1) {
				invitesDivisionSide.push( incomingData[index] )
			}
			// If it is from us, to a company... then it goes in the pending field
			else if (incomingData[index].whoIsOrigin === 2) {
				invitesUserSide.push( incomingData[index] )
			}
		}
		
		this.props.debugSet(debugPageName, "User Invites", "Success")
		this.setState({
			invitePendingList: invitesDivisionSide,
			inviteActiveList: invitesUserSide,
			
			getUserInvitesStatus:2,
		})
	}
	getUserInvites = () => {
		APIUserInvitesGet(  this.getUserInvitesSuccess, this.getUserInvitesFailure )
		this.setState({
			getUserInvitesStatus:1,
		})
	}
	
	inviteFailure = (responseData) => {
		//console.log(responseData)
		let returnData = []
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Submit Code")
			this.props.refreshToken(this.submitCode)
			return
		}
		// Invalid Permissions
		else if (responseData["action"] === 2) {

		}
		// Bad Request
		else if (responseData["action"] === 3) {
			for (let index in responseData['messages']) {
				if (responseData['messages'][index]['mod'] === 5) {
					//userAlreadyErrorFlag = true
				}
				else if (responseData['messages'][index]['mod'] === 6) {
					//tokenErrorFlag = true
				} 
				else if (responseData['messages'][index]['mod'] === 7) {
					//alreadyThereErrorFlag = true
				}
				else {
					//unhandledErrorFlag = true
				}
			}
			//returnData = responseData['messages']
		}
		// Server Exploded Error
		else if (responseData["action"] === 4) {

		}
		// Unknown Error
		else if (responseData["action"] === 5) {

		}
		
		this.props.debugSet(debugPageName, "Submit Code", "False")
		returnData = responseData['messages']
		this.setState({
			submitCodeErrors: returnData,
			submitCodeStatus:3,
		})
	}
	inviteSuccess = (successData) => {
		//console.log("Invite Success")
		this.props.debugSet(debugPageName, "Submit Code", "Success")
		this.setState({
			submitCodeStatus:2,
		})
	}
	submitCode = () => {
		//console.log(this.state.inviteCode)
		//console.log("Submit")
		
		APIUserInviteCode(  this.state.inviteCode, this.inviteSuccess, this.inviteFailure )
		this.setState({
			submitCodeStatus:1,
		})
	}
	
	spendInviteFailure = (responseData) => {
		let returnData = []
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Spend Invite")
			this.props.refreshToken(this.baseTryAgain)
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
		this.props.debugSet(debugPageName, "Spend Invite", "Success")
		
		this.getUserInvites()
		this.props.triggerRefresh()
		this.setState({
			spendInviteErrors: returnData,
			spendInviteStatus: 3,
		})
	}
	spendInviteSuccess = (successData) => {
		//console.log("Spend Invite Success")
		//console.log(successData)
		
		this.props.debugSet(debugPageName, "Spend Invite", "Success")
		this.getUserInvites()
		this.props.triggerRefresh()
		this.setState({
			spendInviteStatus: 2,
		})
	}
	inviteYes = (event) => {
		//console.log("Accept")
		
		// Lets do... 0 == Cancel
		// 1 == Accept
		let action = 1
		let targetInvite = event.target.value
		APIUserInvitesSet(  targetInvite, action, this.spendInviteSuccess, this.spendInviteFailure )
		this.setState({
			spendInviteStatus: 1,
		})
	}
	inviteNo = (event) => {
		//console.log("Deny")

		// 0 == Cancel
		// 1 == Accept
		let action = 0
		let targetInvite = event.target.value
		
		APIUserInvitesSet(  targetInvite, action, this.spendInviteSuccess, this.spendInviteFailure )
		this.setState({
			spendInviteStatus: 1,
		})
	}
	
	codeFieldChange = (event) => {
		this.setState({
			inviteCode: event.target.value,
		})
	}
	
	baseTryAgain = () => {
		console.log("Put Some 'Uh Oh, try again' thing here")
	}
	
	render() {
		//console.log(this.state.invitePendingList)
		//console.log(this.state.inviteActiveList)
		
		let displayWaiting = this.state.getUserInvitesStatus === 1 || this.state.spendInviteStatus === 1 || this.state.submitCodeStatus === 1
		let displaySuccessInvite = this.state.submitCodeStatus === 2
		//let displaySuccessOters = this.state.getUserInvitesStatus === 2 || this.state.spendInviteStatus === 2
		let displayErrors = this.state.getUserInvitesStatus === 3 || this.state.spendInviteStatus === 3 || this.state.submitCodeStatus === 3
		
		let errorParse = []
		for (let index in this.state.getUserInvitesErrors) {
			errorParse.push(
				this.state.getUserInvitesErrors[index]["text"]
			)
		}
		for (let index in this.state.submitCodeErrors) {
			errorParse.push(
				this.state.submitCodeErrors[index]["text"]
			)
		}
		for (let index in this.state.spendInviteErrors) {
			errorParse.push(
				this.state.spendInviteErrors[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}
		
		let currentInvitesDisplayList = []
		for (let i in this.state.invitePendingList) {
			let extra = ""
			currentInvitesDisplayList.push(
				<li className={"list-group-item d-flex justify-content-around"+extra} key={i}>
					<div className="col alignOverride">
						{this.state.invitePendingList[i].inviteDivision}
					</div>
					<div className="col alignOverride">
						{inviteType[this.state.invitePendingList[i].targetRole]}
					</div>
					<div className="col-2">

					</div>
					<div className="col-1">

					</div>
				</li>
			)
		}
		if (currentInvitesDisplayList.length === 0) {
			currentInvitesDisplayList.push(
				<li className="list-group-item" key={0}>
					No Invites!
				</li>
			)
		}
		
		let invitesDisplayList = []
		for (let i in this.state.inviteActiveList) {
			let extra = ""
			invitesDisplayList.push(
				<li className={"list-group-item d-flex justify-content-around"+extra} key={i}>
					<div className="col alignOverride">
						{this.state.inviteActiveList[i].inviteDivision}
					</div>
					<div className="col alignOverride">
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
		
		return (
			<div className="userInvite">
				<div className="container">
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Enter Invite Code</h5>
								</div>
								<div className="card-body">
									<div className="list-group">
										<div className="list-group-item">
											<input type='text' className='form-control' value={this.state.inviteCode} onChange={this.codeFieldChange} placeholder='Enter Code' />
										</div>
										<div className="list-group-item">
											<button className="btn btn-primary" onClick={this.submitCode}>
												Submit
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Current Sent Pending Invites</h5>
								</div>
								<div className="card-body">
									<ul className="list-group">
										{/*Trying a non-table solution because of the buttons?*/}
										<li className="list-group-item" key={-1}>
											<div className="row">
												<div className="col-1">
												</div>
												<div className="col alignOverride">
													<u>Division name</u>
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
										{currentInvitesDisplayList}
									</ul>
								</div>
							</div>
						</div>
					</div>
					
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Current Company Invites</h5>
								</div>
								<div className="card-body">
									<ul className="list-group">
										{/*Trying a non-table solution because of the buttons?*/}
										<li className="list-group-item" key={-1}>
											<div className="row">
												<div className="col-1">
												</div>
												<div className="col alignOverride">
													<u>Division name</u>
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
										{/*
										<button className="btn btn-primary" onClick={this.getUserInvites}>
											Re-Load Invites
										</button>
										*/}
									</ul>
								</div>
							</div>
						</div>
					</div>
					
					<Alert show={displayWaiting} variant="warning">
						<Alert.Heading>Waiting</Alert.Heading>
						<hr />
						<p>
						  Waiting for response...
						</p>
						<hr />
					</Alert>
					
					<Alert show={displaySuccessInvite} variant="success">
						<Alert.Heading>Success!</Alert.Heading>
						<hr />
						<p>
						  Successfully Send Invite!
						</p>
						<hr />
					</Alert>
					
					<Alert show={displayErrors} variant="danger">
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

export default withRouter(UserInvitePage);