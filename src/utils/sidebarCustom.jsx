import React from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';

const validStates = [0,1]

export class Sidebar extends React.Component {

	constructor(props) {
        super(props);
		this.state = {
			
			enabled:false,
			displayState:0,
			
			showUserActions:false,
			showUserEmailScan:false,
			
			showCompanyDataFlag:false,
			showCompanyEmailFlag:false,
			showCompanySettingsFlag:false,
			
			currentCompanyName:"No Company!",
			currentUserName:"No User!",
		}
	}
	
	setUserFlag = (nextThing) => {
		if (typeof nextThing !== "number") {
			return false
		}
		
		if (nextThing === -1) {
			this.setState({
				showUserActions: false,
				showUserEmailScan: false,
			})
		}
		else if (nextThing === 0) {
			this.setState({
				showUserActions: true,
			})
		}
		else if (nextThing === 1) {
			this.setState({
				showUserEmailScan: true,
			})
		}
	}
	
	setCompanyFlag = (nextThing) => {
		if (typeof nextThing !== "number") {
			return false
		}
		if (nextThing === -1) {
			this.setState({
				showCompanyDataFlag: false,
				showCompanyEmailFlag: false,
				showCompanySettingsFlag: false,
			})
		}
		if (nextThing === 0) {
			this.setState({
				showCompanyDataFlag: true,
			})
		}
		else if (nextThing === 1) {
			this.setState({
				showCompanyEmailFlag: true,
			})
		}
		else if (nextThing === 2) {
			this.setState({
				showCompanySettingsFlag: true,
			})
		}
	}
	
	setCompanyName = (name) => {
		this.setState({
			currentCompanyName: name,
		})
	}
	
	setUserName = (name) => {
		this.setState({
			currentUserName: name,
		})
	}
	
	disableMenu = () => {
		//console.log("Disable Menu")
		this.setState({
			enabled: false,
		})
	}
	
	activateMenu = (reqState) => {
		//console.log("Activate Menu")
		//console.log(reqState)
		let foundState = validStates.find(element => element === reqState);
		
		if (foundState !== undefined) {
			this.setState({
				enabled:true,
				displayState: reqState,
			})
			return true
		}
		else {
			this.setState({
				enabled:false,
			})
			return false
		}
	}
	
	render() {
		
		let displayMenu = []
		
		switch(this.state.displayState) {
			case 0:
				displayMenu.push(
					<div className="list-group-item list-group-item-secondary" key="1">
						<h4>
							{this.state.currentUserName}
						</h4>
					</div>
				)
				if (this.state.showUserActions) {
					displayMenu.push(
						<Link className="list-group-item" to={this.props.basePath+"/dashboard/userMode/journalWrite"} key="2">
							Make Today's Journal
						</Link>,
						<Link className="list-group-item" to={this.props.basePath+"/dashboard/userMode/journalRead"} key="3">
							View past Journals
						</Link>,
						<Link className="list-group-item" to={this.props.basePath+"/dashboard/userMode/writeSuggestion"} key="4">
							Make Suggestions
						</Link>
					)
				}
				if (this.state.showUserEmailScan) {
					displayMenu.push(
						<div className="list-group-item list-group-item-secondary" key="4.5">
							<h4>
								Email Scanning
							</h4>
						</div>,
						
						<Link className="list-group-item" to={this.props.basePath+"/dashboard/userMode/userWeb"} key="5">
							View Contact Web
						</Link>,
					)
				}
				break;
			case 1:
				displayMenu.push(
					<Link className="list-group-item list-group-item-secondary" to={this.props.basePath+"/dashboard/companyMode/companySelect"} key="0">
						<h3>
							{this.state.currentCompanyName}
						</h3>
					</Link>,
					<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companySelect"} key="0.5">
						<h5>
							Select Company
						</h5>
					</Link>
				)
				if (this.state.showCompanyDataFlag) {
					displayMenu.push(
						<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companyEHI"} key="1">
								View EHI
							</Link>,
							<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companySummary"} key="2">
								View Summaries
							</Link>,
							<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companySuggestions"} key="3">
								View Suggestion Box
						</Link>,
					)
				}
				if (this.state.showCompanyEmailFlag) {
					displayMenu.push(
						<div className="list-group-item list-group-item-secondary" key="3.5">
							<h4>
								Email Scanning
							</h4>
						</div>,
						
						<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companyWeb"} key="4">
							View Web (Beta)
						</Link>,
						
						{/*
						<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companyWeb"} key="4">
							Email Scan Settings
						</Link>,
						*/}
					)
				}
				if (this.state.showCompanySettingsFlag) {
					displayMenu.push(
						
						<div className="list-group-item list-group-item-secondary" key="4.5">
							<h4>
								Settings
							</h4>
						</div>,
						<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companyPrompts"} key="5">
							Edit Prompt Events
						</Link>,
						/*Yo! Split these next!*/
						<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companyInvites"} key="6">
							User Invites
						</Link>,
						<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companyPerms"} key="7">
							Permission Settings
						</Link>,
						<Link className="list-group-item list-group-item-light" to={this.props.basePath+"/dashboard/companyMode/companySettings"} key="8">
							Misc. Settings
						</Link>,
					)
				}
				break;
			default:
				displayMenu.push(
					<div className="list-group">
						Invalid Menu! Oops!
					</div>
				)
		}
		
		return (
			<div className="menuContainer">
				{this.state.enabled &&
					<Menu>
						<div className="list-group">
							<Link className="list-group-item list-group-item-dark" to={this.props.basePath+"/dashboard"}>
								Dashboard
							</Link>
							{displayMenu}
						</div>
					</Menu>
				}
			</div>
		)
	}
}