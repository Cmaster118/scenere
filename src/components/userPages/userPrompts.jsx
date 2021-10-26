import React from "react";
import { Search } from 'react-bootstrap-icons';

import { withRouter, } from "react-router-dom";
import { Alert } from 'react-bootstrap';

import { APIGetSearchPrompts, APIDeleteUserEvents, APIGetUserEvents, APISetUserEvents } from "../../utils";
//, APISetNonDivisionEvents APISetDivisionEvents, 
const debugPageName = "User Prompts"

const triggerType = [
	"Never",
	"Always",
	"On Monday",
	"On Tuesday",
	"On Wednesday",
	"On Thursday",
	"On Friday",
	"On Saturday",
	"On Sunday",
]

// Possibly get this list from the future?
const searchFilter = [
	"Personal",
	"Corperate",
]

const promptType = [
	"Open",
	"Likert",
	"Rating",
	"Multi",
	"Boolean",
]

// Move this to a util later.... Its used in CompanyPrompts, SelectCompany and Suggestions....
class Paginator extends React.Component {
	
	constructor(props) {
        super(props);
		this.state = {
			btnLen: 2,
		}
	}
	
	render() {
		
		let prevAlter = ""
		let nextAlter = ""
		
		if (this.props.activePage <= 0) {
			prevAlter = "disabled"
		}

		if (this.props.activePage >= this.props.totalLoaded/this.props.numPerPage-1) {
			nextAlter = "disabled"
		}
		
		let numberButtons = []
		for (let i = -this.state.btnLen; i <= this.state.btnLen; i++) {
			let altered = ""
			
			let altI = i+this.props.activePage
			if (altI < 0 || altI >= this.props.totalLoaded/this.props.numPerPage) {
				continue;
			}
			
			if (i === 0) {
				altered = "active "
			}
			
			numberButtons.push(
				<button key={i} className={"btn btn-outline-primary " + altered} value={altI} onClick={this.props.changeToNum}>
					{altI}
				</button>
			)
		}
		
		return (
			<div className = "paginator">
				<div className = "container">
					<div className="row">
						<div className="col">
							<button className={"btn btn-outline-primary " + prevAlter} value="bck" onClick={this.props.changePrevNext}>
								Prev
							</button>
							
							{numberButtons}
							
							<button className={"btn btn-outline-primary " + nextAlter} value="fwd" onClick={this.props.changePrevNext}>
								Next
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class PromptDisplayUser extends React.Component {
	
	constructor(props) {
        super(props);
		this.state = {
			
			eventsGlobBin: [],
			eventsUserBin: [],
			
			promptsBin: [],
			//unsavedChanges: false,
			
			pageNum: 0,
			numPerPage: 5,
			
			searchText: "",
			
			filterTypeFlags: this.initTypeFlags(),
			filterNameFlags: this.initNameFlags(),
			
			hasSent: false,
			
			lastClickedEventIndex: -1,
			
			addedPrompt: 0,
			
			getEventsStatus: 0,
			getEventsError: [],
			
			saveEventStatus: 0,
			saveEventError: [],
			
			searchForStatus: 0,
			searchForError: [],
			
			deleteEventStatus: 0,
			deleteEventError: [],
		}
	}
	
	componentDidMount() {
		// Input that Wait Until parent Is Done thing...
		// Otherwise it will make a memory leak?
		this.getEvents()
	};
	
	initTypeFlags = () => {
		let createdList = []
		for (let i = 0; i < promptType.length; i++) {
			createdList.push(true)
		}
		
		return createdList
	}
	
	initNameFlags = () => {
		let createdList = []
		for (let i = 0; i < searchFilter.length; i++) {
			createdList.push(false)
		}
		
		return createdList
	}
	
	setLastClickedEvent = (event) => {
		this.setState({
			lastClickedEventIndex: Number(event.target.value)
		})
	}
	
	changeInput = (event) => {
		this.setState({
			searchText: event.target.value
		})
	}
	
	changeFilterType1 = (event) => {
		let alteredFlags = this.state.filterTypeFlags.slice()
		
		alteredFlags[Number(event.target.value)] = !alteredFlags[Number(event.target.value)]
		
		this.setState({
			filterTypeFlags: alteredFlags,
		})
	}
	changeFilterType2 = (event) => {
		
		let alteredFlags = this.state.filterNameFlags.slice()
		
		alteredFlags[Number(event.target.value)] = !alteredFlags[Number(event.target.value)]
		
		this.setState({
			filterNameFlags: alteredFlags,
		})
	}
	
	getEventsFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Get Division Events")
			this.props.refreshToken(this.getEvents)
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
		
		this.props.debugSet(debugPageName, "Get Division Events", "Failure")
		returnData = responseData['messages']
		this.setState({
			getEventsStatus: 3,
			getEventsError: returnData,
		})
	}
	getEventsSuccess = (incomingEvents) => {
		//console.log(this.props.currentUser)
		
		let sortedGlobal = []
		let sortedUser = []
		
		for (let index in incomingEvents) {
			
			// This should be global...
			//if (incomingEvents[index]["creatorUser"] === null) {
			//	sortedGlobal.push(incomingEvents[index])
			//}
			// This should be This User
			if (incomingEvents[index]["creatorUser"] === this.props.currentUser) {
				
				//incomingEvents[index]["sharingEnabled"] ||
				//if (incomingEvents[index]["usedByUser"]) {
					sortedUser.push(incomingEvents[index])
				//}
			}
			// This should be this Company shared stuff...
			else {
				// Ignore!
			}
		}
		
		this.props.debugSet(debugPageName, "Get Division Events", "Success")
		this.setState({
			eventsGlobBin: sortedGlobal,
			eventsUserBin: sortedUser,
			
			getEventsStatus: 2,
		})
	}
	getEvents = () => {
		if (!(this.props.currentUser === undefined)) {
			let checkData = undefined
			if (checkData === undefined) {
				APIGetUserEvents( this.props.currentUser, this.getEventsSuccess, this.getEventsFailure )
				this.setState({
					getEventsStatus: 1,
				})
			}
			else {
				//getEventsSuccess( ??? )
			}
		}
		else {
			//console.log("MOVE IT BACK TO THE SELECT COMPANY HERE!")
		}
	}
	
	createEvent = () => {
		let newEvents = this.state.eventsUserBin.slice()
		
		// I can proboly replace the "isSaved" with an id of -1?
		newEvents.push(
			{"id":-1, "triggerType":0, "promptPool":[], "sharingEnabled":true, "usedByUser":false, "isSaved":false}
		)
		
		this.setState({
			eventsUserBin: newEvents,
		})
	}
	
	enabledUserFieldChange = (event) => {
		
		let alteredEvents = this.state.eventsUserBin.slice()
		alteredEvents[event.target.name]["usedByUser"] = !alteredEvents[event.target.name]["usedByUser"]
		alteredEvents[event.target.name]["isSaved"] = false
		
		this.setState({
			eventsUserBin: alteredEvents,
		})
	}
	
	changePageTo = (event) => {
		
		let newPage = Number(event.target.value)
		// Sanity check!
		
		this.setState({
			pageNum: newPage
		})
	}
	changePageFwdBck = (event) => {
		
		let newPage = Number(this.state.pageNum)
		
		if (event.target.value === "fwd") {
			newPage = newPage + 1
		
			if (newPage > this.state.promptsBin.length/this.state.numPerPage) {
				return
			}
		}
		else if (event.target.value === "bck") {
			newPage = newPage - 1
			
			if (newPage < 0) {
				return
			}
		}
			
		this.setState({
			pageNum: newPage
		})
	}
	
	changeTrigger = (event) => {
		// A normal "Get the stuff I stored in the name or value...
		let idNumberName = event.target.name.split(",")
		let alteredEvents = this.state.eventsUserBin.slice()
		
		// Shove that into an alteration
		alteredEvents[ idNumberName[0] ]["triggerType"] = Number(idNumberName[1])
		alteredEvents[ idNumberName[0] ]["isSaved"] = false
		
		this.setState({
			eventsUserBin: alteredEvents,
		})
	}
	setLastClickedEvent = (event) => {
		this.setState({
			lastClickedEventIndex: Number(event.target.value)
		})
	}
	
	deleteEventFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Delete Events")
			this.props.refreshToken(this.tokenHasRefreshedError)
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
		
		this.props.debugSet(debugPageName, "Delete Events", "Failure")
		returnData = responseData['messages']
		this.setState({
			deleteEventStatus: 3,
			deleteEventError: returnData,
		})
	}
	deleteEventCallback = (storedID, incomingMessage) => {
		
		if (incomingMessage !== -1) {
			let valueInt = Number(storedID)
			let temp = this.state.eventsUserBin.slice()
			temp.splice(valueInt,1)
			
			this.props.debugSet(debugPageName, "Delete Events", "Success")
			this.setState({
				eventsUserBin: temp,
			})
		
			this.setState({
				deleteEventStatus: 2,
			})
		}
		
	}
	deleteEvent = (event) => {
		let selectedEvent = this.state.eventsUserBin[ Number(event.target.value) ]

		let id = selectedEvent["id"]
		
		if (!selectedEvent["isSaved"]) {
			this.deleteEventCallback( Number(event.target.value), -1)
		}
		else{			
			APIDeleteUserEvents( Number(event.target.value), id, this.deleteEventCallback, this.deleteEventFailure )
			this.setState({
				deleteEventStatus: 1,
			})
		}
	}
	
	deleteEventPrompt = (event) => {
		let eventIndex = Number(event.target.name)
		let promptIndex = Number(event.target.value)

		let temp = this.state.eventsUserBin.slice()
		temp[eventIndex]["promptPool"].splice( promptIndex,1 )
		temp[eventIndex]["isSaved"] = false
		
		//console.log(eventIndex)
		//console.log(promptIndex)
		
		this.setState({
			eventsUserBin: temp,
		})
	}
	
	saveEventsFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Get Division Events")
			this.props.refreshToken(this.tokenHasRefreshedError)
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
		
		this.props.debugSet(debugPageName, "Save Division Events", "Failure")
		returnData = responseData['messages']
		this.setState({
			saveEventStatus: 3,
			saveEventError: returnData,
		})
	}
	saveEventsSuccess = (savedIndex, incomingMessage) => {
		if ( !this.state.eventsUserBin[savedIndex]["isSaved"] ) {
			let temp = this.state.eventsUserBin.slice()
			temp[savedIndex]["id"] = Number(incomingMessage.split(":")[1])
			temp[savedIndex]["isSaved"] = true

			this.setState({
				eventsUserBin: temp,
			})
		}
		
		this.props.debugSet(debugPageName, "Save Division Events", "Success")
		this.setState({
			saveEventStatus: 2,
		})
	}
	saveUserEvent = (event) => {
		// Prep some stuff that the server wants to see on the other end....
		let selectedEvent = this.state.eventsUserBin[event.target.value]

		let id = selectedEvent["id"]
		let newTrigger = selectedEvent["triggerType"]
		let newEnabled = selectedEvent["usedByUser"]
		let newEnabledShare = selectedEvent["sharingEnabled"]
		
		let newPrompts = []
		for (let index in selectedEvent["promptPool"]) {
			newPrompts.push( selectedEvent["promptPool"][index]["identifier"] )
		}
		
		APISetUserEvents( Number(event.target.value), id, newEnabled, newEnabledShare, newTrigger, newPrompts, this.saveEventsSuccess, this.saveEventsFailure )
		this.setState({
			saveEventStatus: 0,
		})
	}
	
