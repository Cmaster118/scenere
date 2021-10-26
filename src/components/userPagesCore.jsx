import React from "react";

// Link,
import { withRouter, Route, Switch } from "react-router-dom";
//import { ButtonGroup, ToggleButton } from 'react-bootstrap';
//import { Alert } from 'react-bootstrap';
import { APISaveSuggestion, APIGetJournalData, APIGetNonJournalData } from "../utils";
import { EditorState, convertToRaw } from 'draft-js';
//convertFromRaw

//import { Justify } from 'react-bootstrap-icons';

//SetCompany
import {UserProfile, UserSecurity, UserInvite, ViewJournals, WriteJournals, WriteSuggestion, UserPrompts, UserWeb, UserSync} from "./userPages"

const debugPageName = "User Core"

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
			
			selectedJournalViewDiv: 0,
			
			journalValidPrompts: [],
			
			journalMessage: "Choose a date to view the journal!",
			journalContent: "Waiting for content...",
			
			viewJournalData: [],
			viewNonJournalData: [],
			
			suggestionEditorState: EditorState.createEmpty(),
			suggestionErrors: [],

			journalViewErrors: [],
			nonJournalViewErrors: [],
			journalPromptsErrors: [],
			
			currentSuggestionDivision: this.initializeSuggestionDivision(),

			postSuggestionStatus: 0,
			pickJournalCalenderDateStatus: 0,
			pickNonJournalCalenderDateStatus: 0,
			
        };
	}
	
	componentDidMount() {
		this.props.activateUserMenu(1)
	};
	componentWillUnmount() {
		this.props.disableMenu()
	}
	
	initializeSuggestionDivision = () => {
		
		let generatingList = []
		for (let index in this.props.userLoadedCompanyList) {
			
			let permType = -1
			for (let permIndex in this.props.userLoadedCompanyList[index]["perm"]) {
				if (this.props.userLoadedCompanyList[index]["perm"][permIndex] === 3) {
					//console.log("Is Admin")
					// Set the thing to admin no matter what
					permType = 3
				}
			}
			
			if (permType >= 0 && permType < 4) {
				generatingList.push( this.props.userLoadedCompanyList[index] )
			}
		}
		
		if (generatingList.length === 1) {
			return generatingList[0]["id"]
		}
		
		return -1
	}

	changeSuggestionContent = (incomingState) => {
		//console.log(incomingState)
		this.setState({
			suggestionEditorState:incomingState,
		})	
	}
	
	// Posting the Suggestion...
	suggestionPostFailureCallback = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.postSuggestion)
			this.props.debugSet(debugPageName, "Refresh Triggered", "Post Suggestion")
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
		
		this.props.debugSet(debugPageName, "Post Suggestion", "Failure")
		returnData = responseData['messages']
		this.setState({
			suggestionErrors: returnData,
			postSuggestionStatus:3,
		})
	}
	suggestionPostCallback = (incomingStuff) => {
		// Set something to notify user....
		this.props.debugSet(debugPageName, "Post Suggestion", "Success")
		this.setState({
			suggestionErrors: [],
			postSuggestionStatus:2,
		})
	}
	postSuggestion = () => {
		// This may need to be overridden?
		let inputDate = this.props.currentDate
		let suggestionContent = this.state.suggestionEditorState.getCurrentContent().getPlainText()
		let richContent = convertToRaw(this.state.suggestionEditorState.getCurrentContent())
		let targetDivision = this.state.currentSuggestionDivision
		
		//console.log(targetDivision)
		
		if (!(targetDivision === -1)) {
			APISaveSuggestion( inputDate, targetDivision, suggestionContent, richContent, this.suggestionPostCallback, this.suggestionPostFailureCallback)
			this.setState({
				postSuggestionStatus:1,
			})
		}
		else {
			console.log("Not allowed!")
			// Just in case I should be able to get this from the server as well...
			this.setState({
				suggestionErrors: [ "You need to select a company!" ]
			})
		}
	}
	
	refreshCompleted = () => {
		console.log("Put a Please Try again thing on the UI")
	}
	
	journalDataFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.refreshCompleted)
			this.props.debugSet(debugPageName, "Refresh Triggered", "Get Journal Data")
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
		
		this.props.debugSet(debugPageName, "Get Journal Data", "Failure")
		returnData = responseData['messages']
		this.setState({
			journalViewErrors: returnData,
			pickJournalCalenderDateStatus:3,
		})
	}
	journalDataCallback = (incomingFullData) => {

		this.props.debugSet(debugPageName, "Get Journal Data", "Success")
		this.setState({
			viewJournalData: incomingFullData,
			
			pickJournalCalenderDateStatus:2,
		})
	}
	nonJournalDataFailure = (responseData) => {
		let returnData = responseData['messages']
		
		// Server is dead
		if (responseData["action"] === 0) {
		
		}		
		// Unauthorized
		
		// So, this is inefficient... Refactor this!
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.refreshCompleted)
			this.props.debugSet(debugPageName, "Refresh Triggered", "Get Multi Choice Data")
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
		
		this.props.debugSet(debugPageName, "Get Multi Choice Data", "Failure")
		this.setState({
			nonJournalViewErrors: returnData,
			pickNonJournalCalenderDateStatus:3,
		})
	}
	nonJournalDataCallback = (incomingNonJournalData) => {

		this.props.debugSet(debugPageName, "Get Multi Choice Data", "Success")
		this.setState({
			//journalMessage: "Showing Journal Entry for: " + this.state.selectedJournalDate.toString(),
			
			viewNonJournalData: incomingNonJournalData,
			
			pickNonJournalCalenderDateStatus:2,
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
			
			// Perhaps I can find a good merge....
			// Both solutions I have thought of do not seem good enough yet....
			APIGetJournalData( selectedDate, this.journalDataCallback, this.journalDataFailure)
			APIGetNonJournalData( selectedDate, this.nonJournalDataCallback, this.nonJournalDataFailure)
			this.setState({
				pickJournalCalenderDateStatus:1,
				pickNonJournalCalenderDateStatus:1,
				
				viewJournalData: [],
				viewNonJournalData: [],
			})
		}
		else {
			//this.journalDataCallback(checkData.journalContent, checkData.AIData)
		}
	}
	
	setSuggestionDivision = (targetDivision) => {
		this.setState({
			currentSuggestionDivision:targetDivision,
		})
	}
	
	changeSelectedJournalViewDiv = (event) => {
		this.setState({
			selectedJournalViewDiv: event.target.value,
		})
	}
	
	// Rendering this with Bootstrap React.... To see if there is anything really interesting I can do with it
	// So far it doesnt look all that different 
	render() {
		
		let errorParse = []
		for (let index in this.state.journalPromptsErrors) {
			errorParse.push(
				this.state.journalPromptsErrors[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}
		
		return (
			<div className="contentPages">
			
				<div className="container">
					{/*Entire thing...*/}
					<div className="row m-1 my-5">
						{/*Content for the everything....*/}
						<div className="col m-1">
							<Switch>
								<Route path={this.props.match.url+"/journalWrite"} component={() => <WriteJournals
										
										refreshToken={this.props.refreshToken}
										
										currentDate={this.props.currentDate}
										getValidDates={this.props.getValidDates}
								
										promptList={this.props.journalValidPrompts}
										
										nonJournalPromptsDone={this.props.validNonJournalDates}
										journalPromptsDone={this.props.validJournalDates}
										journalScanPromptsDone={this.props.validJournalScanDates}
										
										currentUser={this.props.currentUser}
										
										debugSet={this.props.debugSet}
									/>} 
								/>
								<Route path={this.props.match.url+"/journalRead"} component={() => <ViewJournals
										currentDate={this.state.selectedJournalDate}
										
										viewJournalData={this.state.viewJournalData}
										viewNonJournalData={this.state.viewNonJournalData}
										
										validNonJournalDates={this.props.validNonJournalDates}
										validJournalDates={this.props.validJournalDates}
										validJournalScanDates={this.props.validJournalScanDates}
										
										pickDate={this.pickJournalCalenderDate}
										
										selectedJournalViewDiv={this.state.selectedJournalViewDiv}
										changeSelectedJournalViewDiv={this.changeSelectedJournalViewDiv}

										journalViewErrors={this.state.journalViewErrors}
										nonJournalViewErrors={this.state.nonJournalViewErrors}
										
										pickJournalCalenderDateStatus={this.state.pickJournalCalenderDateStatus}
										pickNonJournalCalenderDateStatus={this.state.pickNonJournalCalenderDateStatus}
									/>} 
								/>
								<Route path={this.props.match.url+"/writeSuggestion"} component={() => <WriteSuggestion

										userLoadedCompanyList={this.props.userLoadedCompanyList}
										lastRequestStatus={this.props.lastGovernedCompanyRequestStatus}
										
										setSuggestionDivision={this.setSuggestionDivision}
										currentDivisionID={this.state.currentSuggestionDivision}
										
										onChange={this.changeSuggestionContent}
										
										editorState={this.state.suggestionEditorState}
										saveToServer={this.postSuggestion}
										
										suggestionErrors={this.state.suggestionErrors}
										postSuggestionStatus={this.state.postSuggestionStatus}
										
										debugSet={this.props.debugSet}
									/>} 
								/>
								<Route path={this.props.match.url+"/userPermissions"} component={() => <UserProfile
										
										currentUser={this.props.currentUser}
										
										userLoadedCompanyList={this.props.userLoadedCompanyList}
										
										triggerRefresh={this.props.loadCompanyData}
										refreshToken={this.props.refreshToken}
										
										debugSet={this.props.debugSet}
									/>} 
								/>
								<Route path={this.props.match.url+"/userSecurity"} component={() => <UserSecurity
										refreshToken={this.props.refreshToken}
										
										debugSet={this.props.debugSet}
									/>} 
								/>
								<Route path={this.props.match.url+"/userInvite"} component={() => <UserInvite
										triggerRefresh={this.props.loadCompanyData}
										refreshToken={this.props.refreshToken}
										
										debugSet={this.props.debugSet}
									/>} 
								/>
								<Route path={this.props.match.url+"/userWeb"} component={() => <UserWeb
										triggerRefresh={this.props.loadCompanyData}
										refreshToken={this.props.refreshToken}
										validUserWebDates = {this.props.validUserWebDates}
										
										debugSet={this.props.debugSet}
									/>} 
								/>
								<Route path={this.props.match.url+"/userSyncSettings"} component={() => <UserSync
										refreshToken={this.props.refreshToken}
									/>} 
								/>
								<Route path={this.props.match.url+"/userPrompts"} component={() => <UserPrompts
								
										currentUser={this.props.currentUser}
								
										refreshToken={this.props.refreshToken}	
										debugSet={this.props.debugSet}
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