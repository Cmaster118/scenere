import React from "react";

import { withRouter, Route, Switch } from "react-router-dom";
//import { ButtonGroup, ToggleButton } from 'react-bootstrap'

//SetCompany
import { UserPages, CompanyPages, Dashboard } from "."
import { APIGetJournalDates, APIGetSuggestionDates, APIGetSuggestionData, APIGetUsersPermTree, APIGetCompanyValidDates, APIGetCompanySummary, APIGetServerEHIData, APICheckActive } from "../utils";
//convertFromRaw

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
			
			// If I put the calender in the sidebar, we shall put this here...
			validJournalDates:[],
			validJournalScanDates: [],
			
			selectedCompanyDate: new Date(),
			selectedSuggestionDate: new Date(),
			
			// EHI Page State...
			EHIDayTimespan: 3,
			EHIWeekTimespan: 3,
			
			EHIDayLabels: [],
			EHIDaySet: [],
			EHIWeekLabels: [],
			EHIWeekSet: [],
			
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
			lastCompanyRequestStatus:0,
			
			// Last data obtained for company summary
			currentCompanyDataName:undefined,
			currentCompanyDataDate:undefined,
			selectedSummaryWeekData: {mon:{},tue:{},wed:{},thu:{},fri:{},sat:{},sun:{},allDay:{}},
			validCompanySummaryDates:[],
			
			// Suggestions!
			selectedSuggestDay: false,
			selectedSuggestDayData: [],
			validDivisionSuggestionDates:[],
			
			currentSuggestionDivision: -1,
			currentCompanyGovernedIndexes: [],
			companyGovernedDataTree: {},
			companyGovernedDataRawList: [],
			companyGovernedDataRawIDList: [],
			lastGovernedCompanyRequestStatus:undefined,
        };
	}
	
	// This will run when this component is loaded...
	componentDidMount = () => {
		// On refresh, these will load before App.js has a chance to load in the token...
		this.loadData()
	}
	
	clearCompanyData = () => {
		this.setState({
			// Clear EHI Data....
			EHIDayLabels: [],
			EHIDaySet: [],
			EHIWeekLabels: [],
			EHIWeekSet: [],
			
			currentCompanyDataName:undefined,
			currentCompanyDataDate:undefined,
			selectedSummaryWeekData: {mon:{},tue:{},wed:{},thu:{},fri:{},sat:{},sun:{},allDay:{}},
			validCompanySummaryDates:[],
			
			selectedSuggestDay: false,
			selectedSuggestDayData: [],
			validDivisionSuggestionDates:[],
		})
	}
	
	loadData = () => {
		this.checkActiveUser()
		
		this.getValidJournalDates()
		
		// I need to merge this into a SINGLE CALL
		this.getUserCompanyAdminViewTree()
		this.getUserCompanySendsTree()
		this.getUserGovernedPermTree()
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
		this.props.logout()
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
	
	// Journal Date Stuff----------------------------------------------------------------------
	journalDatesCallback = (incomingJournalDates, incomingJournalAIDates) => {
		
		//Store.set(this.props.currentUser+"-ValidDates", {"journalDates":incomingJournalDates ,"AIDates":incomingJournalAIDates})
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
			let checkData = undefined//Store.get(this.props.currentUser+"-ValidDates")
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
			let checkData = undefined//Store.get(this.props.currentUser+"-companyGovernedPermTree")
			let checkData2 = undefined//Store.get(this.props.currentUser+"-companyPermGovernedNames")
			let checkData3 = undefined//Store.get(this.props.currentUser+"-incomingCompanyIDs")
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
			let checkData = undefined//Store.get(this.props.currentUser+"-companyPermViewTree")
			let checkData2 = undefined//Store.get(this.props.currentUser+"-companyPermViewNames")
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
			let checkData = undefined//Store.get(this.props.currentUser+"-companyPermSendTree")
			let checkData2 = undefined//Store.get(this.props.currentUser+"-companyPermSendNames")
			let checkData3 = undefined//Store.get(this.props.currentUser+"-companyPermSendIDs")
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
		//Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidDates", {'dates':incomingDatesList})
		this.setState({
			validCompanySummaryDates: incomingDatesList
		})
	}
	getCompanyValidDates = () => {
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = undefined//Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidDates")
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
		//Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidSuggestionDates", {'dates':incomingDatesList})
		
		this.setState({
			validDivisionSuggestionDates: incomingDatesList
		})
	}
	getCompanyValidSuggestionDates = () => {
		if (!(this.state.currentDivisionID === -1)) {
			let checkData = undefined//Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-ValidSuggestionDates")
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
		console.log(incomingData)
		let givenDate = new Date(targetDate)
		this.setState({
			selectedSuggestDay: givenDate,
			selectedSuggestDayData: incomingData,
		})
	}
	getCompanySuggestionData = (selectedDate) => {
		
		if (!(this.state.currentDivisionID === -1)) {
			
			this.setState({
				getCompanySuggestionData:selectedDate,
			})
			
			let checkData = undefined//Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+selectedDate+"-suggestions")
			if (checkData === undefined) {
				console.log("Division suggestion data was not in the cookies")
				APIGetSuggestionData(this.props.APIHost, this.props.authToken, this.state.currentDivisionID, selectedDate, this.companySuggestionDataCallback, this.forceLogout)
			}
			else {
				console.log("Division suggestion dates WERE in the coockies!")
				this.companySuggestionDataCallback()
			}
		}
		else {
			console.log("Invalid company!")
			this.setState({
				
			})
		}
	}
	
	companyDataCallback = (incomingDataDict, anchorDate) => {
		//Store.set(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+anchorDate+"Data", {'data':incomingDataDict})
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
		
		this.setState({
			selectedCompanyDate:selectedDate,
		})
		
		// if we DID, all we need to do is swap the day we are doing...
		if (this.state.currentCompanyDataID === this.state.currentDivisionID && this.state.currentCompanyDataDate === anchorDate) {
			this.setState({
				selectedCompanyDay: daySet[todayWeekday].value,
			})
		}
		// if NOT, then we go get the data, as it is NOT loaded...
		else {
			if (!(this.state.currentDivisionID === -1)) {
				let checkData = undefined//Store.get(this.props.currentUser+"-"+this.state.currentDivisionID+"-"+anchorDate+"Data")
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
		//Store.set(this.props.currentUser+'-'+this.state.currentDivisionID+'-EHI', {'labelsDays':incomingEHIDaysLabels, 'dataDays':incomingEHIDaysData, 'labelsWeeks':incomingEHIWeeksLabels, 'dataWeeks':incomingEHIWeeksData})
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
			let checkData = undefined//Store.get(this.props.currentUser+'-'+this.state.currentDivisionID+'-EHI')
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
	
	// For V2 of the Company Choosing...
	selectCompanyLayer = (event) => {
		let values = this.state.currentCompanyIndexes
		values.push(event.target.value)
		
		this.setState({
			currentCompanyIndexes:values,
			lastCompanyRequestStatus:0,
		})
	}
	backCompanyLayer = (event) => {
		let values = this.state.currentCompanyIndexes
		values.splice(event.target.value)
		
		this.setState({
			currentCompanyIndexes:values,
			lastCompanyRequestStatus:0,
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
	
	getThatData = () => {
		//console.log(this.state.currentDivisionID)
		// Clear ALL THE DATA from the last company we had set....
		this.clearCompanyData()
		
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
				lastCompanyRequestStatus:1,
			}, this.getThatData )
		}
		else {
			console.log("Not allowed!")
			this.setState({
				lastCompanyRequestStatus:2
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
		
		return (
			<div className="contentPages">
			
				<div className="container-fluid">
				
					<Switch>
						<Route path={this.props.match.url} exact component={() => <Dashboard
								toUserPage={this.props.match.url+"/user/journalWrite"}
								toCompanyPage={this.props.match.url+"/company/selectCompany"}
							/>} 
						/>
						<Route path={this.props.match.url+"/user"} component={() => <UserPages

								currentDate={this.state.currentDate}

								APIHost={this.props.APIHost}
								authToken={this.props.authToken}
								
								currentUser={this.props.currentUser}
								
								companyViewableDataRawList={this.state.companyViewableDataRawList}
								companyViewableDataRawIDs={this.state.companyViewableDataRawIDs}
								companySendDataRawIDList={this.state.companySendDataRawIDList}
								
								companyGovernedDataRawList={this.state.companyGovernedDataRawList}
								companyGovernedDataRawIDList={this.state.companyGovernedDataRawIDList}
								
								loadCompanyData={this.loadData}
								
								validJournalDates={this.state.validJournalDates}
								validJournalScanDates={this.state.validJournalScanDates}
										
								currentCompanyGovernedIndexes={this.state.currentCompanyGovernedIndexes}
								companyGovernedDataTree={this.state.companyGovernedDataTree}
								lastGovernedCompanyRequestStatus={this.state.lastGovernedCompanyRequestStatus}
								
								selectGovernedCompanyLayer={this.selectGovernedCompanyLayer}
								backGovernedCompanyLayer={this.backGovernedCompanyLayer}
								getGovernedCompanyDataRequest={this.getGovernedCompanyDataRequest}
								
								currentSuggestionDivision = {this.state.currentSuggestionDivision}
							/>} 
						/>
						<Route path={this.props.match.url+"/company"} component={() => <CompanyPages
								
								currentDate={this.state.currentDate}
						
								currentDivisionName={this.state.currentDivisionName}
								currentCompanyIndexes={this.state.currentCompanyIndexes}
								companyViewableDataTree={this.state.companyViewableDataTree}
								lastCompanyRequestStatus={this.state.lastCompanyRequestStatus}
								
								selectCompanyLayer={this.selectCompanyLayer}
								backCompanyLayer={this.backCompanyLayer}
								getCompanyDataRequest={this.getCompanyDataRequest}
								
								APIHost={this.props.APIHost}
								authToken={this.props.authToken}
								
								currentDivisionID={this.state.currentDivisionID}
										
								selectedCompanyDate={this.state.selectedCompanyDate}
										
								validDivisionSuggestionDates={this.state.validDivisionSuggestionDates}
								
								selectedSuggestDay={this.state.selectedSuggestDay}
								selectedSuggestDayData={this.state.selectedSuggestDayData}
								getCompanySuggestionData={this.getCompanySuggestionData}
										
								EHIDayTimespan={this.state.EHIDayTimespan}
								EHIWeekTimespan={this.state.EHIWeekTimespan}
								
								EHIDayLabels={this.state.EHIDayLabels}
								EHIDaySet={this.state.EHIDaySet}
								
								EHIWeekLabels={this.state.EHIWeekLabels}
								EHIWeekSet={this.state.EHIWeekSet}
								
								changeEHIDaydates={this.changeEHIDaydates}
								changeEHIWeekdates={this.changeEHIWeekdates}
										
								currentCompanyDataName={this.state.currentCompanyDataName}
								currentCompanyDataDate={this.state.currentCompanyDataDate}
								
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
						
								getUserCompanyAdminViewTree={this.getUserCompanyAdminViewTree}
								getCompanyValidDates={this.getCompanyValidDates}
								getCompanyWeeklySummary={this.getCompanyWeeklySummary}
							/>} 
						/>
					</Switch>
					
				</div>
			</div>
		);
	}
}

export default withRouter(ContentPages);