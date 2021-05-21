import React from "react";

//Link
import { withRouter, Route, Switch } from "react-router-dom";
//import { ButtonGroup, ToggleButton } from 'react-bootstrap';

//import Store from "store"

//SetCompany
import {CompanyInvites, CompanyPermissions, CompanySettings, SelectCompany, ViewCompany, EHIDisplay, SuggestionBox, PromptEdit} from "./companyPages"
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
	
		//console.log(this.props.currentDivisionID)
	
		return (
			<div className="contentPages">
				<div className="container">
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
											<Link className="list-group-item" to={this.props.reRouteCompany}>Return To Dashboard</Link>
										</div>
										<div className="card-body">
											<div className="list-group">
												<Link className={this.props.currentDivisionID === -1? "list-group-item bg-warning":"list-group-item bg-light"} to={this.props.match.url+"/selectCompany"}>{this.props.currentDivisionName}</Link>
												<Link className="list-group-item" to={this.props.match.url+"/companyEHI"}>Review Company EHI</Link>
												<Link className="list-group-item" to={this.props.match.url+"/companySummary"}>Review Company Summaries</Link>
												<Link className="list-group-item" to={this.props.match.url+"/companySuggestions"}>View Suggestions</Link>
												<Link className="list-group-item" to={this.props.match.url+"/companyProfile"}>View/Edit Company Settings</Link>
											</div>
										</div>
									</div>
								</div>
							</div>		
						</div>
					*/}
						<div className="col m-1">
							
							{ this.props.currentDivisionID === -1 &&
								<div className="row m-2">
									<div className="col"/>
									<div className="col m-2 border bg-warning shadow">
										Select a Company First!
									</div>
									<div className="col"/>
								</div>
							}
						
							<Switch>
								<Route path={this.props.match.url+"/companySelect"} exact component={() => <SelectCompany
										currentCompanySelections={this.props.currentCompanyIndexes}
										companyDataTree={this.props.companyViewableDataTree}
										lastRequestStatus={this.props.lastCompanyRequestStatus}
										
										selectLayer={this.props.selectCompanyLayer}
										backLayer={this.props.backCompanyLayer}
										getDataRequest={this.props.getCompanyDataRequest}
									/>} 
								/>
								
								<Route path={this.props.match.url+"/companyInvites"} component={() => <CompanyInvites
										APIHost={this.props.APIHost}
										authToken={this.props.authToken}
										
										currentDivisionID={this.props.currentDivisionID}
										
										triggerRefresh={this.props.loadCompanyData}
									/>} 
								/>
								<Route path={this.props.match.url+"/companyPerms"} component={() => <CompanyPermissions
										APIHost={this.props.APIHost}
										authToken={this.props.authToken}
										
										currentDivisionID={this.props.currentDivisionID}
										
										triggerRefresh={this.props.loadCompanyData}
									/>} 
								/>
								<Route path={this.props.match.url+"/companySettings"} component={() => <CompanySettings
										APIHost={this.props.APIHost}
										authToken={this.props.authToken}
										
										currentDivisionID={this.props.currentDivisionID}
										
										triggerRefresh={this.props.loadCompanyData}
									/>} 
								/>
								
								<Route path={this.props.match.url+"/companySuggestions"} component={() => <SuggestionBox
										currentDate={this.props.selectedSuggestDay}
										
										validDays={this.props.validDivisionSuggestionDates}
										
										dataDay={this.props.selectedSuggestDay}
										dataSet={this.props.selectedSuggestDayData}
										pickDate={this.props.getCompanySuggestionData}
										
										currentDivisionID={this.props.currentDivisionID}
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
								
										loadCompanyList={this.props.getUserCompanyAdminViewTree}
										getValidDates={this.props.getCompanyValidDates}
										pickDate={this.props.getCompanyWeeklySummary}
									/>} 
								/>
								
								<Route path={this.props.match.url+"/companyPrompts"} component={() => <PromptEdit
										APIHost={this.props.APIHost}
										authToken={this.props.authToken}
										
										forceLogout={this.props.forceLogout}
										
										currentDivisionID={this.props.currentDivisionID}										
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