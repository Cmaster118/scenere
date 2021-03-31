import React from "react";

import { withRouter, Link, Route, Switch } from "react-router-dom";
//import { ButtonGroup, ToggleButton } from 'react-bootstrap';

import Store from "store"

//SetCompany
import {UserProfile, ViewJournals, WriteJournals, WriteSuggestion} from "./userPages"
import {CompanySettings, SelectCompany, ViewCompany, EHIDisplay, SuggestionBox} from "./companyPages"
import {APISaveSuggestion, APIGetJournalDates, APIGetJournalData, APIGetSuggestionDates, APIGetSuggestionData, APIGetUsersPermTree, APIGetCompanyValidDates, APIGetCompanySummary, APIGetServerEHIData, APISaveJournal, APICheckActive} from "../utils";

import { EditorState, convertToRaw,  } from 'draft-js';
//convertFromRaw

const DefaultView = (props) => {

	return (
		<div className="defaultView">
			<h3>
				This page is empty, Select an Action from the side menu!
			</h3>
		</div>
	)
}

// This needs to be changed out as this is now in 2 files....
const daySet = [
    { name: 'Monday', value: 'mon' },
    { name: 'Tuesday', value: 'tue' },
    { name: 'Wednesday', value: 'wed' },
	{ name: 'Thursday', value: 'thu' },
	{ name: 'Friday', value: 'fri' },
	{ name: 'Saturday', value: 'sat' },
	{ name: 'Sunday', value: 'sun' },
	{ name: 'All', value: 'allDay' },
];

