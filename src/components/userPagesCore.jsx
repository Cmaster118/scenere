import React from "react";

import { withRouter, Link, Route, Switch } from "react-router-dom";
//import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { APISaveSuggestion, APIGetJournalDates, APIGetJournalData, APISaveJournal, } from "../utils";
import { EditorState, convertToRaw,  } from 'draft-js';

//SetCompany
import {UserProfile, ViewJournals, WriteJournals, WriteSuggestion} from "./userPages"
//convertFromRaw

const DefaultView = (props) => {

	return (
		<div className="defaultView">
			<h3>
				404! You have selected and invalid page
			</h3>
		</div>
	)
}

// This needs to be changed out as this is now in 2 files....

class ContentPages extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			selectedJournalDate: new Date(),
			
			// Journal Read Page State...
			selectedJournalPrompt:"p1",
			selectedJournalAspect:"emotion",
			
			// Where we storing the data from...
			selectedJournalData: {},
			
			journalMessage: "Choose a date to view the journal!",
			journalContent: "Waiting for content...",
			
			// I need to put the content block stuff.......
			journalEditorState: EditorState.createEmpty(),
			journalErrors: [],
			
			suggestionEditorState: EditorState.createEmpty(),
			suggestionErrors: [],
        };
	}
	
	forceLogout = () => {
		// Gonna do this like this, in case we got something else we wana do on logout...
		this.props.logout()
		this.props.history.push(this.props.reRouteTarget);
	}
	
	changeSuggestionContent = (incomingState) => {
		//console.log(incomingState)
		this.setState({
			suggestionEditorState:incomingState,
		})	
	}
	changeJournalContent = (incomingState) => {
		this.setState({
			journalEditorState:incomingState,
		})	
	}
	
	journalPostCallback = (incomingStuff) => {
		// Set something to notify user....
		this.setState({
			journalErrors: [[1,2], ["Success!",incomingStuff]]
			// Special for overwrite?
		})
	}
	journalPostFailure = (errorCodes, errorMessages) => {
		for (let index in errorCodes) {
			if (errorCodes[index] === 401) {
				this.forceLogout()
			}
			
			this.setState({
				journalErrors: [errorCodes, errorMessages]
			})
		}
	}
	postJournal = () => {
		// This may need to be overridden?
		let inputDate = this.props.currentDate
		let journalContent = this.state.journalEditorState.getCurrentContent().getPlainText()
		let richContent = convertToRaw(this.state.journalEditorState.getCurrentContent())
		
		APISaveJournal(this.props.APIHost, this.props.authToken, inputDate, journalContent, richContent, this.journalPostCallback, this.journalPostFailure)
	}
	
	// Posting the Suggestion...
	suggestionPostCallback = (incomingStuff) => {
		// Set something to notify user....
		this.setState({
			suggestionErrors: [[1,2], ["Success!", incomingStuff]]
		})
	}
	suggestionPostFailureCallback = (errorCodes, errorMessages) => {
		//console.log(errorCodes)
		for (let index in errorCodes) {
			if (errorCodes[index] === 401) {
				this.forceLogout()
			}
			
			this.setState({
				suggestionErrors: [errorCodes, errorMessages]
			})
		}
	}
	postSuggestion = () => {
		// This may need to be overridden?
		let inputDate = this.props.currentDate
		let suggestionContent = this.state.suggestionEditorState.getCurrentContent().getPlainText()
		let richContent = convertToRaw(this.state.suggestionEditorState.getCurrentContent())
		let targetDivision = this.props.currentSuggestionDivision
		
		//console.log(targetDivision)
		
		if (!(targetDivision === -1)) {
			APISaveSuggestion(this.props.APIHost, this.props.authToken, inputDate, targetDivision, suggestionContent, richContent, this.suggestionPostCallback, this.suggestionPostFailureCallback)
		}
		else {
			console.log("Not allowed!")
			// Just in case I should be able to get this from the server as well...
			this.setState({
				suggestionErrors: [ [4], ["You need to select a company!"] ]
			})
		}
	}
	
	journalDataCallback = (incomingjournalContent, incomingAIData) => {
		
		// I will  have to swap over to the bettern form of content...
		this.setState({
			journalMessage: "Showing Journal Entry for: " + this.state.selectedJournalDate.toString(),
			journalContent: incomingjournalContent,
			selectedJournalData: incomingAIData,
		})
	}
	pickJournalCalenderDate = (selectedDate) => {
		this.setState({
			selectedJournalDate:selectedDate
		})
		
		// THIS data should not be old
		// But if I DO save the block data, this may get real hairy storage wise...
		let checkData = undefined//Store.get(this.props.currentUser+"-Journal-"+selectedDate)
		if (checkData === undefined) {
			console.log("Not in the cookies!")
			APIGetJournalData(this.props.APIHost, this.props.authToken, selectedDate, this.journalDataCallback, this.forceLogout)
		}
		else {
			//this.journalDataCallback(checkData.journalContent, checkData.AIData)
		}
	}
	
	// Viewing the Journal's Prompt and Data...
	changeJournalPrompt = (event) => {
		this.setState({
			selectedJournalPrompt:event.currentTarget.value
		})
	}
	changeJournalAspect = (event) => {
		this.setState({
			selectedJournalAspect:event.currentTarget.value
		})
	}
	
	// Rendering this with Bootstrap React.... To see if there is anything really interesting I can do with it
	// So far it doesnt look all that different 
	render() {
		
		return (
			<div className="contentPages">
			
				<div className="container-fluid">
					{/*Entire thing...*/}
					<div className="row m-1 my-5">
						{/*Sidebar for selecting everything...*/}
						{/*First, lets list absolutly everything I would want to be selecting in this mode...*/}
						<div className="col- m-1">
							{/* A thing for the top of the sidebar*/}
							<div className="row">
								<div className="col">
									<div className="card shadow">
										<div className="card-header">
											<h5>Today's Date</h5>
										</div>
										<div className="card-body">
											{this.props.currentDate.toString().split("(")[0]}
										</div>
									</div>
								</div>
							</div>
							
							{/*Start of the Journal Mode Stuff...*/}
							<div className="row">
								<div className="col">
									<div className="card shadow">
										<div className="card-header">
											<h5>Journal View</h5>
										</div>
										<div className="card-body">
											<div className="list-group">
												{/*Going to need to alter this to show which is active?*/}
												{/*<Link className="list-group-item" to={this.props.match.url+"/EditProfile"}>Edit Profile</Link>*/}
												<Link className="list-group-item" to={this.props.match.url+"/journalWrite"}>Write Todays Journal</Link>
												<Link className="list-group-item" to={this.props.match.url+"/journalRead"}>Review Previous Journals</Link>
												<Link className="list-group-item" to={this.props.match.url+"/writeSuggestion"}>Write Suggestion</Link>
												<Link className="list-group-item" to={this.props.match.url+"/userProfile"}>User Profile</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/*Content for the everything....*/}
						<div className="col m-1">
							<Switch>
								<Route path={this.props.match.url+"/journalWrite"} component={() => <WriteJournals
										onChange={this.changeJournalContent}
										
										editorState={this.state.journalEditorState}
										saveToServer={this.postJournal}
										
										journalErrors={this.state.journalErrors}
									/>} 
								/>
								<Route path={this.props.match.url+"/journalRead"} component={() => <ViewJournals
										currentDate={this.state.selectedJournalDate}
										
										dataSet={this.state.selectedJournalData}
										selectedPrompt={this.state.selectedJournalPrompt}
										selectedAspect={this.state.selectedJournalAspect}
										
										validJournalDates={this.props.validJournalDates}
										validJournalScanDates={this.props.validJournalScanDates}
										
										pickDate={this.pickJournalCalenderDate}
										
										displayMessage={this.state.journalMessage}
										currentJournal={this.state.journalContent}
										
										setPrompt={this.changeJournalPrompt}
										setAI={this.changeJournalAspect}
									/>} 
								/>
								<Route path={this.props.match.url+"/writeSuggestion"} component={() => <WriteSuggestion
								
										currentCompanySelections={this.props.currentCompanyGovernedIndexes}
										companyDataTree={this.props.companyGovernedDataTree}
										lastRequestStatus={this.props.lastGovernedCompanyRequestStatus}
										
										selectLayer={this.props.selectGovernedCompanyLayer}
										backLayer={this.props.backGovernedCompanyLayer}
										getDataRequest={this.props.getGovernedCompanyDataRequest}
										
										onChange={this.changeSuggestionContent}
										
										editorState={this.state.suggestionEditorState}
										saveToServer={this.postSuggestion}
										
										suggestionErrors={this.state.suggestionErrors}
									/>} 
								/>
								<Route path={this.props.match.url+"/userProfile"} component={() => <UserProfile
										APIHost={this.props.APIHost}
										authToken={this.props.authToken}
										
										currentUser={this.props.currentUser}
										
										viewNameList={this.props.companyViewableDataRawList}
										viewIDList={this.props.companyViewableDataRawIDs}
										sendIDList={this.props.companySendDataRawIDList}
										
										governedNameList={this.props.companyGovernedDataRawList}
										governedIDList={this.props.companyGovernedDataRawIDList}
										
										triggerRefresh={this.props.loadCompanyData}
										triggerLogout={this.forceLogout}
										
									/>} 
								/>
								<Route path={this.props.match.url+"/"} component={() => <DefaultView
									/>} 
								/>
							
							</Switch>
						</div>
					</div>
					
				</div>
			</div>
		);
	}
}

export default withRouter(ContentPages);