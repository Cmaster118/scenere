import React from "react";

// Link,
import { withRouter, Route, Switch } from "react-router-dom";
//import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { APISaveSuggestion, APIGetJournalData, APISaveJournal, APIGetJournalPrompts } from "../utils";
import { EditorState, convertToRaw } from 'draft-js';
//APIGetJournalDates

//import { Justify } from 'react-bootstrap-icons';

//SetCompany
import {UserProfile, UserSecurity, UserInvite, ViewJournals, WriteJournals, WriteSuggestion} from "./userPages"
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
			
			//  should move this down...
			journalCurrentPrompt: 0,
			journalValidPrompts: [],
			
			// Journal Read Page State...
			selectedJournalPrompt:"p1",
			selectedJournalAspect:"emotion",
			
			journalMessage: "Choose a date to view the journal!",
			journalContent: "Waiting for content...",
			
			// Where we storing the data from...
			viewJournalPrompts: [],
			viewJournalContents: [],
			viewJournalBlock: [],
			viewJournalAIData: [],
			
			// I need to put the content block stuff.......
			journalEditorState: EditorState.createEmpty(),
			journalErrors: [],
			
			suggestionEditorState: EditorState.createEmpty(),
			suggestionErrors: [],
			
			currentSuggestionDivision: -1,
			currentCompanyGovernedIndexes: [],
        };
	}
	
	componentDidMount() {
		this.props.activateUserMenu(1)
		
		this.getJournalPrompts()
	};
	componentWillUnmount() {
		this.props.disableMenu()
	}
	
	forceLogout = () => {
		// Gonna do this like this, in case we got something else we wana do on logout...
		this.props.forceLogout()
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
		
		let promptValue = "none"
		if (this.state.journalCurrentPrompt >= 0 && this.state.journalCurrentPrompt < this.state.journalValidPrompts.length && this.state.journalValidPrompts.length > 0) {		
			let promptValue = this.state.journalValidPrompts[ this.state.journalCurrentPrompt ]['identifier']	
			APISaveJournal(this.props.APIHost, this.props.authToken, inputDate, promptValue, journalContent, richContent, this.journalPostCallback, this.journalPostFailure)
		}
		else {
			APISaveJournal(this.props.APIHost, this.props.authToken, inputDate, promptValue, journalContent, richContent, this.journalPostCallback, this.journalPostFailure)
		}
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
		let targetDivision = this.state.currentSuggestionDivision
		
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
	
	journalDataCallback = (incomingJournalPrompts , incomingJournalContent, incomingJournalBlock, incomingAIData) => {

		this.setState({
			journalMessage: "Showing Journal Entry for: " + this.state.selectedJournalDate.toString(),
			
			viewJournalPrompts: incomingJournalPrompts,
			viewJournalContents: incomingJournalContent,
			viewJournalBlock: incomingJournalBlock,
			viewJournalAIData: incomingAIData,
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
			//console.log("Not in the cookies!")
			APIGetJournalData(this.props.APIHost, this.props.authToken, selectedDate, this.journalDataCallback, this.forceLogout)
		}
		else {
			//this.journalDataCallback(checkData.journalContent, checkData.AIData)
		}
	}
	
	journalPromptsCallback = (incomingPrompts) => {
		
		this.setState({
			journalValidPrompts: incomingPrompts,
		})
	}
	journalPromptsFailure = (errorCodes, errorData) => {
		console.log(errorCodes)
		console.log(errorData)
		this.forceLogout()
	}
	getJournalPrompts = () => {
		if (!(this.props.currentUser === undefined)) {	
			let checkData = undefined
			if (checkData === undefined) {
				//console.log("Prompts are not in storage!")
				APIGetJournalPrompts(this.props.APIHost, this.props.authToken, this.journalPromptsCallback, this.journalPromptsFailure)			
			}
			else {
				console.log("Prompts ARE in storage!")
				//this.journalPromptsCallback(checkData.???, checkData.???)
			}
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
	
	prevPrompt = () => {
		let newIndex = this.state.journalCurrentPrompt - 1

		if ( newIndex < 0 ) {
			newIndex = this.state.journalValidPrompts.length - 1
		}
		
		if (this.state.journalValidPrompts.length === 0) {
			newIndex = 0
		}

		this.setState({
			journalCurrentPrompt: newIndex,
			journalEditorState: EditorState.createEmpty(),
			journalErrors: [],
		})
	}
	nextPrompt = () => {

		let newIndex = this.state.journalCurrentPrompt + 1
		
		if ( newIndex >= this.state.journalValidPrompts.length ) {
			newIndex = 0
		}

		this.setState({
			journalCurrentPrompt: newIndex,
			journalEditorState: EditorState.createEmpty(),
			journalErrors: [],
		})
	}
	
	// Meanwhile, over in the suggestion selector...
	selectGovernedCompanyLayer = (event) => {
		let values = this.state.currentCompanyGovernedIndexes
		values.push(event.target.value)
		
		let newDivision = values[ values.length-1 ]
		
		this.setState({
			currentSuggestionDivision: newDivision,
			currentCompanyGovernedIndexes:values,
			lastGovernedCompanyRequestStatus:undefined,
		})
	}
	backGovernedCompanyLayer = (event) => {
		let values = this.state.currentCompanyGovernedIndexes
		values.splice(event.target.value)
		
		let newDivision = values[ values.length-1 ]
		//console.log(newDivision)
		
		this.setState({
			currentSuggestionDivision: newDivision,
			currentCompanyGovernedIndexes:values,
			lastGovernedCompanyRequestStatus:undefined,
		})
	}
	
	// Rendering this with Bootstrap React.... To see if there is anything really interesting I can do with it
	// So far it doesnt look all that different 
	render() {
		
		return (
			<div className="contentPages">
			
				<div className="container">
					{/*Entire thing...*/}
					<div className="row m-1 my-5">
						{/*
						<div className="col- m-1">
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
							<div className="row">
								<div className="col">
									<div className="card shadow">
										<div className="card-header">
											<Link className="list-group-item" to={this.props.reRouteUser}>Return To Dashboard</Link>
										</div>
										<div className="card-body">
											<div className="list-group">
												<Link className="list-group-item" to={this.props.match.url+"/journalWrite"}>Write Todays Journal</Link>
												<Link className="list-group-item" to={this.props.match.url+"/journalRead"}>Review Previous Journals</Link>
												<Link className="list-group-item" to={this.props.match.url+"/writeSuggestion"}>Write Suggestion</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						*/}
						{/*Content for the everything....*/}
						<div className="col m-1">
							<Switch>
								<Route path={this.props.match.url+"/journalWrite"} component={() => <WriteJournals
										onChange={this.changeJournalContent}
										
										editorState={this.state.journalEditorState}
										saveToServer={this.postJournal}
										
										journalErrors={this.state.journalErrors}
										
										promptList={this.state.journalValidPrompts}
										promptIndex={this.state.journalCurrentPrompt}
										
										prevPrompt={this.prevPrompt}
										nextPrompt={this.nextPrompt}
									/>} 
								/>
								<Route path={this.props.match.url+"/journalRead"} component={() => <ViewJournals
										currentDate={this.state.selectedJournalDate}
										
										journalPromptSet={this.state.viewJournalPrompts}
										journalAIDataSet={this.state.viewJournalAIData}
										journalContentSet={this.state.viewJournalContents}
										journalRichContentSet={this.state.viewJournalBlock}
										
										selectedPrompt={this.state.selectedJournalPrompt}
										selectedAspect={this.state.selectedJournalAspect}
										
										validJournalDates={this.props.validJournalDates}
										validJournalScanDates={this.props.validJournalScanDates}
										
										pickDate={this.pickJournalCalenderDate}
										
										displayMessage={this.state.journalMessage}
										
										setPrompt={this.changeJournalPrompt}
										setAI={this.changeJournalAspect}
									/>} 
								/>
								<Route path={this.props.match.url+"/writeSuggestion"} component={() => <WriteSuggestion
								
										currentCompanySelections={this.state.currentCompanyGovernedIndexes}
										companyDataTree={this.props.companyGovernedDataTree}
										lastRequestStatus={this.props.lastGovernedCompanyRequestStatus}
										
										selectLayer={this.selectGovernedCompanyLayer}
										backLayer={this.backGovernedCompanyLayer}
										
										onChange={this.changeSuggestionContent}
										
										editorState={this.state.suggestionEditorState}
										saveToServer={this.postSuggestion}
										
										suggestionErrors={this.state.suggestionErrors}
									/>} 
								/>
								<Route path={this.props.match.url+"/userPermissions"} component={() => <UserProfile
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
								<Route path={this.props.match.url+"/userSecurity"} component={() => <UserSecurity
								
										APIHost={this.props.APIHost}
										authToken={this.props.authToken}
										
									/>} 
								/>
								<Route path={this.props.match.url+"/userInvite"} component={() => <UserInvite
								
										APIHost={this.props.APIHost}
										authToken={this.props.authToken}
								
										triggerRefresh={this.props.loadCompanyData}
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