import React from "react";

import { withRouter } from "react-router-dom";
import { APIUserInvitesGet, APIUserInvitesSet, APIUserInviteCode } from "../../utils";

const inviteType = ['Invalid', 'Admin', 'Viewer', 'Governed']

class UserInvitePage extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			inviteCode: "",
			
			inviteIDList: [],
			inviteNamesList: [],
			inviteRolesList: [],	
		}
	}
	
	componentDidMount() {
		this.getUserInvites()
	};
	
	getUserInvitesSuccess = ( incomingData ) => {
		console.log("Got the Invites")
		
		let idSet = []
		let userNames = []
		let divisionNames = []
		let targetRole = []
		for (let index in incomingData) {
			idSet.push( incomingData[index].id )
			userNames.push( incomingData[index].getUserFullName )
			divisionNames.push( incomingData[index].inviteDivision )
			targetRole.push( inviteType[incomingData[index]] )
		}
		
		this.setState({
			inviteIDList: idSet,
			inviteNamesList: divisionNames,
			inviteRolesList: targetRole
		})
	}
	getUserInvitesFailure = ( errorCodes, errorMessages ) => {
		console.log("Failure Somehow...")
		console.log(errorCodes)
		console.log(errorMessages)
	}
	getUserInvites = () => {
		APIUserInvitesGet( this.props.APIHost, this.props.authToken, this.getUserInvitesSuccess, this.getUserInvitesFailure )
	}
	
	inviteSuccess = (successCodes, successData) => {
		console.log("Invite Success")
	}
	inviteFailure = (errorCodes, errorMessages) => {
		console.log("Invite Failure")
		// Is there an even better way to do this?
		// Like, hmmm... So this is literally one line? Beause the state has to be set here...
		for (let i in errorCodes) {
			if (errorCodes[i] === 0) {
				// network Error
			}
			else if (errorCodes[i] === 1) {
				// Already on the list
			}
			else if (errorCodes[i] === 2) {
				// Code doesnt match anything...
			}
			else if (errorCodes[i] === 3) {
				// Invite already exists
			}
			else {
				// unknown error
			}
		}
	}
	submitCode = () => {
		console.log(this.state.inviteCode)
		console.log("Submit")
		
		APIUserInviteCode( this.props.APIHost, this.props.authToken, this.state.inviteCode, this.inviteSuccess, this.inviteFailure )
	}
	
	spendInviteSuccess = (successData) => {
		//console.log("Spend Invite Success")
		//console.log(successData)
		
		this.getUserInvites()
		this.props.triggerRefresh()
	}
	spendInviteFailure = (errorCodes, errorMessages) => {
		console.log("Spend Invite Failure")
		console.log(errorCodes)
		console.log(errorMessages)
		
		this.getUserInvites()
		this.props.triggerRefresh()
	}
	inviteYes = (event) => {
		console.log("Accept")
		
		// Lets do... 0 == Cancel
		// 1 == Accept
		let action = 1
		let targetInvite = event.target.value
		APIUserInvitesSet( this.props.APIHost, this.props.authToken, targetInvite, action, this.spendInviteSuccess, this.spendInviteFailure )
	}
	inviteNo = (event) => {
		console.log("Deny")

		// 0 == Cancel
		// 1 == Accept
		let action = 0
		let targetInvite = event.target.value
		
		APIUserInvitesSet( this.props.APIHost, this.props.authToken, targetInvite, action, this.spendInviteSuccess, this.spendInviteFailure )
	}
	
	codeFieldChange = (event) => {
		this.setState({
			inviteCode: event.target.value,
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
									<h5>Current Company Invites</h5>
								</div>
								<div className="card-body">
									<ul className="list-group">
										{invitesDisplayList}
										<button className="btn btn-primary" onClick={this.getUserInvites}>
											Re-Load Invites
										</button>
									</ul>
								</div>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		)
	}
}

export default withRouter(UserInvitePage);