	/*
	saveNonDivEventsFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Save Non-Division Data")
			this.props.refreshToken(this.tokenHasRefreshedError)
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
		
		this.props.debugSet(debugPageName, "Save Non-Division Events", "Success")
		returnData = responseData['messages']
		this.setState({
			saveEventStatus: 3,
			saveEventError: returnData,
		})
	}
	saveNonDivEventsSuccess = (savedIndex, incomingMessage) => {
		this.props.debugSet(debugPageName, "Save Non-Division Events", "Success")
		this.setState({
			saveEventStatus: 2,
		})
	}
	saveGlobEvent = (event) => {
		let selectedEvent = this.state.eventsGlobBin[event.target.value]

		let id = selectedEvent["id"]
		let newEnabledDiv = selectedEvent["usedByUser"]
		
		APISetNonDivisionEvents( Number(event.target.value), id, this.props.currentDivisionID, newEnabledDiv, this.saveNonDivEventsSuccess, this.saveNonDivEventsFailure )
		this.setState({
			saveEventStatus: 0,
		})
	}
	*/
	
	searchForPromptsFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.debugSet(debugPageName, "Refresh Triggered", "Search Prompts")
			this.props.refreshToken(this.searchForPrompts)
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
		
		this.props.debugSet(debugPageName, "Search Prompts", "Failure")
		returnData = responseData['messages']
		this.setState({
			searchForStatus: 3,
			searchForError: returnData,
		})
	}
	searchForPromptsCallback = (incomingPrompts) => {

		this.props.debugSet(debugPageName, "Search Prompts", "Success")
		this.setState({
			promptsBin: incomingPrompts,
			hasSent: true,
			
			searchForStatus: 2,
		})
	}
	searchForPrompts = () => {
		
		// Maybe do a check to see if search filter is the right length?
		// However, that should not be necessary as state filter set is set to its length...
		
		let filterTypeSet = []
		for (let index in this.state.filterTypeFlags) {
			if (this.state.filterTypeFlags[index]) {
				filterTypeSet.push(index)
			}
		}
		
		let filterNameSet = []
		for (let index in this.state.filterNameFlags) {
			if (this.state.filterNameFlags[index]) {
				filterNameSet.push(searchFilter[index])
			}
		}
		
		let checkData = undefined
		if (checkData === undefined) {
			//console.log("Prompts are not in storage!")
			APIGetSearchPrompts( this.state.searchText, filterTypeSet, filterNameSet, this.searchForPromptsCallback, this.searchForPromptsFailure)			
			this.setState({
				searchForStatus: 1,
			})
		}
		else {
			//console.log("Prompts ARE in storage!")
			//this.searchForPromptsCallback(checkData.???, checkData.???)
		}
	}
	
	addingEventPrompt = (event) => {
		let temp = this.state.eventsUserBin.slice()
		let promptIndex = Number(event.target.value)
		let targetIndex = this.state.lastClickedEventIndex
		
		if (targetIndex >= 0) {
			
			// Check to see if it is already here...
			let sanity = temp[targetIndex]["promptPool"].find(element => element["identifier"] === this.state.promptsBin[ promptIndex ]["identifier"] )
			
			let promptReport = 0
			if (sanity === undefined) {
				temp[targetIndex]["isSaved"] = false
				temp[targetIndex]["promptPool"].push(this.state.promptsBin[ promptIndex ])
				promptReport = 1
			}
			else{
				promptReport = 2
			}

			this.setState({
				eventsUserBin: temp,
				addedPrompt: promptReport,
			})
		}
	}
	
	// I have removed the share feature for the time being...
	render() {
		
		// Displaying the user events
		let userEvents = []

		// For each event we have in our possestion...
		for (let index in this.state.eventsUserBin) {
			// Mark it down for easier reference...
			let thisEvent = this.state.eventsUserBin[index]
			
			// Create the collapsable menu filled with its prompts...
			let displayCurrentPrompts = []
			for (let indexSub in thisEvent["promptPool"]) {
				// subset is a preview section...
				let subset = thisEvent["promptPool"][indexSub]["text"].substring(0, 12) + "...";
				
				// No comments in here due to jsx
				displayCurrentPrompts.push(
				
					<tr key={indexSub}>
						<th scope="row">
							<button className="btn btn-outline-secondary" data-toggle="collapse" data-target={"#displayPromptCollapse"+index+indexSub}>
								{subset}
							</button>
						</th>						
						<td>{promptType[thisEvent["promptPool"][indexSub]["promptType"]]}</td>
						{/* <td>{thisEvent["promptPool"][indexSub]["promptFilterTags"].length}</td> */}
						<th>
							<button className="close" type="button" value={indexSub} name={index} onClick={this.deleteEventPrompt} aria-label="Close">
								&times;
							</button>
						</th>
					</tr>,
					<tr key={1 + indexSub + thisEvent["promptPool"].length}>
						<th scope="row" colSpan="4" className="collapse" id={"displayPromptCollapse"+index+indexSub}>
							{thisEvent["promptPool"][indexSub]["text"]}
						</th>
					</tr>
				)
			}
			// If there were NONE, then ovverride!
			if (displayCurrentPrompts.length === 0) {
				displayCurrentPrompts.push(
					<tr key={0}>
						<th scope="row" colSpan="4">
							Nothing here!
						</th>
					</tr>
				)
			}

			// Display logic values with backups in case of undefined....
			let unsavedCheck = !thisEvent["isSaved"]

			let displayLength = 0
			try {
				displayLength = thisEvent["promptPool"].length
			}
			catch {
				
			}
	
			// This is vusial JSX, no comments due to jsx
			userEvents.push(
				
				<div className="col-sm-12 col-md-12 col-lg-6 col-xl" key={index}>
					<div className="card">
						<div className="card-header">
							{ unsavedCheck &&
								<div className="text-danger">
									Unsaved Changes!
								</div>
							}
							Delete
							<button className="badge badge-danger badge-pill" name="test" value={index} onClick={this.deleteEvent}>
								X
							</button>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col"/>
								<div className="col-">
									Trigger Type:
								</div>
								<div className="col-">
									<div className='dropdown'>
										<div className="btn btn-secondary mx-2" type="button" id={"EventButton"+index} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
											{ triggerType[ thisEvent["triggerType"] ] }
										</div>
										<div className="dropdown-menu" aria-labelledby={"EventButton"+index}>
											{triggerType.map((radio, idx) => (
												<div key={idx}>
													<button className="dropdown-item" name={ [index, idx] } onClick={this.changeTrigger}>
														{radio}
													</button>
												</div>
											))}
										</div>
									</div>
								</div>
								<div className="col"/>
							</div>
							<div className="row m-1">
								<div className="col"/>
								<div className="col-">
									<b><u><i>{displayLength}</i></u></b> Prompts 
								</div>
								<div className="col- mx-2">
									<button className="btn btn-secondary" type="button" data-toggle="collapse" data-target={"#collapse"+index} aria-expanded="false" aria-controls={"collapse"+index}>
										Edit
									</button>
								</div>
								<div className="col"/>
							</div>
							<div className="row">
								<div className="col"/>
								<div className="col">
									<div className='custom-control custom-checkbox'>
										<input type='checkbox' className='custom-control-input' id={'customCheckUser'+index} name={index} value={thisEvent["usedByUser"]} onChange={this.enabledUserFieldChange} checked={thisEvent["usedByUser"]} />
										<label className='custom-control-label' htmlFor={'customCheckUser'+index} >Enabled</label>
									</div>
								</div>
								<div className="col"/>
							</div>
							<div className="row">
								<div className="col">
									<button className="btn btn-primary" value={index} onClick={this.saveUserEvent}>
										Save
									</button>
								</div>
							</div>
							
						</div>
						
						<div className="collapse" id={"collapse"+index}>
							<div className="card card-body">
										
								<table className="table" key="1">
									<thead>
										<tr>
											<th scope="col">Text</th>
											{/* <th scope="col">IID</th> */}
											<th scope="col">Type</th>
											{/* <th scope="col">Filter(s)</th> */}
											<th scope="col">Delete</th>
										</tr>
									</thead>
									
									<tbody>
										{displayCurrentPrompts}
									</tbody>
								</table>
								
								<button className="btn btn-primary" value={index} onClick={this.setLastClickedEvent} data-toggle="modal" data-target="#addPrompts">
									Add New Prompt
								</button>

							</div>
						</div>
						
					</div>
				</div>
				
			)
		}
		
		if (userEvents.length === 0) {
			userEvents.push(
				<div className="col" key={0}>
					Nothing Here!
				</div>
			)
		}
		
		// This is for displaying the response to the prompt search
		let showSearchPrompts = []
		
		// Are there prompts in our current bin?
		if (this.state.promptsBin.length > 0) {
			// PAGINATOR STUFF!
			
			// For a number of stuff in the page...
			for (let index = 0; index < this.state.numPerPage; index++) {
				
				// Alter the index so it is pointing to the right part
				let alteredIndex = index + this.state.pageNum*this.state.numPerPage
				
				// Is our altered index past the end?
				if (alteredIndex >= this.state.promptsBin.length) {
					// If no, get outta here
					break;
				}
				
				let subset = this.state.promptsBin[alteredIndex]["text"].substring(0, 12) + "...";
				
				let displayIndFilters = []
				for (let tagIndex in this.state.promptsBin[alteredIndex]["promptFilterTags"]) {
					displayIndFilters.push(
						<div className="col border">
							<div className="my-1">
								{this.state.promptsBin[alteredIndex]["promptFilterTags"][tagIndex]["name"]}
							</div>
						</div>
					)
				}
				if (displayIndFilters.length === 0) {
					displayIndFilters.push(
						<div className="col- list-group-item">
							No Filters!
						</div>
					)
				}
				
				// No comments in here due to jsx
				showSearchPrompts.push(

					<tr key={alteredIndex}>
						<th scope="row">
							<button className="btn btn-outline-secondary" data-toggle="collapse" data-target={"#collapseFullText"+alteredIndex}>
								{subset}
							</button>
						</th>
						{/* <td>{ this.state.promptsBin[alteredIndex]["identifier"] }</td> */}
						<td>{ promptType[this.state.promptsBin[alteredIndex]["promptType"]] }</td>
						<td>
							<button className="btn btn-outline-secondary" data-toggle="collapse" data-target={"#collapseFilters"+alteredIndex}>
								{ this.state.promptsBin[alteredIndex]["promptFilterTags"].length }
							</button>
						</td>
						<th>
							<button className="btn btn-outline-secondary" value={alteredIndex} onClick={this.addingEventPrompt}>
								+
							</button>
						</th>
					</tr>,
					<tr key={1 + alteredIndex + this.state.promptsBin.length}>
						<th scope="row" colSpan="4" className="collapse" id={"collapseFullText"+alteredIndex}>
							{ this.state.promptsBin[alteredIndex]["text"] }
						</th>
					</tr>,
					<tr key={2 + alteredIndex + 2*this.state.promptsBin.length}>
						<th scope="row" colSpan="4" className="collapse" id={"collapseFilters"+alteredIndex}>
							<div className="row">
								<div className="col"/>
									{displayIndFilters}
								<div className="col"/>
							</div>
						</th>
					</tr>,
				)
			}
		}
		else {
			if (this.state.hasSent) {
				showSearchPrompts.push(
					<tr key={0}>
						<th scope="row" colSpan="4">
							No Results!
						</th>
					</tr>
				)
			}
			else {
				showSearchPrompts.push(
					<tr key={0}>
						<th scope="row" colSpan="4">
							Waiting for Search!
						</th>
					</tr>
				)
			}
		}
		
		// This is error stuff
		//let showIdle = this.state.getEventsStatus === 0 || this.state.saveEventStatus === 0 || this.state.searchForStatus === 0 || this.state.deleteEventStatus === 0
		let showWaiting = this.state.getEventsStatus === 1 || this.state.saveEventStatus === 1 || this.state.deleteEventStatus === 1 //|| this.state.searchForStatus === 1 
		let showSuccess = this.state.saveEventStatus === 2 || this.state.deleteEventStatus === 2 //|| this.state.searchForStatus === 2 || this.state.getEventsStatus === 2 || 
		let showError = this.state.getEventsStatus === 3 || this.state.saveEventStatus === 3 || this.state.deleteEventStatus === 3 //|| this.state.searchForStatus === 3
		
		let errorParse = ["Network Error"]
		
		let filterTypeSet = []
		for (let index in promptType) {
			
			let displayClass = "btn-outline-success"
			if (this.state.filterTypeFlags[index]) {
				displayClass = "btn-success"
			}
			
			filterTypeSet.push(
				<div className="col-" key={index}>
					<button className={"btn " + displayClass} value={index} key={index} onClick={this.changeFilterType1}>
						{promptType[index]}
					</button>
				</div>
			)
		}
		
		let filterNameSet = []
		for (let index in searchFilter) {
			
			let displayClass = "btn-outline-success"
			if (this.state.filterNameFlags[index]) {
				displayClass = "btn-success"
			}
			
			filterNameSet.push(
				<div className="col-" key={index}>
					<button className={"btn " + displayClass} value={index} key={index} onClick={this.changeFilterType2}>
						{searchFilter[index]}
					</button>
				</div>
			)
		}
		
		// Again, no comments due to jsx
		return (
			<div className="PromptDisplay">
				<div className="container-fluid">
				
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Your Personal Prompts</h5>
								</div>
								<div className="card-body">
									<div className="row">
										{userEvents}
									</div>
									<div className="row my-2">
										<div className="col">
											<button className="btn btn-primary" onClick={this.createEvent}>
												Create Event
											</button>
										</div>
									</div>
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
						  Successfully changed data!
						  <br />
						  Your prompts will be updated on next refresh
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
					
					<div className="modal fade" id="addPrompts" tabIndex="-1" role="dialog" aria-labelledby="promptAdder" aria-hidden="true">
						<div className="modal-dialog modal-dialog-centered" role="document">
							<div className="modal-content">
								<div className="modal-header">

									<h5 className="modal-title">Adding Prompts</h5>
									<button type="btn btn-danger" className="close" data-dismiss="modal" aria-label="Close">
									  <span aria-hidden="true">&times;</span>
									</button>

								</div>
								<div className="modal-body">
								
									<div className="row">
										<div className="col">
											<div className="input-group rounded">
												<input type="search" className="form-control rounded" placeholder="Search Text" aria-label="Search" aria-describedby="search-addon" onChange={this.changeInput} />
												<button className="input-group-text border-0" id="search-addon" onClick={this.searchForPrompts}>
													<Search className="iconBG" color="black" size={16} />
												</button>
											</div>
										</div>
									</div>
									
									<div className="row">
										<div className="col">
										
											<button className="btn btn-outline-secondary" data-toggle="collapse" data-target={"#displaySearchCollapse"}>
												Advanced Search
											</button>
											<hr/>
											<div className="collapse" id={"displaySearchCollapse"}>
												<div className="row">
													<div className="col">
														<u>Filters:</u>
													</div>
												</div>
												<div className="row">
													<div className="col"/>
													{filterTypeSet}
													<div className="col"/>
												</div>
												<div className="row">
													<div className="col"/>
													{filterNameSet}
													<div className="col"/>
												</div>
												<hr/>
											</div>
										</div>
									</div>
										
									<table className="table" key="1">
										<thead>
											<tr>
												<th scope="col">Text</th>
												{/*<th scope="col">IID</th>*/}
												<th scope="col">Type</th>
												<th scope="col">Filter(s)</th>
												<th scope="col">Add</th>
											</tr>
										</thead>
										
										<tbody>
											{showSearchPrompts}
										</tbody>
									</table>
									
									{this.state.addedPrompt === 1 && 
										<div className="row">
											<div className="col text-success">
												Added!
											</div>
										</div>
									}
									{this.state.addedPrompt === 2 && 
										<div className="row">
											<div className="col text-warning">
												Already on the list!
											</div>
										</div>
									}

								</div>
								<div className="modal-footer">
								
									<Paginator
										activePage={this.state.pageNum}
										
										changePrevNext={this.changePageFwdBck}
										changeToNum={this.changePageTo}
										
										totalLoaded={this.state.promptsBin.length}
										numPerPage={this.state.numPerPage}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(PromptDisplayUser);