import React from "react";

import { withRouter } from "react-router-dom";
import { Alert } from 'react-bootstrap';

const permRender = ["Admin", "Viewer", "Governer"]

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

class selectCompany extends React.Component  {
	
	constructor(props) {
        super(props);
		this.state = {
			pageNum:0,
			numPerPage:10,
			
			numChooseLimit:5,
			
			subList: this.initializeSubList()
		}
	}
	
	componentWillUnmount() {
		
	}
	
	initializeSubList = () => {
		
		let generateingList = []
		// Hm, this may run multiple times due to my now-messed data reloading structure...
		for (let index in this.props.userLoadedCompanyList) {
			
			let permType = -1
			for (let permIndex in this.props.userLoadedCompanyList[index]["perm"]) {
				if (this.props.userLoadedCompanyList[index]["perm"][permIndex] === 0) {
					//console.log("Is Admin")
					// Set the thing to admin no matter what
					permType = 0
				}
				else if (this.props.userLoadedCompanyList[index]["perm"][permIndex] === 1) {
					//console.log("Is Viewable")
					// Set it to viewable... AS LONG AS it is NOT set to admin..
					
					// Unnecessary...
					if (!(permType === 0)) {
						permType = 1
					}
				}
			}
			
			if (permType >= 0 && permType < 4) {
				generateingList.push( [this.props.userLoadedCompanyList[index], permType] )
			}
		}

		return generateingList
	}
	
	getData = (event) => {
		this.props.getDataRequest( this.props.userLoadedCompanyList[event.target.value] )
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

			if (newPage > this.state.subList.length/this.state.numPerPage) {
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
		
		let displayDivisionList = []
		for (let index = 0; index < this.state.numPerPage; index++) {
			
			let adjustedIndex = index + this.state.pageNum*this.state.numPerPage			
			if (adjustedIndex > this.state.subList.length || adjustedIndex < 0) {
				continue
			}
			if (this.state.subList[adjustedIndex] === undefined) {
				continue
			}
			
			displayDivisionList.push(
				<li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
						<div className="col">
							{this.state.subList[adjustedIndex][0]["fullname"]}
						</div>
						<div className="col">
							{permRender[this.state.subList[adjustedIndex][1]]}
						</div>
						<div className="col-2">
							<button className="btn btn-primary" value={adjustedIndex} onClick={this.getData}>
								GET!
							</button>
						</div>
				</li>
			)
		}
		
		if (displayDivisionList.length === 0) {
			displayDivisionList.push(
				<div className="row" key="0">
					<div className="col">
						Server Reported no valid Companies to select!
					</div>
				</div>
			)
		}
		
		//let showIdle = this.props.getCompanyValidDatesStatus === 0 || this.props.getCompanyValidSuggestionDatesStatus === 0 || this.props.getCompanyEHIDataStatus === 0
		let showWaiting = this.props.getCompanyValidDatesStatus === 1 || this.props.getCompanyValidSuggestionDatesStatus === 1 || this.props.getCompanyEHIDataStatus === 1
		let showSuccess = this.props.getCompanyValidDatesStatus === 2 || this.props.getCompanyValidSuggestionDatesStatus === 2 || this.props.getCompanyEHIDataStatus === 2
		let showError = this.props.getCompanyValidDatesStatus === 3 || this.props.getCompanyValidSuggestionDatesStatus === 3 || this.props.getCompanyEHIDataStatus === 3
			
		//console.log(this.props.getCompanyValidDatesStatus)
		//console.log(this.props.getCompanyValidSuggestionDatesStatus)
		//console.log(this.props.getCompanyEHIDataStatus)
		
		let errorParse = []
		for (let index in this.props.getCompanyEHIDataError) {
			errorParse.push(
				this.props.getCompanyEHIDataError[index]["text"]
			)
		}
		for (let index in this.props.getCompanyValidSuggestionDatesError) {
			errorParse.push(
				this.props.getCompanyValidSuggestionDatesError[index]["text"]
			)
		}
		for (let index in this.props.getCompanyValidDatesError) {
			errorParse.push(
				this.props.getCompanyValidDatesError[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}
			
		return (
			<div className="testPages">
				<div className="container-fluid">
					
					<div className="row my-2">
						<div className="col">
							<div className="card shadow">
							
								<div className="card-header">
									<div className="row">
										<div className="col my-2">
											<h3>
												Your Company Divisions
											</h3>
										</div>
									</div>
								</div>
								
								<div className="card-body">
									<div className="row">
										<div className="col">
											<ul className="list-group">
												{displayDivisionList}
											</ul>
										</div>
									</div>
									
									<Paginator
										activePage={this.state.pageNum}
										
										changePrevNext={this.changePageFwdBck}
										changeToNum={this.changePageTo}
										
										totalLoaded={this.state.subList.length}
										numPerPage={this.state.numPerPage}
									/>
									
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
						  Division Data for {this.props.currentDivisionName} is Ready!
						</p>
						<hr />
					</Alert>
					
					<Alert show={showError} variant="danger">
						<Alert.Heading>Error!</Alert.Heading>
						<hr />
						<p>
						  Failure to get the data!
						</p>
						<hr />
					</Alert>
						
				</div>
			</div>
		);
	}
}

export default withRouter(selectCompany);