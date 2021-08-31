import React from "react";

import { withRouter, Route, Switch } from "react-router-dom";
//import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import { Alert } from 'react-bootstrap';

//SetCompany
import { UserPages, CompanyPages, Dashboard } from "."

//import { timedLoadStorage } from "../utils";
//import { CompanyPages } from "./companyPages"
//import { UserPages } from "./userPages"
import { APIGetJournalPrompts, APIGetJournalDates, APIGetNonJournalDates, APIGetSuggestionDates, APIGetSuggestionData, APIGetUsersPermTree, APIGetCompanyValidDates, APIGetCompanySummary, APIGetServerEHIData, APIGetDivisionWebDates, APICheckActive } from "../utils";
import { APIGetUserWebDates } from "../utils";

import { APIGetEmailAIData } from "../utils";

//, deleteStorageKey
import { timedLoadStorage, timedSaveStorage} from "../utils";
//convertFromRaw

// This needs to be changed out as this is now in 2 files....
/*const daySet = [
    { name: 'Monday', value: 'mon' },
    { name: 'Tuesday', value: 'tue' },
    { name: 'Wednesday', value: 'wed' },
	{ name: 'Thursday', value: 'thu' },
	{ name: 'Friday', value: 'fri' },
	{ name: 'Saturday', value: 'sat' },
	{ name: 'Sunday', value: 'sun' },
	{ name: 'All', value: 'allDay' },
];
*/

const waitTimeMS = 100

