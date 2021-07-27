import React from "react";

//Link
//import { Alert } from 'react-bootstrap';
import { withRouter, Route, Switch } from "react-router-dom";
//import { ButtonGroup, ToggleButton } from 'react-bootstrap';

//import Store from "store"

//SetCompany
import {CompanyInvites, CompanyPermissions, CompanySettings, SelectCompany, ViewCompany, EHIDisplay, SuggestionBox, PromptEdit, CompanyWeb} from "./companyPages"
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
			EHITimespan: 3,
			EHISelectedPrompt: "none",
			EHISelectedTimescale: "none",
			
			companySelectPage: 1,
		}
	}
	
	componentDidMount() {
		this.props.activateCompanyMenu(1)
	};
	
	componentWillUnmount() {
		this.props.disableMenu()
	}
	
	changeEHIPrompt = (event) => {
		this.setState({
			EHISelectedPrompt:event.currentTarget.value
		})
	}
	changeEHITimescale = (event) => {
		this.setState({
			EHISelectedTimescale:event.currentTarget.value
		})
	}
	
	EHITimeToggle = (dateRangeChoice) => {
		this.setState({
			EHITimespan:dateRangeChoice
		})
	}
	
	// Rendering this with Bootstrap React.... To see if there is anything really interesting I can do with it
	// So far it doesnt look all that different 
	render() {
	
		return (
			<div className="contentPages">
				<div className="container">
					<div className="row m-1 my-5">
						<div className="col m-1">
							
							{/*
							{ this.props.currentDivisionID === -1 &&
								<div className="row m-2">
									<div className="col"/>
									<div className="col m-2 border bg-warning shadow">
										Select a Company First!
									</div>
									<div className="col"/>
								</div>
							}
							*/}						
							<Switch>
								<Route path={this.props.match.url+"/companySelect"} exact component={() => <SelectCompany
							
										
										companySelectPage={this.state.companySelectPage}
										
										currentDivisionName={this.props.currentDivisionName}
										userLoadedCompanyList={this.props.userLoadedCompanyList}
										
										getDataRequest={this.props.getCompanyDataRequest}
										
										getCompanyDataStatus={this.props.getCompanyDataStatus}
										
										getCompanyValidDatesStatus={this.props.getCompanyValidDatesStatus}
										getCompanyValidDatesError={this.props.getCompanyValidDatesError}
										
										getCompanyValidSuggestionDatesStatus={this.props.getCompanyValidSuggestionDatesStatus}
										getCompanyValidSuggestionDatesError={this.props.getCompanyValidSuggestionDatesError}
										
										getCompanyEHIDataStatus={this.props.getCompanyEHIDataStatus}
										getCompanyEHIDataError={this.props.getCompanyEHIDataError}
									/>} 
								/>
								
								<Route path={this.props.match.url+"/companyInvites"} component={() => <CompanyInvites
										
										currentDivisionID={this.props.currentDivisionID}
										
										triggerRefresh={this.props.loadCompanyData}
										refreshToken={this.props.refreshToken}
									/>} 
								/>
								<Route path={this.props.match.url+"/companyPerms"} component={() => <CompanyPermissions
										
										currentDivisionID={this.props.currentDivisionID}
										
										triggerRefresh={this.props.loadCompanyData}
										refreshToken={this.props.refreshToken}
									/>} 
								/>
								<Route path={this.props.match.url+"/companySettings"} component={() => <CompanySettings
										
										currentDivisionID={this.props.currentDivisionID}
										
										triggerRefresh={this.props.loadCompanyData}
										refreshToken={this.props.refreshToken}
									/>} 
								/>
								
								<Route path={this.props.match.url+"/companySuggestions"} component={() => <SuggestionBox
										currentDate={this.props.selectedSuggestDay}
										
										validDays={this.props.validDivisionSuggestionDates}
										
										dataDay={this.props.selectedSuggestDay}
										dataSet={this.props.selectedSuggestDayData}
										pickDate={this.props.getCompanySuggestionData}
										
										currentDivisionID={this.props.currentDivisionID}
										
										getCompanySuggestionDataStatus={this.props.getCompanySuggestionDataStatus}
										getCompanySuggestionDataError={this.props.getCompanySuggestionDataError}
									/>} 
								/>
								<Route path={this.props.match.url+"/companyEHI"} component={() => <EHIDisplay
										currentDivisionID={this.props.currentDivisionID}
								
										timeIndex={this.state.EHITimespan}
										
										EHIData={this.props.EHIData}
										
										EHIselectedPrompt={this.state.EHISelectedPrompt}
										EHIselectedTimescale={this.state.EHISelectedTimescale}
										
										EHISetPrompt={this.changeEHIPrompt}
										EHISetTimescale={this.changeEHITimescale}
										EHITimeToggle={this.EHITimeToggle}
									/>} 
								/>	
								<Route path={this.props.match.url+"/companySummary"} component={() => <ViewCompany
										currentDate={this.props.selectedCompanyDate}
										
										currentCompany={this.props.currentCompanyDataName}
										summaryType={this.props.currentCompanyDataType}
										
										validSummaryDates={this.props.validCompanySummaryDates}

										displayMessage={this.props.companyMessage}
										dataSet={this.props.selectedSummaryWeekData}
										
										selectedDay={this.props.selectedCompanyDay}
										selectedPrompt={this.props.selectedCompanyPrompt}
										selectedAspect={this.props.selectedCompanyAspect}
										
										setPrompt={this.props.changeCompanyPrompt}
										setAI={this.props.changeCompanyAspect}
										setDay={this.props.changeCompanyDay}
										setCompany={this.props.changeSelectedCompany}
								
										getValidDates={this.props.getCompanyValidDates}
										pickDate={this.props.getCompanyWeeklySummary}
										
										getCompanyWeeklySummaryStatus={this.props.getCompanyWeeklySummaryStatus}
										getCompanyWeeklySummaryError={this.props.getCompanyWeeklySummaryError}
									/>} 
								/>
								
								<Route path={this.props.match.url+"/companyPrompts"} component={() => <PromptEdit
										
										refreshToken={this.props.refreshToken}
										
										currentDivisionID={this.props.currentDivisionID}										
									/>} 
								/>
								
								<Route path={this.props.match.url+"/companyWeb"} component={() => <CompanyWeb
										refreshToken={this.props.refreshToken}
										
										currentDivisionID={this.props.currentDivisionID}	
										reRouteTarget={this.props.match.url+"/companySelect"}
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