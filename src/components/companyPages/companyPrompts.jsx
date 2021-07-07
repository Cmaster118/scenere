import React from "react";
import { Search } from 'react-bootstrap-icons';

import { withRouter, } from "react-router-dom";
import { Alert } from 'react-bootstrap';

import { APIGetSearchPrompts, APIGetDivisionEvents, APISetDivisionEvents, APIDeleteDivisionEvents, APISetNonDivisionEvents } from "../../utils";

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

// I prefer class form honestly...
class PromptDisplay extends React.Component {
	
	constructor(props) {
        super(props);
		this.state = {
			
			eventsGlobBin: [],
			eventsCompBin: [],
			eventsDivBin: [],
			
			promptsBin: [],
			
			pageNum: 0,
			numPerPage: 5,
			
			searchText: "",
			searchType: "text",
			
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
		this.getEvents()
	};
	
	forceLogout = () => {
		this.props.forceLogout()
	}
	
	setLastClickedEvent = (event) => {
		this.setState({
			lastClickedEventIndex: Number(event.target.value)
		})
	}
	
	getEventsFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.forceLogout()
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
			getEventsStatus: 3,
			getEventsError: returnData,
		})
	}
	getEventsSuccess = (incomingEvents) => {
		//console.log(this.props.currentDivisionID)
		
		// I need to sort these here....
		//console.log(incomingEvents)
		
		let sortedGlobal = []
		let sortedCompany = []
		let sortedDivision = []
		
		for (let index in incomingEvents) {
			//console.log(incomingEvents[index])
			if (incomingEvents[index]["creatorCompany"] === null) {
				sortedGlobal.push(incomingEvents[index])
			}
			else if (incomingEvents[index]["creatorDivision"] === this.props.currentDivisionID) {
				sortedDivision.push(incomingEvents[index])
			}
			// This should only trigger if the company made this, as that is what is sent here...
			// However, that may not be the case in the future, so this needs to be better!
			else {
				sortedCompany.push(incomingEvents[index])
			}
		}
		
		this.setState({
			eventsGlobBin: sortedGlobal,
			eventsCompBin: sortedCompany,
			eventsDivBin: sortedDivision,
			
			getEventsStatus: 2,
		})
	}
	getEvents = () => {
		if (!(this.props.currentDivisionID === -1)) {
			let checkData = undefined
			if (checkData === undefined) {
				APIGetDivisionEvents( this.props.authToken, this.props.currentDivisionID, this.getEventsSuccess, this.getEventsFailure )
				this.setState({
					getEventsStatus: 1,
				})
			}
			else {
				//getEventsSuccess( ??? )
			}
		}
		else {
			console.log("MOVE IT BACK TO THE SELECT COMPANY HERE!")
		}
	}
	
	saveEventsFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.forceLogout()
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
			saveEventStatus: 3,
			saveEventError: returnData,
		})
	}
	saveEventsSuccess = (savedIndex, incomingMessage) => {
		if ( !this.state.eventsDivBin[savedIndex]["fromServer"] ) {
			let temp = this.state.eventsDivBin.slice()
			temp[savedIndex]["id"] = Number(incomingMessage.split(":")[1])
			temp[savedIndex]["fromServer"] = true

			this.setState({
				eventsDivBin: temp,
			})
		}
		this.setState({
			saveEventStatus: 2,
		})
	}
	saveDivEvent = (event) => {
		let selectedEvent = this.state.eventsDivBin[event.target.value]

		let id = selectedEvent["id"]
		let newTrigger = selectedEvent["triggerType"]
		let newEnabledDiv = selectedEvent["usedBy"]
		let newEnabled = selectedEvent["enabled"]
		
		let newPrompts = []
		for (let index in selectedEvent["promptPool"]) {
			newPrompts.push( selectedEvent["promptPool"][index]["identifier"] )
		}
		
		APISetDivisionEvents(this.props.authToken, Number(event.target.value), id, this.props.currentDivisionID, newEnabledDiv, newEnabled, newTrigger, newPrompts, this.saveEventsSuccess, this.saveEventsFailure )
		this.setState({
			saveEventStatus: 0,
		})
	}
	
	saveNonDivEventsFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.forceLogout()
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
			saveEventStatus: 3,
			saveEventError: returnData,
		})
	}
	saveNonDivEventsSuccess = (savedIndex, incomingMessage) => {
		this.setState({
			saveEventStatus: 2,
		})
	}
	saveGlobEvent = (event) => {
		let selectedEvent = this.state.eventsGlobBin[event.target.value]

		let id = selectedEvent["id"]
		let newEnabledDiv = selectedEvent["usedBy"]
		
		APISetNonDivisionEvents(this.props.authToken, Number(event.target.value), id, this.props.currentDivisionID, newEnabledDiv, this.saveNonDivEventsSuccess, this.saveNonDivEventsFailure )
		this.setState({
			saveEventStatus: 0,
		})
	}
	saveCompEvent = (event) => {
		let selectedEvent = this.state.eventsCompBin[event.target.value]

		let id = selectedEvent["id"]
		let newEnabledDiv = selectedEvent["usedBy"]
		
		APISetNonDivisionEvents(this.props.authToken, Number(event.target.value), id, this.props.currentDivisionID, newEnabledDiv, this.saveNonDivEventsSuccess, this.saveNonDivEventsFailure )
		this.setState({
			saveEventStatus: 0,
		})
	}
	
	searchForPromptsFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.forceLogout()
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
			searchForStatus: 3,
			searchForError: returnData,
		})
	}
	searchForPromptsCallback = (incomingPrompts) => {

		this.setState({
			promptsBin: incomingPrompts,
			hasSent: true,
			
			searchForStatus: 2,
		})
	}
	searchForPrompts = () => {
		let checkData = undefined
		if (checkData === undefined) {
			//console.log("Prompts are not in storage!")
			APIGetSearchPrompts(this.props.authToken, this.state.searchText, this.state.searchType, this.searchForPromptsCallback, this.searchForPromptsFailure)			
			this.setState({
				searchForStatus: 1,
			})
		}
		else {
			console.log("Prompts ARE in storage!")
			//this.searchForPromptsCallback(checkData.???, checkData.???)
		}
	}
	
	deleteEventFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.forceLogout()
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
			deleteEventStatus: 3,
			deleteEventError: returnData,
		})
	}
	deleteEventCallback = (storedID, incomingMessage) => {
		
		let valueInt = Number(storedID)
		let temp = this.state.eventsDivBin.slice()
		temp.splice(valueInt,1)
		
		this.setState({
			eventsDivBin: temp,
			deleteEventStatus: 2,
		})
		
	}
	deleteEvent = (event) => {
		let selectedEvent = this.state.eventsDivBin[ Number(event.target.value) ]

		let id = selectedEvent["id"]
		
		if (!selectedEvent["fromServer"]) {
			this.deleteEventCallback( Number(event.target.value), "Not On The Server")
		}
		else{			
			APIDeleteDivisionEvents(this.props.authToken, Number(event.target.value), id, this.props.currentDivisionID, this.deleteEventCallback, this.deleteEventFailure )
			this.setState({
				deleteEventStatus: 1,
			})
		}
	}

	createEvent = () => {
		let newEvents = this.state.eventsDivBin.slice()
		
		// I can proboly replace the "Fromserver" with an id of -1?
		newEvents.push(
			{"id":-1, "triggerType":0, "promptPool":[], "enabled":true, "usedBy":false, "fromServer":false}
		)
		
		this.setState({
			eventsDivBin: newEvents,
		})
	}
	
	changeInput = (event) => {
		
		this.setState({
			searchText: event.target.value
		})
	}
	
	deleteEventPrompt = (event) => {
		let eventIndex = Number(event.target.name)
		let promptIndex = Number(event.target.value)

		let temp = this.state.eventsDivBin.slice()
		temp[eventIndex]["promptPool"].splice( promptIndex,1 )
		
		//console.log(eventIndex)
		//console.log(promptIndex)
		
		this.setState({
			eventsDivBin: temp,
		})
	}
	
	addingEventPrompt = (event) => {
		let promptIndex = Number(event.target.value)
		
		let targetIndex = this.state.lastClickedEventIndex
		
		if (targetIndex >= 0) {
			let temp = this.state.eventsDivBin.slice()
			
			// Check to see if it is already here...
			let sanity = temp[targetIndex]["promptPool"].find(element => element["identifier"] === this.state.promptsBin[ promptIndex ]["identifier"] )
			
			let promptReport = 0
			if (sanity === undefined) {
				temp[targetIndex]["promptPool"].push(this.state.promptsBin[ promptIndex ])
				promptReport = 1
			}
			else{
				promptReport = 2
			}

			this.setState({
				eventsDivBin: temp,
				addedPrompt: promptReport,
			})
		}
	}
	
	changeTrigger = (event) => {
		let idNumberName = event.target.name.split(",")
	
		let alteredEvents = this.state.eventsDivBin.slice()
		alteredEvents[ idNumberName[0] ]["triggerType"] = Number(idNumberName[1])
		
		this.setState({
			eventsDivBin: alteredEvents,
		})
	}
	
	enabledGlobalFieldChange = (event) => {
		let alteredEvents = this.state.eventsGlobBin.slice()
		alteredEvents[event.target.name]["usedBy"] = !alteredEvents[event.target.name]["usedBy"]
		
		this.setState({
			eventsGlobBin: alteredEvents,
		})
	}
	enabledCompanyFieldChange = (event) => {
		let alteredEvents = this.state.eventsCompBin.slice()
		alteredEvents[event.target.name]["usedBy"] = !alteredEvents[event.target.name]["usedBy"]
		
		this.setState({
			eventsCompBin: alteredEvents,
		})
	}
	enabledDivisionFieldChange = (event) => {
		let alteredEvents = this.state.eventsDivBin.slice()
		alteredEvents[event.target.name]["usedBy"] = !alteredEvents[event.target.name]["usedBy"]
		
		this.setState({
			eventsDivBin: alteredEvents,
		})
	}
	enabledDivisionFieldChangeSuper = (event) => {
		let alteredEvents = this.state.eventsDivBin.slice()
		alteredEvents[event.target.name]["enabled"] = !alteredEvents[event.target.name]["enabled"]
		
		this.setState({
			eventsDivBin: alteredEvents,
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
	
	render() {
		
		//let showIdle = this.state.getEventsStatus === 0 || this.state.saveEventStatus === 0 || this.state.searchForStatus === 0 || this.state.deleteEventStatus === 0
		let showWaiting = this.state.getEventsStatus === 1 || this.state.saveEventStatus === 1 || this.state.deleteEventStatus === 1 //|| this.state.searchForStatus === 1 
		let showSuccess = this.state.saveEventStatus === 2 || this.state.deleteEventStatus === 2 //|| this.state.searchForStatus === 2 || this.state.getEventsStatus === 2 || 
		let showError = this.state.getEventsStatus === 3 || this.state.saveEventStatus === 3 || this.state.deleteEventStatus === 3 //|| this.state.searchForStatus === 3
		
		let errorParse = []
		for (let index in this.state.getEventsError) {
			errorParse.push(
				this.state.getEventsError[index]["text"]
			)
		}
		for (let index in this.state.saveEventError) {
			errorParse.push(
				this.state.saveEventError[index]["text"]
			)
		}
		for (let index in this.state.deleteEventError) {
			errorParse.push(
				this.state.deleteEventError[index]["text"]
			)
		}
		for (let index in this.state.searchForError) {
			errorParse.push(
				this.state.searchForError[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}
		
		let globModals = []
		let showGlobalEvents = []
		for (let index in this.state.eventsGlobBin) {
			let thisEvent = this.state.eventsGlobBin[index]
			
			showGlobalEvents.push(
				<div className="col" key={index}>
					<div className="card">
						<div className="card-header">

						</div>
						<div className="card-body">
							<div className="row">
								<div className="col">
									Trigger Type: { triggerType[ thisEvent["triggerType"] ] }
								</div>
							</div>
							<div className="row m-1">
								<div className="col">
									<b><u><i>{thisEvent["promptPool"].length}</i></u></b> Prompts
									<button className="btn btn-secondary mx-2" data-toggle="modal" data-target={"#globPrompts"+index}>
										Show
									</button>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className='custom-control custom-checkbox'>
										<input type='checkbox' className='custom-control-input' id={'customCheckGlob'+index} name={index} value={thisEvent["usedBy"]} onChange={this.enabledGlobalFieldChange} checked={thisEvent["usedBy"]} />
										<label className='custom-control-label' htmlFor={'customCheckGlob'+index} >Enabled For This Division</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className='custom-control custom-checkbox'>
										<input type='checkbox' className='custom-control-input' id={'customCheckGlob2'+index} name={index} value={thisEvent["enabled"]} checked={thisEvent["enabled"]} disabled />
										<label className='custom-control-label' htmlFor={'customCheckGlob2'+index} >Is Enabled</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<button className="btn btn-primary" value={index} onClick={this.saveGlobEvent}>
										Save Changes
									</button>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			)
			
			//console.log(thisEvent)
			
			let displayCurrentPrompts = []
			for (let indexSub in thisEvent["promptPool"]) {
				let subset = thisEvent["promptPool"][indexSub]["text"].substring(0, 12) + "...";
				
				//console.log(thisEvent["promptPool"][indexSub])
				displayCurrentPrompts.push(
				
					<tr key={indexSub}>
						<th scope="row">
							<button className="btn btn-outline-secondary" data-toggle="collapse" data-target={"#displayGlobPromptCollapse"+index+indexSub}>
								{subset}
							</button>
						</th>
						<td>{thisEvent["promptPool"][indexSub]["identifier"]}</td>
						<td>{promptType[thisEvent["promptPool"][indexSub]["promptType"]]}</td>
					</tr>,
					<tr key={1 + indexSub + thisEvent["promptPool"].length}>
						<th scope="row" colSpan="4" className="collapse" id={"displayGlobPromptCollapse"+index+indexSub}>
							{thisEvent["promptPool"][indexSub]["text"]}
						</th>
					</tr>
				)
			}
			
			if (displayCurrentPrompts.length === 0) {
				displayCurrentPrompts.push(
					<tr key={0}>
						<th scope="row" colSpan="4">
							Nothing here!
						</th>
					</tr>
				)
			}
			
			globModals.push(
				<div key={index} className="modal fade" id={"globPrompts"+index} tabIndex="-1" role="dialog" aria-labelledby="globPromptsDisplayer" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">

								<h5 className="modal-title">Altering Prompts</h5>
								<button type="btn btn-danger" className="close" data-dismiss="modal" aria-label="Close">
								  <span aria-hidden="true">&times;</span>
								</button>

							</div>
							<div className="modal-body">
									
								<table className="table" key="1">
									<thead>
										<tr>
											<th scope="col">Text</th>
											<th scope="col">IID?</th>
											<th scope="col">Type</th>
										</tr>
									</thead>
									
									<tbody>
										{displayCurrentPrompts}
									</tbody>
								</table>
							</div>
							<div className="modal-footer">

								{/*
								<button type="button" className="btn btn-danger" data-dismiss="modal">Yes</button>
								<button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
								*/}

							</div>
						</div>
					</div>
				</div>
			)
		}
		
		if (showGlobalEvents.length === 0) {
			showGlobalEvents.push(
				<div className="col" key={0}>
					Nothing Here!
				</div>
			)
		}

		let compModals = []
		let showCompEvents = []
		for (let index in this.state.eventsCompBin) {
			let thisEvent = this.state.eventsCompBin[index]
			
			showCompEvents.push(
				<div className="col" key={index}>
					<div className="card">
						<div className="card-header">

						</div>
						<div className="card-body">
							<div className="row">
								<div className="col">
									Trigger Type: { triggerType[ thisEvent["triggerType"] ] }
								</div>
							</div>
							<div className="row m-1">
								<div className="col">
									<b><u><i>{thisEvent["promptPool"].length}</i></u></b> Prompts
									<button className="btn btn-secondary mx-2" data-toggle="modal" data-target={"#compPrompts"+index}>
										Show
									</button>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className='custom-control custom-checkbox'>
										<input type='checkbox' className='custom-control-input' id={'customCheckComp'+index} name={index} value={thisEvent["usedBy"]} onChange={this.enabledCompanyFieldChange} checked={thisEvent["usedBy"]} />
										<label className='custom-control-label' htmlFor={'customCheckComp'+index} >Enabled For This Division</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className='custom-control custom-checkbox'>
										<input type='checkbox' className='custom-control-input' id={'customCheckComp2'+index} name={index} value={thisEvent["enabled"]} checked={thisEvent["enabled"]} disabled />
										<label className='custom-control-label' htmlFor={'customCheckComp2'+index} >Is Enabled</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<button className="btn btn-primary" value={index} onClick={this.saveCompEvent}>
										Save Changes
									</button>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			)
			
			let displayCurrentPrompts = []
			for (let indexSub in thisEvent["promptPool"]) {
				
				let subset = thisEvent["promptPool"][indexSub]["text"].substring(0, 12) + "...";
				
				//console.log(thisEvent["promptPool"][indexSub])
				displayCurrentPrompts.push(
				
					<tr key={indexSub}>
						<th scope="row">
							<button className="btn btn-outline-secondary" data-toggle="collapse" data-target={"#displayCompPromptCollapse"+index+indexSub}>
								{subset}
							</button>
						</th>
						<td>{thisEvent["promptPool"][indexSub]["identifier"]}</td>
						<td>{promptType[thisEvent["promptPool"][indexSub]["promptType"]]}</td>
					</tr>,
					<tr key={1 + indexSub + thisEvent["promptPool"].length}>
						<th scope="row" colSpan="4" className="collapse" id={"displayCompPromptCollapse"+index+indexSub}>
							{thisEvent["promptPool"][indexSub]["text"]}
						</th>
					</tr>
					
				)
			}
			
			if (displayCurrentPrompts.length === 0) {
				displayCurrentPrompts.push(
					<tr key={0}>
						<th scope="row" colSpan="4">
							Nothing here!
						</th>
					</tr>
				)
			}
			
			compModals.push(
				<div key={index} className="modal fade" id={"compPrompts"+index} tabIndex="-1" role="dialog" aria-labelledby="compPromptsDisplayer" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">

								<h5 className="modal-title">Altering Prompts</h5>
								<button type="btn btn-danger" className="close" data-dismiss="modal" aria-label="Close">
								  <span aria-hidden="true">&times;</span>
								</button>

							</div>
							<div className="modal-body">
									
								<table className="table" key="1">
									<thead>
										<tr>
											<th scope="col">Text</th>
											<th scope="col">IID?</th>
											<th scope="col">Type</th>
										</tr>
									</thead>
									
									<tbody>
										{displayCurrentPrompts}
									</tbody>
								</table>
							</div>
							<div className="modal-footer">

								{/*
								<button type="button" className="btn btn-danger" data-dismiss="modal">Yes</button>
								<button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
								*/}

							</div>
						</div>
					</div>
				</div>
			)
		}
		if (showCompEvents.length === 0) {
			showCompEvents.push(
				<div className="col" key={0}>
					Nothing Here!
				</div>
			)
		}
		
		//console.log(this.state.eventsDivBin)
		
		// Lets try doing MODALS like this....
		let divModals = []
		let showDivisionEvents = []
		for (let index in this.state.eventsDivBin) {
			let thisEvent = this.state.eventsDivBin[index]

			showDivisionEvents.push(
				
				<div className="col" key={index}>
					<div className="card">
						<div className="card-header">
							{ !thisEvent["fromServer"] &&
								<div className="text-danger">
									Not Saved!
								</div>
							}
							Delete
							<button className="badge badge-danger badge-pill" name="test" value={index} onClick={this.deleteEvent}>
								X
							</button>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col">
									<div className='dropdown'>
										Trigger Type:
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
							</div>
							<div className="row m-1">
								<div className="col">
									<b><u><i>{thisEvent["promptPool"].length}</i></u></b> Prompts
									<button className="btn btn-secondary mx-2" data-toggle="modal" data-target={"#changePrompts"+index}>
										Change
									</button>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className='custom-control custom-checkbox'>
										<input type='checkbox' className='custom-control-input' id={'customCheckDiv'+index} name={index} value={thisEvent["usedBy"]} onChange={this.enabledDivisionFieldChange} checked={thisEvent["usedBy"]} />
										<label className='custom-control-label' htmlFor={'customCheckDiv'+index} >Enabled For This Division</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className='custom-control custom-checkbox'>
										<input type='checkbox' className='custom-control-input' id={'customCheckDiv2'+index} name={index} value={thisEvent["enabled"]} onChange={this.enabledDivisionFieldChangeSuper} checked={thisEvent["enabled"]} disabled />
										<label className='custom-control-label' htmlFor={'customCheckDiv2'+index} >Enabled For ALL Divisions</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<button className="btn btn-primary" value={index} onClick={this.saveDivEvent}>
										Save
									</button>
								</div>
							</div>
							
						</div>
					</div>
				</div>
				
			)
			
			let displayCurrentPrompts = []
			for (let indexSub in thisEvent["promptPool"]) {
				
				let subset = thisEvent["promptPool"][indexSub]["text"].substring(0, 12) + "...";
				
				displayCurrentPrompts.push(
				
					<tr key={indexSub}>
						<th scope="row">
							<button className="btn btn-outline-secondary" data-toggle="collapse" data-target={"#displayPromptCollapse"+index+indexSub}>
								{subset}
							</button>
						</th>
						<td>{thisEvent["promptPool"][indexSub]["identifier"]}</td>
						<td>{promptType[thisEvent["promptPool"][indexSub]["promptType"]]}</td>
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
			
			if (displayCurrentPrompts.length === 0) {
				displayCurrentPrompts.push(
					<tr key={0}>
						<th scope="row" colSpan="4">
							Nothing here!
						</th>
					</tr>
				)
			}
			
			divModals.push(
				<div key={index} className="modal fade" id={"changePrompts"+index} tabIndex="-1" role="dialog" aria-labelledby="promptChanger" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">

								<h5 className="modal-title">Altering Prompts</h5>
								<button type="btn btn-danger" className="close" data-dismiss="modal" aria-label="Close">
								  <span aria-hidden="true">&times;</span>
								</button>

							</div>
							<div className="modal-body">
									
								<table className="table" key="1">
									<thead>
										<tr>
											<th scope="col">Text</th>
											<th scope="col">IID?</th>
											<th scope="col">Type</th>
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
							<div className="modal-footer">

								{/*
								<button type="button" className="btn btn-danger" data-dismiss="modal">Yes</button>
								<button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
								*/}

							</div>
						</div>
					</div>
				</div>
			)
		}
		
		if (showCompEvents.length === 0) {
			showCompEvents.push(
				<div className="col" key={0}>
					Nothing Here!
				</div>
			)
		}
		
		let showSearchPrompts = []
		//console.log(this.state.pageNum)
		//console.log(this.state.numPerPage)

		if (this.state.promptsBin.length > 0) {
		
			for (let index = 0; index < this.state.numPerPage; index++) {
				
				let alteredIndex = index + this.state.pageNum*this.state.numPerPage
				
				if (alteredIndex >= this.state.promptsBin.length) {
					break;
				}
				
				let subset = this.state.promptsBin[alteredIndex]["text"].substring(0, 12) + "...";
				
				showSearchPrompts.push(

					<tr key={alteredIndex}>
						<th scope="row">
							<button className="btn btn-outline-secondary" data-toggle="collapse" data-target={"#collapseExample"+alteredIndex}>
								{subset}
							</button>
						</th>
						<td>{ this.state.promptsBin[alteredIndex]["identifier"] }</td>
						<td>{ this.state.promptsBin[alteredIndex]["property1"] }</td>
						<th>
							<button className="btn btn-outline-secondary" value={alteredIndex} onClick={this.addingEventPrompt}>
								+
							</button>
						</th>
					</tr>,
					<tr key={1 + alteredIndex + this.state.promptsBin.length}>
						<th scope="row" colSpan="4" className="collapse" id={"collapseExample"+alteredIndex}>
							{ this.state.promptsBin[alteredIndex]["text"] }
						</th>
					</tr>
					
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
		
		return (
			<div className="EHIDisplay">
				<div className="container-fluid">
				
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>This Division's Events</h5>
								</div>
								<div className="card-body">
									<div className="row">
										{showDivisionEvents}
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
				
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>This Company's Shared Events</h5>
								</div>
								<div className="card-body">
									<div className="row">
										{showCompEvents}
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>Global Events</h5>
								</div>
								<div className="card-body">
									<div className="row">
										{showGlobalEvents}
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
						  Successfully obtained data or saved!
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
					
					{/*
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>This Division Only</h5>
								</div>
								<div className="card-body">
									<div className="row">
										{showGlobalEvents}
									</div>
								</div>
							</div>
						</div>
					</div>
					*/}
					
					{globModals}
					{compModals}
					{divModals}
					
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
								
									<div className="input-group rounded">
										<input type="search" className="form-control rounded" placeholder="Search Text" aria-label="Search" aria-describedby="search-addon" onChange={this.changeInput} />
										<button className="input-group-text border-0" id="search-addon" onClick={this.searchForPrompts}>
											<Search className="iconBG" color="black" size={16} />
										</button>
									</div>
										
									<table className="table" key="1">
										<thead>
											<tr>
												<th scope="col">Text</th>
												<th scope="col">IID?</th>
												<th scope="col">Prop 1?</th>
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

export default withRouter(PromptDisplay);