class ContentPages extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			currentDate: new Date(),
			
			// If I put the calender in the sidebar, we shall put this here...
			validJournalDates:[],
			validJournalScanDates: [],
			
			selectedCompanyDate: new Date(),
			selectedSuggestionDate: new Date(),
			
			// EHI Page State...
			EHIData: [],
			
			// Company Summary View Save State
			selectedCompanyDay:"mon",
			selectedCompanyPrompt:"misc",
			selectedCompanyAspect:"emotion",
			
			companyMessage: "Choose a date and company to view that summary!",
			
			// Version 2 of the Company Data Selection
			currentDivisionID:-1,
			currentDivisionName:"None",
			
			// Last data obtained for company summary
			currentCompanyDataName:undefined,
			currentCompanyDataType:undefined,
			selectedSummaryWeekData: {},
			validCompanySummaryDates:[],
			
			// Suggestions!
			selectedSuggestDay: false,
			selectedSuggestDayData: [],
			validDivisionSuggestionDates:[],
			
			validDivisionWebDates: [],
			getDatesWebStatus: 0,
			getDatesWebError: [],
			
			lastGovernedCompanyRequestStatus:undefined,
			
			userLoadedCompanyList: [],
			
			checkActiveUserStatus: 0,
			checkActiveUserError: [],
			
			getJournalDatesStatus: 0,
			getJournalDatesError: [],
			
			getUserCompanyPermsAppStatus: 0,
			getUserCompanyPermsAppError: [],
			
			getCompanyValidDatesStatus: 0,
			getCompanyValidDatesError: [],
			getCompanyValidSuggestionDatesStatus: 0,
			getCompanyValidSuggestionDatesError: [],
			getCompanyEHIDataStatus: 0,
			getCompanyEHIDataError: [],
			
			getCompanySuggestionDataStatus: 0,
			getCompanySuggestionDataError: [],
			getCompanyWeeklySummaryStatus: 0,
			getCompanyWeeklySummaryError: [],
			
			getCompanyDataStatus: true,
			
			journalValidPrompts: [],
			journalPromptsErrors: [],
			getJournalPromptsStatus: 0,
			
			validNonJournalDates: [],
			getNonJournalDatesError: [],
			getNonJournalDatesStatus: 0,
			
			validUserWebDates: {},
			getValidWebDatesStatus: [],
			getValidWebDatesError: 0,
			
			pageIsLoaded: false,
        };
		this.waitForParent = undefined;
	}
	
	// This will run when this component is loaded...
	componentDidMount = () => {
		// On refresh, these will load before App.js has a chance to load in the token...
		
		if ( this.state.currentDivisionID === -1) {
			this.props.changeCompanyMenuItems(-1)
		}
	
		let isLoaded = this.checkParentIsLoaded()
		if (!isLoaded) {	
			// Wait until app.js has loaded....
			this.waitForParent = setInterval(this.checkParentIsLoaded, waitTimeMS)
		}
	}
	
	triggerLogout = () => {
		this.props.logout()
		this.props.history.push(this.props.reRouteSignIn)
	}
	
	clearCompanyData = () => {
		this.setState({
			// Clear EHI Data....
			EHIData: [],
			
			currentCompanyDataName:undefined,
			currentCompanyDataType:undefined,
			selectedSummaryWeekData:{},
			validCompanySummaryDates:[],
			
			selectedSuggestDay: false,
			selectedSuggestDayData: [],
			validDivisionSuggestionDates:[],
		})
	}
	
	checkParentIsLoaded = () => {
		if (this.props.parentHasLoaded) {
			clearInterval(this.waitForParent)
			//console.log("Content page Finished Loading!")
			this.loadData()
			
			return true
		}
		else {
			return false
		}
	}
	
	loadFromLocalStorage = () => {
		let lastDivObject = timedLoadStorage('lastGotCompany');
		
		if (lastDivObject === 0) {
			//console.log("No User In the Storage!")
		}
		else if (lastDivObject === 1) {
			//console.log("Session was expired!")
		}
		else if (lastDivObject === 2) {
			//console.log("Invalid Save!")
		}
		else {
			this.getCompanyDataRequest(lastDivObject)
		}
		
		this.setState({
			pageIsLoaded: true,
		})
	}
	
	loadData = () => {
		//console.log("Triggered Load")
		// Do have this as a check on the server side in everything... A special error
		this.props.changeUserMenuItems(-1)
		this.checkActiveUser()
		// We will wait for this to return true before we continue
	}
	
	loadOtherData = () => {
		this.getJournalPrompts()
		this.getValidJournalDates()
		this.getValidNonJournalDates()
		
		this.getValidWebDates()
		
		this.getUserCompanyPermsApp()
		
		// Check to see if there was a previous load we want...
		this.loadFromLocalStorage()
	}
	
	APIGetEmailAIDataFailure = (responseData) => {
		console.log(responseData)
	}
	APIGetEmailAIDataCallback = (incomingPrompts) => {
		console.log(incomingPrompts)
	}
	APIGetEmailAIData = () => {
		APIGetEmailAIData("ASDF", this.APIGetEmailAIDataCallback, this.APIGetEmailAIDataFailure)
	}
	
	// I should consider rolling this into the other callbacks...
	// All API calls WILL fail if they are not active...
	journalPromptsFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.loadOtherData)
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
		this.setState({
			journalPromptsErrors:returnData,
			getJournalPromptsStatus:3,
		})
	}
	journalPromptsCallback = (incomingPrompts) => {
		// I could define the new Editors here?
		// Or do I just store this shiz into storage?
		// Hm, how much... SHOULD go into storage?
		//console.log(incomingPrompts)
		this.setState({
			journalValidPrompts: incomingPrompts,
			getJournalPromptsStatus:2,
		})
	}
	getJournalPrompts = () => {
		if (!(this.props.currentUser === undefined)) {	
			let checkData = undefined
			if (checkData === undefined) {
				//console.log("Prompts are not in storage!")
				APIGetJournalPrompts( this.journalPromptsCallback, this.journalPromptsFailure)
				this.setState({
					getJournalPromptsStatus:1,
				})
			}
			else {
				console.log("Prompts ARE in storage!")
				//this.journalPromptsCallback(checkData.???, checkData.???)
			}
		}
		else {
			this.triggerLogout()
		}
	}
	
	// There IS a *Isactive* in Django, but that will be used to close accounds due to how its coded
	// But we should check here, and redirect to the Verification page if we fail...
	checkActiveUserFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			console.log("WHY")
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.loadData)
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

		this.setState({
			checkActiveUserStatus: 3,
			checkActiveUserError: returnData,
		})

	}
	checkActiveUserCallback = (ActiveState) => {
		if (ActiveState === true) {
			//console.log("User is considered Active")
			this.props.changeUserMenuItems(0)
			this.setState({
				checkActiveUserStatus: 2,
			})
			// Continue!
			this.loadOtherData()
		}
		else {
			//console.log("User needs to activate account")
			this.props.history.push(this.props.activateRedirect)
		}
	}
	checkActiveUser = () => {
		if (!(this.props.currentUser === undefined)) {	
			APICheckActive(this.checkActiveUserCallback, this.checkActiveUserFailure)
			this.setState({
				checkActiveUserStatus: 1,
			})
		}
		else {
			this.triggerLogout()
		}
	}
	
	getValidWebDatesFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken( this.loadOtherData )
			return
		}
		
		returnData = responseData['messages']
		this.setState({
			getValidWebDatesStatus: 3,
			getValidWebDatesError: returnData,
		})
	}
	getValidWebDatesCallback = (incomingWebDates) => {
		//console.log(incomingWebDates)
		//Store.set(this.props.currentUser+"-ValidDates", {"journalDates":incomingJournalDates ,"AIDates":incomingJournalAIDates})
		// Hmmmmmm, how should I do this?
		
		this.props.changeUserMenuItems(1)
		this.setState({
			validUserWebDates: incomingWebDates,
			getValidWebDatesStatus: 2,
		})
	}
	getValidWebDates = () => {
		
		//console.log("Running a journal dates check")
		
		// Check if the user is a valid one... As this is loaded in App.js
		if (!(this.props.currentUser === undefined)) {		
			// We have to overwrite it if the data is old though...
			let checkData = undefined//Store.get(this.props.currentUser+"-ValidDates")
			if (checkData === undefined) {
				//console.log("Valid journal Dates were not in the cookies!")
				APIGetUserWebDates(this.getValidWebDatesCallback, this.getValidWebDatesFailure)
				this.setState({
					getValidWebDatesStatus: 1,
				})
			}
			else {
				//console.log("Valid Journal dates WERE in the cockies!")
				this.getValidWebDatesCallback(checkData.journalDates, checkData.AIDates)
			}
		}
		else {
			//console.log("Invalid User")
			this.triggerLogout()
		}
	}
	
	journalDatesFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken( this.loadOtherData )
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
		this.setState({
			getJournalDatesStatus: 3,
			getJournalDatesError: returnData,
		})
	}
	// Journal Date Stuff----------------------------------------------------------------------
	journalDatesCallback = (incomingJournalDates, incomingJournalAIDates) => {
		
		//console.log(incomingJournalDates)
		//console.log(incomingJournalAIDates)
		
		//Store.set(this.props.currentUser+"-ValidDates", {"journalDates":incomingJournalDates ,"AIDates":incomingJournalAIDates})
		this.setState({
			validJournalDates: incomingJournalDates,
			validJournalScanDates: incomingJournalAIDates,
			getJournalDatesStatus: 2,
		})
	}
	getValidJournalDates = () => {
		
		//console.log("Running a journal dates check")
		
		// Check if the user is a valid one... As this is loaded in App.js
		if (!(this.props.currentUser === undefined)) {		
			// We have to overwrite it if the data is old though...
			let checkData = undefined//Store.get(this.props.currentUser+"-ValidDates")
			if (checkData === undefined) {
				//console.log("Valid journal Dates were not in the cookies!")
				APIGetJournalDates(this.journalDatesCallback, this.journalDatesFailure)
				this.setState({
					getJournalDatesStatus: 1,
				})
			}
			else {
				//console.log("Valid Journal dates WERE in the cockies!")
				this.journalDatesCallback(checkData.journalDates, checkData.AIDates)
			}
		}
		else {
			//console.log("Invalid User")
			this.triggerLogout()
		}
	}
	
	nonJournalDatesFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken( this.loadOtherData )
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
		this.setState({
			getNonJournalDatesStatus: 3,
			getNonJournalDatesError: returnData,
		})
	}
	// Journal Date Stuff----------------------------------------------------------------------
	nonJournalDatesCallback = (incomingNonJournalDates) => {
		
		//console.log(incomingNonJournalDates)
		
		//Store.set(this.props.currentUser+"-ValidDates", {"journalDates":incomingJournalDates ,"AIDates":incomingJournalAIDates})
		this.setState({
			validNonJournalDates: incomingNonJournalDates,
			getNonJournalDatesStatus: 2,
		})
	}
	getValidNonJournalDates = () => {
		
		// Check if the user is a valid one... As this is loaded in App.js
		if (!(this.props.currentUser === undefined)) {		
			// We have to overwrite it if the data is old though...
			let checkData = undefined//Store.get(this.props.currentUser+"-ValidDates")
			if (checkData === undefined) {
				//console.log("Valid journal Dates were not in the cookies!")
				APIGetNonJournalDates(this.nonJournalDatesCallback, this.nonJournalDatesFailure)
				this.setState({
					getNonJournalDatesStatus: 1,
				})
			}
			else {
				//console.log("Valid Journal dates WERE in the cockies!")
				this.nonJournalDatesCallback(checkData)
			}
		}
		else {
			//console.log("Invalid User")
			this.triggerLogout()
		}
	}
	
	// Company Axios/State stuff---------------------------------------------------------------------
	companyListFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.loadOtherData)
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
		this.setState({
			getUserCompanyPermsAppStatus: 3,
			getUserCompanyPermsAppError: returnData,
		})
	}
	companyListCallback = (incomingCompanyList) => {
		//console.log(incomingCompanyList)
		//Store.set(this.props.currentUser+'-loadedList', incomingCompanyList)
		this.setState({
			userLoadedCompanyList: incomingCompanyList,
			getUserCompanyPermsAppStatus: 2,
		})
		
		// Check to see if the loaded stuff has any admin or viewers in it
		// If the answer is ONLY ONE, auto load the company data...
		// Note to self, I could maybe use this down in te Company pages core...
		let selectableCount = 0
		let selectableIndex = -1
		for (let index in incomingCompanyList) {
			let checkIndex1 = incomingCompanyList[index]["perm"].indexOf(0)
			let checkIndex2 = incomingCompanyList[index]["perm"].indexOf(1)
			if ( checkIndex1 > -1 || checkIndex2 > -1 ) {
				selectableCount += 1
				
				selectableIndex = checkIndex2
				if (checkIndex1 > -1) {
					selectableIndex = checkIndex1
				}
			}
		}

		// Auto trigger a load? This may be bad if the user is not needing the company mode
		// It MAY BE BETTER to put this over into the company pages....
		// Perms can be loaded here... Hm
		if (selectableCount === 1 && selectableCount > -1) {
			this.getCompanyDataRequest( incomingCompanyList[selectableIndex] )
		}
	}
	getUserCompanyPermsApp = (  ) => {
		if (!(this.props.currentUser === undefined)) {	
			// We still have to check for date related reworks...
			let checkData = undefined//Store.get(this.props.currentUser+"-companyPermViewTree")
			let checkData2 = undefined//Store.get(this.props.currentUser+"-companyPermViewNames")
			if (checkData === undefined || checkData2 === undefined) {
				//console.log("Company list was not in the cookies!")
				APIGetUsersPermTree(["admin", "view", 'send', 'gov'], this.companyListCallback, this.companyListFailure)
				this.setState({
					getUserCompanyPermsAppStatus: 1,
				})
			}
			else {
				//console.log("Company Tree WAS in the cookies!")
				this.companyListCallback(checkData, checkData2)
			}
		}
		else {
			this.triggerLogout()
		}
	}
	
	companyDatesFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.getThatData)
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
		this.setState({
			getCompanyValidDatesStatus: 3,
			getCompanyValidDatesError: returnData,
		})
	}
	companyDatesCallback = (incomingDatesObject) => {
		//Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidDates", {'dates':incomingDatesList})
		this.setState({
			validCompanySummaryDates: incomingDatesObject,
			getCompanyValidDatesStatus: 2,
		})
	}
	getCompanyValidDates = () => {
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = undefined//Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidDates")
			if (checkData === undefined) {
				//console.log("Company dates were not in the cookies")
				APIGetCompanyValidDates(this.state.currentDivisionID, this.companyDatesCallback, this.companyDatesFailure)
				this.setState({
					getCompanyValidDatesStatus: 1,
				})
			}
			else {
				//console.log("Company Dates WERE in the coockies!")
				this.companyDatesCallback(checkData["dates"])
			}
		}
		else {
			//console.log("Invalid company!")
		}
	}
	
	companySuggestionDateFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.getThatData)
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
		this.setState({
			getCompanyValidSuggestionDatesStatus: 3,
			getCompanyValidSuggestionDatesError: returnData,
		})
	}
	companySuggestionDateCallback = (incomingDatesList) => {
		//Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidSuggestionDates", {'dates':incomingDatesList})
		
		this.setState({
			validDivisionSuggestionDates: incomingDatesList,
			getCompanyValidSuggestionDatesStatus: 2,
		})
	}
	getCompanyValidSuggestionDates = () => {
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = undefined//Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidSuggestionDates")
			if (checkData === undefined) {
				//console.log("Division suggestion dates were not in the cookies...")
				APIGetSuggestionDates(this.state.currentDivisionID, this.companySuggestionDateCallback, this.companySuggestionDateFailure)
				this.setState({
					getCompanyValidSuggestionDatesStatus: 1,
				})
			}
			else {
				//console.log("Division suggestion dates WERE in the coockies!")
				this.companySuggestionDateCallback(checkData["dates"])
			}
		}
		else {
			//console.log("Invalid company!")
		}
	}
	
	companySuggestionDataFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.tokenHasRefreshed)
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
			getCompanySuggestionDataStatus: 3,
			getCompanySuggestionDataError: returnData,
		})
	}
	companySuggestionDataCallback = (targetDate, incomingData) => {
		//Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+targetDate+"-suggestions", {'data':incomingData})
		//console.log(incomingData)
		let givenDate = new Date(targetDate)
		this.setState({
			selectedSuggestDay: givenDate,
			selectedSuggestDayData: incomingData,
			getCompanySuggestionDataStatus: 2,
		})
	}
	getCompanySuggestionData = (selectedDate) => {
		
		if (!(this.state.currentDivisionID === -1)) {
			
			this.setState({
				getCompanySuggestionData:selectedDate,
			})
			
			let checkData = undefined//Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+selectedDate+"-suggestions")
			if (checkData === undefined) {
				//console.log("Division suggestion data was not in the cookies")
				APIGetSuggestionData(this.state.currentDivisionID, selectedDate, this.companySuggestionDataCallback, this.companySuggestionDataFailure)
				this.setState({
					getCompanySuggestionDataStatus: 1,
				})
			}
			else {
				//console.log("Division suggestion dates WERE in the coockies!")
				//this.companySuggestionDataCallback()
			}
		}
		else {
			//console.log("Invalid company!")
			this.setState({
				
			})
		}
	}
	
	companyDataFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.tokenHasRefreshed)
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
			getCompanyWeeklySummaryStatus: 3,
			getCompanyWeeklySummaryError: returnData,
		})
	}
	companyDataCallback = (incomingDataDict, summaryType) => {
		
		//Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+anchorDate+"Data", {'data':incomingDataDict})
		this.setState({

			companyMessage: "Showing Summary for: " + this.state.currentDivisionID + " On: " + this.state.selectedCompanyDate.toString(),
			selectedSummaryWeekData: incomingDataDict,
			currentCompanyDataType: summaryType,
			currentCompanyDataName: this.state.currentDivisionName,
			currentCompanyDataID: this.state.currentDivisionID,

			getCompanyWeeklySummaryStatus: 2,
		})
	}
	getCompanyWeeklySummary = (selectedDate) => {
		
		let summaryType = 0
		
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = undefined//Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+anchorDate+"Data")
			if (checkData === undefined) {
				//console.log("Company Summary Data was not in the coockies")
				APIGetCompanySummary(this.state.currentDivisionID, summaryType, selectedDate, this.companyDataCallback, this.companyDataFailure)
				this.setState({
					getCompanyWeeklySummaryStatus: 1,
					
					selectedCompanyDate:selectedDate,
			
					currentCompanyDataName:undefined,
					currentCompanyDataType:undefined,
					selectedSummaryWeekData:{},
				})
			}
			else {
				this.companyDataCallback(checkData["data"], summaryType)
			}
		}
		else {
			//console.log("Invalid company!")
		}
	}
	
	tokenHasRefreshed = () => {
		console.log("Tell the user to redo that!")
	}
	
	companyEHIFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.getThatData)
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
		this.setState({
			getCompanyEHIDataStatus: 3,
			getCompanyEHIDataError: returnData,
		})
	}
	companyEHICallback = (incomingEHIData) => {
		//Store.set(this.props.currentUser+'-'+this.state.currentDivisionID+'-EHI', {'labelsDays':incomingEHIDaysLabels, 'dataDays':incomingEHIDaysData, 'labelsWeeks':incomingEHIWeeksLabels, 'dataWeeks':incomingEHIWeeksData})
		this.setState({
			EHIData: incomingEHIData,
			getCompanyEHIDataStatus: 2,
		})
	}
	// EHI Stuff
	getCompanyEHIData = () => {
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = undefined//Store.get(this.props.currentUser+'-'+this.state.currentDivisionID+'-EHI')
			// How am I going to check for redos?
			if (checkData === undefined) {
				//console.log("Company EHI Data was not in the coockies")
				APIGetServerEHIData(this.state.currentDivisionID, this.companyEHICallback, this.companyEHIFailure)
				this.setState({
					getCompanyEHIDataStatus: 1,
				})
			}
			else {
				this.companyEHICallback(checkData["labelsDays"], checkData["dataDays"], checkData["labelsWeeks"], checkData["dataWeeks"])
			}
		}
		else {
			//console.log("Invalid company!")
		}
	}
	
	// Move this up? Move it down? Think of a way to resort this!
	getDivisionWebDatesFailure = (incomingError) => {
		
		if (incomingError['action'] ===	 0) {
			//Network Error
		}
		else if (incomingError['action'] === 1) {
			//Unauthorized
			this.props.refreshToken(this.getDivisionWebDates)
			return
		}
		else if (incomingError['action'] === 3) {
			// Obtain error!
		}
		
		this.setState({
			getDatesWebStatus: 3,
			getDatesWebError: incomingError["messages"],
		})
	}
	getDivisionWebDatesCallback = (incomingDates) => {
		//console.log(incomingWeb)
		
		this.props.changeCompanyMenuItems(1)
		
		this.setState({
			validDivisionWebDates: incomingDates,
			getDatesWebStatus: 2,
		})
	}
	getDivisionWebDates = () => {
		if (!(this.props.currentDivisionID === -1)) {
			let checkData = undefined
			if (checkData === undefined) {
				
				APIGetDivisionWebDates( this.state.currentDivisionID, this.getDivisionWebDatesCallback, this.getDivisionWebDatesFailure)
				this.setState({
					getDatesWebStatus: 1,
				})
			}
			else {
				//this.getDivisionWebDatesCallback(???)
			}
		}
		else {
			this.props.history.push(this.props.reRouteTarget)
		}
	}
	
	getThatData = () => {
		//console.log(this.state.currentDivisionID)
		// Clear ALL THE DATA from the last company we had set....
		this.clearCompanyData()
		
		this.getCompanyEHIData()
		this.getCompanyValidDates()
		this.getCompanyValidSuggestionDates()
		this.getDivisionWebDates()
	}
	getCompanyDataRequest = (divisionObj) => {
		this.props.changeCompanyMenuItems(-1)
		
		// SANITY CHECK! If I somehow break this and send one that isnt an admin/viewer
		let adminCheck = divisionObj.perm.indexOf(0) > -1 
		let viewerCheck = divisionObj.perm.indexOf(1) > -1
		if (adminCheck) {
			this.props.changeCompanyMenuItems(0)
			this.props.changeCompanyMenuItems(2)
		}
		else if (viewerCheck) {
			this.props.changeCompanyMenuItems(0)
		}
		
		timedSaveStorage( "lastGotCompany", divisionObj, 1)
		
		// So, if this triggers, the menu will be in the proper mode for that....
		if (adminCheck || viewerCheck) {

			this.setState({
				currentDivisionName: divisionObj.name,
				currentDivisionID: divisionObj.id,
				currentDivisionPerms: divisionObj.perm,
			}, this.getThatData )
			
			this.props.changeMenuCompanyName(divisionObj.name)
		}
		else {
			//console.log("Not allowed!")
			this.setState({
				getCompanyDataStatus:false
			})
		}
	}
	
	// Viewing a Company's journal Prompt and Data
	changeCompanyPrompt = (event) => {
		this.setState({
			selectedCompanyPrompt:event.currentTarget.value
		})
	}
	changeCompanyAspect = (event) => {
		this.setState({
			selectedCompanyAspect:event.currentTarget.value
		})
	}
	changeCompanyDay = (event) => {
		this.setState({
			selectedCompanyDay:event.currentTarget.value
		});
	}
	
	// Rendering this with Bootstrap React.... To see if there is anything really interesting I can do with it
	// So far it doesnt look all that different 
	render() {
		
		let showWaiting = this.state.getJournalPromptsStatus === 1 || this.state.checkActiveUserStatus === 1 || this.state.getJournalDatesStatus === 1 || this.state.getUserCompanyPermsAppStatus === 1
		
		return (
			<div className="contentPages">
			
				<div className="container-fluid">

					<Switch>
						<Route path={this.props.match.url} exact component={() => <Dashboard
								toUserPage={this.props.match.url+"/userMode/journalWrite"}
								toCompanyPage={this.props.match.url+"/companyMode/companySelect"}

								userLoadedCompanyList={this.state.userLoadedCompanyList}
							/>} 
						/>
						<Route path={this.props.match.url+"/userMode"} component={() => <UserPages

								reRouteUser={this.props.reRouteUser}

								currentDate={this.state.currentDate}
								
								refreshToken={this.props.refreshToken}
								currentUser={this.props.currentUser}
								
								loadCompanyData={this.loadOtherData}
								validUserWebDates = {this.state.validUserWebDates}
								
								validNonJournalDates={this.state.validNonJournalDates}
								validJournalDates={this.state.validJournalDates}
								validJournalScanDates={this.state.validJournalScanDates}
										
								lastGovernedCompanyRequestStatus={this.state.lastGovernedCompanyRequestStatus}
								
								disableMenu={this.props.disableMenu}
								activateUserMenu={this.props.activateUserMenu}
								
								userLoadedCompanyList={this.state.userLoadedCompanyList}
								
								journalValidPrompts={this.state.journalValidPrompts}
								journalPromptsErrors={this.state.journalPromptsErrors}
							/>} 
						/>
						<Route path={this.props.match.url+"/companyMode"} component={() => <CompanyPages
								
								refreshToken={this.props.refreshToken}
								parentHasLoaded={this.state.pageIsLoaded}
								
								reRouteCompany={this.props.reRouteCompany}
								userLoadedCompanyList={this.state.userLoadedCompanyList}
								resetCompanySelectStatus={this.resetCompanySelectStatus}
								
								currentDate={this.state.currentDate}
						
								currentDivisionName={this.state.currentDivisionName}
								getCompanyDataRequest={this.getCompanyDataRequest}
								
								currentDivisionID={this.state.currentDivisionID}
										
								selectedCompanyDate={this.state.selectedCompanyDate}
										
								validDivisionWebDates = {this.state.validDivisionWebDates}
								
								validDivisionSuggestionDates={this.state.validDivisionSuggestionDates}
								
								selectedSuggestDay={this.state.selectedSuggestDay}
								selectedSuggestDayData={this.state.selectedSuggestDayData}
								getCompanySuggestionData={this.getCompanySuggestionData}
								
								EHIData={this.state.EHIData}
									
								currentCompanyDataName={this.state.currentCompanyDataName}
								currentCompanyDataType={this.state.currentCompanyDataType}
								
								validCompanySummaryDates={this.state.validCompanySummaryDates}

								companyMessage={this.state.companyMessage}
								selectedSummaryWeekData={this.state.selectedSummaryWeekData}
								selectedCompanyDay={this.state.selectedCompanyDay}
								selectedCompanyPrompt={this.state.selectedCompanyPrompt}
								selectedCompanyAspect={this.state.selectedCompanyAspect}
								
								changeCompanyPrompt={this.changeCompanyPrompt}
								changeCompanyAspect={this.changeCompanyAspect}
								changeCompanyDay={this.changeCompanyDay}
								changeSelectedCompany={this.changeSelectedCompany}
								
								getCompanyValidDates={this.getCompanyValidDates}
								getCompanyWeeklySummary={this.getCompanyWeeklySummary}
								
								loadCompanyData={this.loadFromLocalStorage}
								
								disableMenu={this.props.disableMenu}
								activateCompanyMenu={this.props.activateCompanyMenu}
								
								getCompanyDataStatus={this.state.getCompanyDataStatus}
								getCompanyValidDatesStatus={this.state.getCompanyValidDatesStatus}
								getCompanyValidDatesError={this.state.getCompanyValidDatesError}
								
								getCompanyValidSuggestionDatesStatus={this.state.getCompanyValidSuggestionDatesStatus}
								getCompanyValidSuggestionDatesError={this.state.getCompanyValidSuggestionDatesError}
								
								getCompanyEHIDataStatus={this.state.getCompanyEHIDataStatus}
								getCompanyEHIDataError={this.state.getCompanyEHIDataError}
								
								getCompanySuggestionDataStatus={this.state.getCompanySuggestionDataStatus}
								getCompanySuggestionDataError={this.state.getCompanySuggestionDataError}
								
								getCompanyWeeklySummaryStatus={this.state.getCompanyWeeklySummaryStatus}
								getCompanyWeeklySummaryError={this.state.getCompanyWeeklySummaryError}
								
								getDatesWebStatus={this.state.getDatesWebStatus}
								getDatesWebError={this.state.getDatesWebError}
							/>} 
						/>
					</Switch>
					
					<div className="container">
						<div className="row">
							<div className="col">
								{/*Perhaps I should move forward with moving this to its own component?*/}
								<Alert show={showWaiting} variant="warning">
									<Alert.Heading>Waiting</Alert.Heading>
									<hr />
									<p>
									  Waiting for server...
									</p>
									<hr />
								</Alert>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		);
	}
}

export default withRouter(ContentPages);