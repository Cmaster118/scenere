import React from "react";
import { Search } from 'react-bootstrap-icons';

import { withRouter, } from "react-router-dom";

import { APIGetSearchPrompts, APIGetDivisionEvents, APISetDivisionEvents, APIDeleteDivisionEvents } from "../../utils";

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
			
			//eventsGlobBin: [],
			eventsCompBin: [],
			//eventsDivBin: [],
			promptsBin: [],
			
			pageNum: 0,
			numPerPage: 5,
			
			searchText: "",
			searchType: "text",
			
			hasSent: false,
			
			eventSuccessIndex: -1,
			eventErrorIndex: -1,
			eventErrorMessage: "",
			
			lastClickedEventIndex: -1,
			
			addedPrompt: 0,
		}
	}
	
	componentDidMount() {
		this.getEvents()
	};
	
	setLastClickedEvent = (event) => {
		this.setState({
			lastClickedEventIndex: Number(event.target.value)
		})
	}
	
	getEventsSuccess = (incomingEvents) => {
		//console.log(incomingEvents)
		this.setState({
			eventsCompBin: incomingEvents
		})
	}
	getEventsFailure = (errorCodes, errorData) => {
		console.log(errorCodes)
		console.log(errorData)
		
		this.props.forceLogout()
	}
	getEvents = () => {
		if (!(this.props.currentDivisionID === -1)) {
			let checkData = undefined
			if (checkData === undefined) {
				APIGetDivisionEvents( this.props.APIHost, this.props.authToken, this.props.currentDivisionID, this.getEventsSuccess, this.getEventsFailure )
			}
			else {
				//getEventsSuccess( ??? )
			}
		}
	}
	
	saveEventsSuccess = (savedIndex, incomingMessage) => {
		if ( !this.state.eventsCompBin[savedIndex]["fromServer"] ) {
			let temp = this.state.eventsCompBin.slice()
			temp[savedIndex]["id"] = Number(incomingMessage.split(":")[1])
			temp[savedIndex]["fromServer"] = true

			this.setState({
				eventsCompBin: temp,
			})
		}
		this.setState({
			eventSuccessIndex: savedIndex,
		})
	}
	saveEventsFailure = (savedIndex, errorCodes, errorData) => {
		console.log(errorCodes)
		console.log(errorData)
		
		this.props.forceLogout()
	}
	saveCompEvent = (event) => {
		let selectedEvent = this.state.eventsCompBin[event.target.value]

		let id = selectedEvent["id"]
		let newTrigger = selectedEvent["triggerType"]
		let newEnabledDiv = selectedEvent["usedBy"]
		let newEnabled = selectedEvent["enabled"]
		
		let newPrompts = []
		for (let index in selectedEvent["promptPool"]) {
			newPrompts.push( selectedEvent["promptPool"][index]["identifier"] )
		}
		
		APISetDivisionEvents(this.props.APIHost, this.props.authToken, Number(event.target.value), id, this.props.currentDivisionID, newEnabledDiv, newEnabled, newTrigger, newPrompts, this.saveEventsSuccess, this.saveEventsFailure )
	}
	
	searchForPromptsCallback = (incomingPrompts) => {

		this.setState({
			promptsBin: incomingPrompts,
			hasSent: true,
		})
	}
	searchForPromptsFailure = (errorCodes, errorData) => {
		console.log(errorCodes)
		console.log(errorData)
		
		this.props.forceLogout()
	}
	searchForPrompts = () => {
		let checkData = undefined
		if (checkData === undefined) {
			//console.log("Prompts are not in storage!")
			APIGetSearchPrompts(this.props.APIHost, this.props.authToken, this.state.searchText, this.state.searchType, this.searchForPromptsCallback, this.searchForPromptsFailure)			
		}
		else {
			console.log("Prompts ARE in storage!")
			//this.searchForPromptsCallback(checkData.???, checkData.???)
		}
	}
	
	deleteEventCallback = (storedID, incomingMessage) => {
		
		let valueInt = Number(storedID)
		let temp = this.state.eventsCompBin.slice()
		temp.splice(valueInt,1)
		
		this.setState({
			eventsCompBin: temp,
		})
		
	}
	deleteEventFailure = (errorCodes, errorData) => {
		console.log(errorCodes)
		console.log(errorData)
		
		this.props.forceLogout()
	}
	deleteEvent = (event) => {
		let selectedEvent = this.state.eventsCompBin[ Number(event.target.value) ]

		let id = selectedEvent["id"]
		
		if (!selectedEvent["fromServer"]) {
			this.deleteEventCallback( Number(event.target.value), "Not On The Server")
		}
		else{			
			APIDeleteDivisionEvents(this.props.APIHost, this.props.authToken, Number(event.target.value), id, this.props.currentDivisionID, this.deleteEventCallback, this.deleteEventFailure )
		}
	}

	createEvent = () => {
		let newEvents = this.state.eventsCompBin.slice()
		
		// I can proboly replace the "Fromserver" with an id of -1?
		newEvents.push(
			{"id":-1, "triggerType":0, "promptPool":[], "enabled":true, "usedBy":false, "fromServer":false}
		)
		
		this.setState({
			eventsCompBin: newEvents,
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

		let temp = this.state.eventsCompBin.slice()
		temp[eventIndex]["promptPool"].splice( promptIndex,1 )
		
		//console.log(eventIndex)
		//console.log(promptIndex)
		
		this.setState({
			eventsCompBin: temp,
		})
	}
	
	addingEventPrompt = (event) => {
		let promptIndex = Number(event.target.value)
		
		let targetIndex = this.state.lastClickedEventIndex
		
		if (targetIndex >= 0) {
			let temp = this.state.eventsCompBin.slice()
			
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
				eventsCompBin: temp,
				addedPrompt: promptReport,
			})
		}
	}
	
	changeTrigger = (event) => {
		let idNumberName = event.target.name.split(",")
	
		let alteredEvents = this.state.eventsCompBin.slice()
		alteredEvents[ idNumberName[0] ]["triggerType"] = Number(idNumberName[1])
		
		this.setState({
			eventsCompBin: alteredEvents,
		})
	}
	
	enabledDivFieldChange = (event) => {
		let alteredEvents = this.state.eventsCompBin.slice()
		alteredEvents[event.target.name]["usedBy"] = !alteredEvents[event.target.name]["usedBy"]
		
		this.setState({
			eventsCompBin: alteredEvents,
		})
	}
	enabledGloFieldChange = (event) => {
		let alteredEvents = this.state.eventsCompBin.slice()
		alteredEvents[event.target.name]["enabled"] = !alteredEvents[event.target.name]["enabled"]
		
		this.setState({
			eventsCompBin: alteredEvents,
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
		
		let showGlobalEvents = []
		/*for (let index in this.state.eventsGlobBin) {
			let thisEvent = this.state.eventsGlobBin[index]
		}*/
		
		if (showGlobalEvents.length === 0) {
			showGlobalEvents.push(
				<div className="col" key={0}>
					Nothing Here!
				</div>
			)
		}
		
		// Lets try doing MODALS like this....
		let modals = []
		let showEvents = []
		for (let index in this.state.eventsCompBin) {
			let thisEvent = this.state.eventsCompBin[index]

			showEvents.push(
				
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
										<input type='checkbox' className='custom-control-input' id={'customCheck1'+index} name={index} value={thisEvent["usedBy"]} onChange={this.enabledDivFieldChange} checked={thisEvent["usedBy"]} />
										<label className='custom-control-label' htmlFor={'customCheck1'+index} >Enabled For This Division</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className='custom-control custom-checkbox'>
										<input type='checkbox' className='custom-control-input' id={'customCheck2'+index} name={index} value={thisEvent["enabled"]} onChange={this.enabledGloFieldChange} checked={thisEvent["enabled"]} disabled />
										<label className='custom-control-label' htmlFor={'customCheck2'+index} >Enabled For ALL Divisions</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<button className="btn btn-primary" value={index} onClick={this.saveCompEvent}>
										Save
									</button>
								</div>
							</div>
							
							{this.state.eventSuccessIndex === Number(index) &&
								<div className="row">
									<div className="col text-success">
										Saved!
									</div>
								</div>
							}
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
							<button className="btn btn-outline-secondary" data-toggle="collapse" data-target={"#displayPromptCollapse"+indexSub}>
								{subset}
							</button>
						</th>
						<td>{thisEvent["promptPool"][indexSub]["identifier"]}</td>
						<td>{thisEvent["promptPool"][indexSub]["property1"]}</td>
						<th>
							<button className="close" type="button" value={indexSub} name={index} onClick={this.deleteEventPrompt} aria-label="Close">
								&times;
							</button>
						</th>
					</tr>,
					<tr key={1 + indexSub + thisEvent["promptPool"].length}>
						<th scope="row" colSpan="4" className="collapse" id={"displayPromptCollapse"+indexSub}>
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
			
			modals.push(
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
											<th scope="col">Prop 1?</th>
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
		
		if (showEvents.length === 0) {
			showEvents.push(
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
				
					{/*
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
					*/}
				
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h5>This Company's Shared Events</h5>
								</div>
								<div className="card-body">
									<div className="row">
										{showEvents}
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
					
					{modals}
					
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