class ContentPages extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			currentDate: new Date(),
			selectedJournalDate: new Date(),
			selectedCompanyDate: new Date(),
			selectedSuggestionDate: new Date(),
			
			// EHI Page State...
			EHIDayTimespan: 3,
			EHIWeekTimespan: 3,
			
			EHIDayLabels: [],
			EHIDaySet: [],
			EHIWeekLabels: [],
			EHIWeekSet: [],
			
			// Journal Read Page State...
			selectedJournalPrompt:"p1",
			selectedJournalAspect:"emotion",
			
			// Where we storing the data from...
			selectedJournalData: {},
			// If I put the calender in the sidebar, we shall put this here...
			validJournalDates:[],
			validJournalScanDates: [],
			
			journalMessage: "Choose a date to view the journal!",
			journalContent: "Waiting for content...",
			
			// I need to put the content block stuff.......
			journalEditorState: EditorState.createEmpty(),
			journalPlaceholder: "",
			
			// Company Summary View Save State
			selectedCompanyDay:"mon",
			selectedCompanyPrompt:"p1",
			selectedCompanyAspect:"emotion",
			
			companyMessage: "Choose a date and company to view that summary!",
			
			// Version 2 of the Company Data Selection
			currentDivisionID:-1,
			currentDivisionName:"None",
			currentCompanyIndexes:[],
			companyViewableDataTree:{},
			companyViewableDataRawList:[],
			companyViewableDataRawIDs:[],
			
			companySendDataTree: {},
			companySendDataRawList: [],
			companySendDataRawIDList: [],
			// Use a state hook for this? Hmmmm,
			lastCompanyRequestStatus:undefined,
			
			// Last data obtained for company summary
			currentCompanyDataName:undefined,
			currentCompanyDataDate:undefined,
			selectedSummaryWeekData: {mon:{},tue:{},wed:{},thu:{},fri:{},sat:{},sun:{},allDay:{}},
			validCompanySummaryDates:[],
			
			// Suggestions!
			selectedSuggestDay: new Date(),
			selectedSuggestDayData: [],
			validDivisionSuggestionDates:[],
			
			currentSuggestionDivision: -1,
			currentCompanyGovernedIndexes: [],
			companyGovernedDataTree: {},
			companyGovernedDataRawList: [],
			companyGovernedDataRawIDList: [],
			lastGovernedCompanyRequestStatus:undefined,
			suggestionEditorState: EditorState.createEmpty()
			
			
        };
	}
	
	// This will run when this component is loaded...
	componentDidMount = () => {
		
		// On refresh, these will load before App.js has a chance to load in the token...
		if (this.props.authToken === undefined) {
			console.log("No auth token on load!")
		}
		this.checkActiveUser()
		
		this.getValidJournalDates()
		this.getUserCompanyAdminViewTree()
		this.getUserGovernedPermTree()
		
		//this.redoLoad()
	}
	
	componentDidUpdate = (prevProps, prevState) => {
		// When we SWAP TO the Journal Read menu...\
	}
	
	flushStorage = () => {
		Store.remove(this.props.currentUser+"-ValidDates")
		Store.remove(this.props.currentUser+'-companyPermViewTree')
		Store.remove(this.props.currentUser+'-companyPermViewNames')
		Store.remove(this.props.currentUser+'-'+this.state.currentDivisionID+'-ValidDates')
		Store.remove(this.props.currentUser+'-'+this.state.currentDivisionID+'-EHI')
		Store.remove(this.props.currentUser+'-'+this.state.currentDivisionID+'-suggestionDates')
	}
	
	resetState = () => {
		this.setState({
			// Clear EHI Data....
			EHIDayLabels: [],
			EHIDaySet: [],
			EHIWeekLabels: [],
			EHIWeekSet: [],
			
			// Clear All Dates...
			validCompanySummaryDates:[],
			
			// Clear Tree Data...
			companyGovernedDataTree: {},
			companyGovernedDataRawList: [],
			companyGovernedDataRawIDList: [],
			
			companyViewableDataTree: {},
			companyViewableDataRawList: {},
			companyViewableDataRawIDs:[],
			
			companySendDataTree: {},
			companySendDataRawList: {},
			companySendDataRawIDList: [],
			
			// Clear summary data...
			validDivisionSuggestionDates:[],
			
			// Clear Journal Data
			selectedJournalData: {},
			validJournalDates:[],
			validJournalScanDates: [],
			
		})
	}
	
	redoLoad = () => {
		this.getValidJournalDates()
		this.getUserCompanyAdminViewTree()
		this.getUserCompanySendsTree()
		this.getUserGovernedPermTree()
	}
	
	changeSuggestionContent = (incomingState) => {
		this.setState({
			suggestionEditorState:incomingState,
		})	
	}
	changeJournalContent = (incomingState) => {
		this.setState({
			journalEditorState:incomingState,
		})	
	}
	
	// This has to be here due to Props being non-writable...
	changeEHIDaydates = (dateRangeChoice) => {
		this.setState({
			EHIDayTimespan:dateRangeChoice
		})
	}
	changeEHIWeekdates = (dateRangeChoice) => {
		this.setState({
			EHIWeekTimespan:dateRangeChoice
		})
	}
	
	forceLogout = () => {
		// Gonna do this like this, in case we got something else we wana do on logout...
		this.props.forceLogout()
		this.props.history.push(this.props.reRouteTarget);
	}
	
	// I should consider rolling this into the other callbacks...
	// All API calls WILL fail if they are not active...
	
	// There IS a *Isactive* in Django, but that will be used to close accounds due to how its coded
	// But we should check here, and redirect to the Verification page if we fail...
	checkActiveUserCallback = (ActiveState) => {
		if (ActiveState === true) {
			console.log("User is considered Active")
		}
		else {
			console.log("User needs to activate account")
			this.props.history.push(this.props.activateRedirect)
		}
	}
	checkActiveUser = () => {
		//console.log(this.props.authToken)
		APICheckActive(this.props.APIHost, this.props.authToken, this.checkActiveUserCallback, this.forceLogout)
	}
	
	journalPostCallback = (incomingStuff) => {
		// Set something to notify user....
		console.log(incomingStuff)
	}
	postJournal = () => {
		// This may need to be overridden?
		let inputDate = this.state.currentDate
		let journalContent = this.state.journalEditorState.getCurrentContent().getPlainText()
		let richContent = convertToRaw(this.state.journalEditorState.getCurrentContent())
		
		APISaveJournal(this.props.APIHost, this.props.authToken, inputDate, journalContent, richContent, this.journalPostCallback, this.forceLogout)
	}
	
	// getting the data for which companies you are allowed to post to...
	governedPermTreeCallback = (incomingCompanyTree, incomingCompanyNames, incomingCompanyIDs) => {
		
		//Store.set(this.props.currentUser+'-companyPermGovernedTree', incomingCompanyTree)
		//Store.set(this.props.currentUser+'-companyPermGovernedNames', incomingCompanyNames)
		//Store.set(this.props.currentUser+'-companyPermGovernedNames', incomingCompanyIDs)
		this.setState({
			companyGovernedDataTree: incomingCompanyTree,
			companyGovernedDataRawList: incomingCompanyNames,
			companyGovernedDataRawIDList: incomingCompanyIDs,
		})
		//console.log(incomingStuff)
	}
	governedPermTreeFailure = (errorCodes, errorDatas) => {
		
		for (let index in errorCodes) {
				
			if (errorCodes[index] === 401) {
				this.forceLogout()
			}
		}
	}
	getUserGovernedPermTree = () => {
		if (!(this.props.currentUser === undefined)) {	
			// We still have to check for date related reworks...
			// It may be benificial to merge this into the other perm tree...
			// But for now I will keep them seperate....
			let checkData = Store.get(this.props.currentUser+"-companyGovernedPermTree")
			let checkData2 = Store.get(this.props.currentUser+"-companyPermGovernedNames")
			let checkData3 = Store.get(this.props.currentUser+"-incomingCompanyIDs")
			if (checkData === undefined || checkData2 === undefined || checkData3 === undefined) {
				console.log("Governed list was not in the cookies!")
				APIGetUsersPermTree(this.props.APIHost, this.props.authToken, ["gov"], this.governedPermTreeCallback, this.governedPermTreeFailure)
			}
			else {
				console.log("Company Tree WAS in the cookies!")
				this.governedPermTreeCallback(checkData, checkData2, checkData3)
			}
		}
	}
	
	// Posting the journal
	suggestionPostCallback = (incomingStuff) => {
		// Set something to notify user....
		console.log(incomingStuff)
	}
	postSuggestion = () => {
		// This may need to be overridden?
		let inputDate = this.state.currentDate
		let suggestionContent = this.state.suggestionEditorState.getCurrentContent().getPlainText()
		let richContent = convertToRaw(this.state.suggestionEditorState.getCurrentContent())
		let targetDivision = this.state.currentSuggestionDivision
		
		if (!(targetDivision === -1)) {
			APISaveSuggestion(this.props.APIHost, this.props.authToken, inputDate, targetDivision, suggestionContent, richContent, this.suggestionPostCallback, this.forceLogout)
		}
		else {
			console.log("Not allowed!")
		}
	}
	
	// Journal Date Stuff----------------------------------------------------------------------
	journalDatesCallback = (incomingJournalDates, incomingJournalAIDates) => {
		
		Store.set(this.props.currentUser+"-ValidDates", {"journalDates":incomingJournalDates ,"AIDates":incomingJournalAIDates})
		this.setState({
			validJournalDates: incomingJournalDates,
			validJournalScanDates: incomingJournalAIDates,
		})
	}
	getValidJournalDates = () => {
		// Check the values...
		//this.state.validJournalDates
		//this.state.validJournalScanDates
		
		console.log("Running a journal dates check")
		
		// Check if the user is a valid one... As this is loaded in App.js
		if (!(this.props.currentUser === undefined)) {		
			// We have to overwrite it if the data is old though...
			let checkData = Store.get(this.props.currentUser+"-ValidDates")
			if (checkData === undefined) {
				console.log("Valid journal Dates were not in the cookies!")
				APIGetJournalDates(this.props.APIHost, this.props.authToken, this.journalDatesCallback, this.forceLogout)
			}
			else {
				console.log("Valid Journal dates WERE in the cockies!")
				this.journalDatesCallback(checkData.journalDates, checkData.AIDates)
			}
		}
		else {
			console.log("Invalid User")
			//this.forceLogout()
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
		let checkData = Store.get(this.props.currentUser+"-Journal-"+selectedDate)
		if (checkData === undefined) {
			console.log("Not in the cookies!")
			APIGetJournalData(this.props.APIHost, this.props.authToken, selectedDate, this.journalDataCallback, this.forceLogout)
		}
		else {
			//this.journalDataCallback(checkData.journalContent, checkData.AIData)
		}
	}
	
	// Company Axios/State stuff---------------------------------------------------------------------
	companyListCallback = (incomingCompanyTree, incomingCompanyNames, incomingCompanyIDs) => {

		//Store.set(this.props.currentUser+'-companyPermViewTree', incomingCompanyTree)
		//Store.set(this.props.currentUser+'-companyPermViewNames', incomingCompanyNames)
		//Store.set(this.props.currentUser+'-companyPermViewIDs', incomingCompanyIDs)
		this.setState({
			companyViewableDataTree: incomingCompanyTree,
			companyViewableDataRawList: incomingCompanyNames,
			companyViewableDataRawIDs: incomingCompanyIDs,
		})
	}
	companyListFailure = (errorCodes, errorDatas) => {
		
		for (let index in errorCodes) {
				
			if (errorCodes[index] === 401) {
				this.forceLogout()
			}
		}
	}
	getUserCompanyAdminViewTree = () => {
		if (!(this.props.currentUser === undefined)) {	
			// We still have to check for date related reworks...
			let checkData = Store.get(this.props.currentUser+"-companyPermViewTree")
			let checkData2 = Store.get(this.props.currentUser+"-companyPermViewNames")
			if (checkData === undefined || checkData2 === undefined) {
				console.log("Company list was not in the cookies!")
				APIGetUsersPermTree(this.props.APIHost, this.props.authToken, ["admin", "view"], this.companyListCallback, this.companyListFailure)
			}
			else {
				console.log("Company Tree WAS in the cookies!")
				this.companyListCallback(checkData, checkData2)
			}
		}
	}
	
	companySendCallback = (incomingCompanyTree, incomingCompanyNames, incomingCompanyIDs) => {

		//Store.set(this.props.currentUser+'-companyPermSendTree', incomingCompanyTree)
		//Store.set(this.props.currentUser+'-companyPermSendNames', incomingCompanyNames)
		//Store.set(this.props.currentUser+'-companyPermSendIDs', incomingCompanyIDs)
		this.setState({
			companySendDataTree: incomingCompanyTree,
			companySendDataRawList: incomingCompanyNames,
			companySendDataRawIDList: incomingCompanyIDs,
		})
	}
	companySendFailure = (errorCodes, errorDatas) => {
		
		for (let index in errorCodes) {
				
			if (errorCodes[index] === 401) {
				this.forceLogout()
			}
		}
	}
	getUserCompanySendsTree = () => {
		if (!(this.props.currentUser === undefined)) {	
			// We still have to check for date related reworks...
			let checkData = Store.get(this.props.currentUser+"-companyPermSendTree")
			let checkData2 = Store.get(this.props.currentUser+"-companyPermSendNames")
			let checkData3 = Store.get(this.props.currentUser+"-companyPermSendIDs")
			if (checkData === undefined || checkData2 === undefined || checkData3 === undefined) {
				console.log("Company list was not in the cookies!")
				APIGetUsersPermTree(this.props.APIHost, this.props.authToken, ["send"], this.companySendCallback, this.companySendFailure)
			}
			else {
				console.log("Company Tree WAS in the cookies!")
				this.companyListCallback(checkData, checkData2)
			}
		}
	}
	
	companyDatesCallback = (incomingDatesList) => {
		//console.log(this.state.validCompanySummaryDates)
		Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidDates", {'dates':incomingDatesList})
		this.setState({
			validCompanySummaryDates: incomingDatesList
		})
	}
	getCompanyValidDates = () => {
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidDates")
			if (checkData === undefined) {
				console.log("Company dates were not in the cookies")
				APIGetCompanyValidDates(this.props.APIHost, this.props.authToken, this.state.currentDivisionID, this.companyDatesCallback, this.forceLogout)
			}
			else {
				console.log("Company Dates WERE in the coockies!")
				this.companyDatesCallback(checkData["dates"])
			}
		}
		else {
			console.log("Invalid company!")
		}
	}
	
	companySuggestionDateCallback = (incomingDatesList) => {
		Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidSuggestionDates", {'dates':incomingDatesList})
		
		//console.log(incomingDatesList)
		this.setState({
			validDivisionSuggestionDates: incomingDatesList
		})
	}
	getCompanyValidSuggestionDates = () => {
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidSuggestionDates")
			if (checkData === undefined) {
				console.log("Division suggestion dates were not in the cookies...")
				APIGetSuggestionDates(this.props.APIHost, this.props.authToken, this.state.currentDivisionID, this.companySuggestionDateCallback, this.forceLogout)
			}
			else {
				console.log("Division suggestion dates WERE in the coockies!")
				this.companySuggestionDateCallback(checkData["dates"])
			}
		}
		else {
			console.log("Invalid company!")
		}
	}
	
	companySuggestionDataCallback = (targetDate, incomingData) => {
		//Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+targetDate+"-suggestions", {'data':incomingData})
		
		let givenDate = new Date(targetDate)
		this.setState({
			selectedSuggestDay: givenDate,
			selectedSuggestDayData: incomingData,
		})
	}
	getCompanySuggestionData = (selectedDate) => {
		
		this.setState({
			getCompanySuggestionData:selectedDate,
		})
		
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+selectedDate+"-suggestions")
			if (checkData === undefined) {
				console.log("Division suggestion dates were not in the cookies")
				APIGetSuggestionData(this.props.APIHost, this.props.authToken, this.state.currentDivisionID, this.companySuggestionDataCallback, this.forceLogout)
			}
			else {
				console.log("Division suggestion dates WERE in the coockies!")
				this.companySuggestionDataCallback()
			}
		}
		else {
			console.log("Invalid company!")
		}
	}
	
	companyDataCallback = (incomingDataDict, anchorDate) => {
		Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+anchorDate+"Data", {'data':incomingDataDict})
		this.setState({
			companyMessage: "Showing Summary for: " + this.state.currentDivisionID + " On: " + this.state.selectedCompanyDate.toString(),
			selectedSummaryWeekData: incomingDataDict,
			currentCompanyDataDate: anchorDate,
			currentCompanyDataName: this.state.currentDivisionName,
			currentCompanyDataID: this.state.currentDivisionID,
		})
	}
	getCompanyWeeklySummary = (selectedDate) => {
		// First, we need to check if we clicked in the same week as our currently loaded data...
		let todayWeekday = (selectedDate.getDay()-1)
		if (todayWeekday < 0) {
			todayWeekday = 6
		}
		
		let copiedDate = new Date(selectedDate.getTime());

		copiedDate.setDate(copiedDate.getDate()-(todayWeekday))
		const anchorDate = copiedDate.toJSON().split("T")[0]
		
		// if we DID, all we need to do is swap the day we are doing...
		if (this.state.currentCompanyDataID === this.state.currentDivisionID && this.state.currentCompanyDataDate === anchorDate) {
			this.setState({
				selectedCompanyDay: daySet[todayWeekday].value,
				selectedCompanyDate:selectedDate
			})
		}
		// if NOT, then we go get the data, as it is NOT loaded...
		else {
			if (!(this.state.currentDivisionID === -1)) {
				let checkData = Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+anchorDate+"Data")
				if (checkData === undefined) {
					console.log("Company Summary Data was not in the coockies")
					APIGetCompanySummary(this.props.APIHost, this.props.authToken, this.state.currentDivisionID, selectedDate, this.companyDataCallback, this.forceLogout)
				}
				else {
					this.companyDataCallback(checkData["data"], anchorDate)
				}
			}
			else {
				console.log("Invalid company!")
			}
		}
	}
	
	companyEHICallback = (incomingEHIDaysLabels, incomingEHIDaysData, incomingEHIWeeksLabels, incomingEHIWeeksData) => {
		Store.set(this.props.currentUser+'-'+this.state.currentDivisionID+'-EHI', {'labelsDays':incomingEHIDaysLabels, 'dataDays':incomingEHIDaysData, 'labelsWeeks':incomingEHIWeeksLabels, 'dataWeeks':incomingEHIWeeksData})
		this.setState({
			EHIDayLabels: incomingEHIDaysLabels,
			EHIDaySet: incomingEHIDaysData,
			EHIWeekLabels: incomingEHIWeeksLabels,
			EHIWeekSet: incomingEHIWeeksData,
		})
	}
	// EHI Stuff
	getCompanyEHIData = () => {
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = Store.get(this.props.currentUser+'-'+this.state.currentDivisionID+'-EHI')
			// How am I going to check for redos?
			if (checkData === undefined) {
				console.log("Company EHI Data was not in the coockies")
				APIGetServerEHIData(this.props.APIHost, this.props.authToken, this.state.currentDivisionID, this.companyEHICallback, this.forceLogout)
			}
			else {
				this.companyEHICallback(checkData["labelsDays"], checkData["dataDays"], checkData["labelsWeeks"], checkData["dataWeeks"])
			}
		}
		else {
			console.log("Invalid company!")
		}
	}
	
	suggestionDataCallback = (selectedDay, incomingDataDict) => {
		this.setState({
			selectedSuggestDay: selectedDay,
			selectedSuggestDayData: incomingDataDict,
		})
	}
	getCompanySuggestionData = (selectedDate) => {
		if (!(this.state.currentDivisionID === -1)) {
			APIGetSuggestionData(this.props.APIHost, this.props.authToken, this.state.currentDivisionID, selectedDate, this.suggestionDataCallback, this.forceLogout)
		}
	}
	
	// For V2 of the Company Choosing...
	selectCompanyLayer = (event) => {
		let values = this.state.currentCompanyIndexes
		values.push(event.target.value)
		
		this.setState({
			currentCompanyIndexes:values,
			lastCompanyRequestStatus:undefined,
		})
	}
	backCompanyLayer = (event) => {
		let values = this.state.currentCompanyIndexes
		values.splice(event.target.value)
		
		this.setState({
			currentCompanyIndexes:values,
			lastCompanyRequestStatus:undefined,
		})
	}
	
	// Meanwhile, over in the suggestion selector...
	selectGovernedCompanyLayer = (event) => {
		let values = this.state.currentCompanyGovernedIndexes
		values.push(event.target.value)
		
		let newDivision = values[ values.length-1 ]
		//console.log(newDivision)
		
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
	
	getThatData = () => {
		console.log(this.state.currentDivisionID)
		this.getCompanyEHIData()
		this.getCompanyValidDates()
		this.getCompanyValidSuggestionDates()
	}
	getCompanyDataRequest = (event) => {
		// Going to have to define permission styles...
		let splitUp = event.target.value.split(",")
		let permCheck = ( Number(splitUp[0]) > 0)
		if (permCheck) {
			// Hm, combine this with the one down there perhaps....
			this.setState({
				currentDivisionName: splitUp[1],
				currentDivisionID: splitUp[2],
				lastCompanyRequestStatus:permCheck,
			}, this.getThatData )
		}
		else {
			console.log("Not allowed!")
			this.setState({
				lastCompanyRequestStatus:permCheck
			})
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
									<div className="card">
										<div className="card-header">
											<h5>Today's Date</h5>
										</div>
										<div className="card-body">
											{this.state.currentDate.toString().split("(")[0]}
										</div>
									</div>
								</div>
							</div>
							
							{/*Start of the Journal Mode Stuff...*/}
							<div className="row">
								<div className="col">
									<div className="card">
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
							{/*Start of the Company Mode Stuff...*/}
							<div className="row">
								<div className="col">
								
									<div className="card">
										<div className="card-header">
											<h5>Company View</h5>
										</div>
										<div className="card-body">
											<div className="list-group">
												<div className="list-group-item">{this.state.currentDivisionName}</div>
												<Link className="list-group-item" to={this.props.match.url+"/companySelect"}>Select Company</Link>
												{/*Going to need to alter this to show which is active?*/}
												<Link className="list-group-item" to={this.props.match.url+"/companyProfile"}>View/Edit Company Settings</Link>
												<Link className="list-group-item" to={this.props.match.url+"/companyEHI"}>Review Company EHI</Link>
												<Link className="list-group-item" to={this.props.match.url+"/companySummary"}>Review Company Summaries</Link>
												<Link className="list-group-item" to={this.props.match.url+"/companySuggestions"}>View Suggestions</Link>
												
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div className="row">
								<div className="col">
									Debug Buttons!
								</div>
							</div>
							<div className="row">
								<div className="col">
									<button className="btn btn-outline-danger" onClick={this.flushStorage}>
										Flush Storage
									</button>
								</div>
							</div>
							
							<div className="row">
								<div className="col">
									<button className="btn btn-outline-danger" onClick={this.redoLoad}>
										Refresh Global Data
									</button>
								</div>
							</div>
							
							<div className="row">
								<div className="col">
									<button className="btn btn-outline-danger" onClick={this.resetState}>
										Reset Displayed Data
									</button>
								</div>
							</div>
						</div>
						{/*Content for the everything....*/}
						<div className="col border m-1">
							<Switch>
								<Route path={this.props.match.url+"/"} exact component={() => <DefaultView
								
									/>} 
								/>

								<Route path={this.props.match.url+"/userProfile"} component={() => <UserProfile
										APIHost={this.props.APIHost}
										authToken={this.props.authToken}
										
										currentUser={this.props.currentUser}
										
										viewNameList={this.state.companyViewableDataRawList}
										viewIDList={this.state.companyViewableDataRawIDs}
										sendIDList={this.state.companySendDataRawIDList}
										
										governedNameList={this.state.companyGovernedDataRawList}
										governedIDList={this.state.companyGovernedDataRawIDList}
										
										triggerRefresh={this.redoLoad}
										triggerLogout={this.forceLogout}
									/>} 
								/>
								<Route path={this.props.match.url+"/writeSuggestion"} component={() => <WriteSuggestion
								
										currentCompanySelections={this.state.currentCompanyGovernedIndexes}
										companyDataTree={this.state.companyGovernedDataTree}
										lastRequestStatus={this.state.lastGovernedCompanyRequestStatus}
										
										selectLayer={this.selectGovernedCompanyLayer}
										backLayer={this.backGovernedCompanyLayer}
										getDataRequest={this.getGovernedCompanyDataRequest}
										
										onChange={this.changeSuggestionContent}
										
										editorState={this.state.suggestionEditorState}
										saveToServer={this.postSuggestion}
									/>} 
								/>
								<Route path={this.props.match.url+"/journalWrite"} component={() => <WriteJournals
										onChange={this.changeJournalContent}
										placeholder={this.state.journalPlaceholder}
										
										editorState={this.state.journalEditorState}
										saveToServer={this.postJournal}
									/>} 
								/>
								<Route path={this.props.match.url+"/journalRead"} component={() => <ViewJournals
										currentDate={this.state.selectedJournalDate}
										
										dataSet={this.state.selectedJournalData}
										selectedPrompt={this.state.selectedJournalPrompt}
										selectedAspect={this.state.selectedJournalAspect}
										validJournalDates={this.state.validJournalDates}
										validJournalScanDates={this.state.validJournalScanDates}
										
										getJournalDates={this.getValidJournalDates}
										pickDate={this.pickJournalCalenderDate}
										
										displayMessage={this.state.journalMessage}
										currentJournal={this.state.journalContent}
										
										setPrompt={this.changeJournalPrompt}
										setAI={this.changeJournalAspect}
									/>} 
								/>
								<Route path={this.props.match.url+"/companySelect"} component={() => <SelectCompany
										currentCompanySelections={this.state.currentCompanyIndexes}
										companyDataTree={this.state.companyViewableDataTree}
										lastRequestStatus={this.state.lastCompanyRequestStatus}
										
										selectLayer={this.selectCompanyLayer}
										backLayer={this.backCompanyLayer}
										getDataRequest={this.getCompanyDataRequest}
									/>} 
								/>
								<Route path={this.props.match.url+"/companyProfile"} component={() => <CompanySettings
										APIHost={this.props.APIHost}
										authToken={this.props.authToken}
										
										currentDivisionID={this.state.currentDivisionID}
									/>} 
								/>
								<Route path={this.props.match.url+"/companySuggestions"} component={() => <SuggestionBox
										currentDate={this.state.selectedCompanyDate}
										
										validDays={this.state.validDivisionSuggestionDates}
										
										dataDay={this.state.selectedSuggestDay}
										dataSet={this.state.selectedSuggestDayData}
										pickDate={this.getCompanySuggestionData}
									/>} 
								/>
								<Route path={this.props.match.url+"/companyEHI"} component={() => <EHIDisplay
										timeIndexDay={this.state.EHIDayTimespan}
										timeIndexWeek={this.state.EHIWeekTimespan}
										
										ehiDayLabels={this.state.EHIDayLabels}
										ehiDayData={this.state.EHIDaySet}
										
										ehiWeekLabels={this.state.EHIWeekLabels}
										ehiWeekData={this.state.EHIWeekSet}
										
										onDayToggle={this.changeEHIDaydates}
										onWeekToggle={this.changeEHIWeekdates}
									/>} 
								/>
								<Route path={this.props.match.url+"/companySummary"} component={() => <ViewCompany
										currentDate={this.props.selectedCompanyDate}
										
										currentCompany={this.state.currentCompanyDataName}
										anchorDate={this.state.currentCompanyDataDate}
										
										validSummaryDates={this.state.validCompanySummaryDates}

										displayMessage={this.state.companyMessage}
										dataSet={this.state.selectedSummaryWeekData}
										selectedDay={this.state.selectedCompanyDay}
										selectedPrompt={this.state.selectedCompanyPrompt}
										selectedAspect={this.state.selectedCompanyAspect}
										
										setPrompt={this.changeCompanyPrompt}
										setAI={this.changeCompanyAspect}
										setDay={this.changeCompanyDay}
										setCompany={this.changeSelectedCompany}
								
										loadCompanyList={this.getUserCompanyAdminViewTree}
										getValidDates={this.getCompanyValidDates}
										pickDate={this.getCompanyWeeklySummary}
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