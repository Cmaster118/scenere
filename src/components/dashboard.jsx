import React from "react";
import { withRouter, Link } from "react-router-dom";

//import { Alert } from 'react-bootstrap'

// Combine this, and make it better....
// This is FAR TOO INEFFICIENT
// AND has unecessary checks in it
const checkIfDoneToday = (currentDivID, promptID, nonJournalPromptsDone, journalPromptsDone, journalScanPromptsDone) => {
	let matchToday = false

	// This needs to be put down in the switch statement so all 3 are not run at the same time...
	// Either that or the if checks :P
	// Too lazy right now :P
	if (nonJournalPromptsDone !== undefined) { 
		if (nonJournalPromptsDone["today"] !== undefined) {
			if (currentDivID in nonJournalPromptsDone["today"]) {
				for (let i in nonJournalPromptsDone["today"][currentDivID]) {

					if (nonJournalPromptsDone["today"][currentDivID][i] === null) {
						continue
					}
					if ( promptID === nonJournalPromptsDone["today"][currentDivID][i]["identifier"]) {
						matchToday = true
						break
					}
				}
			}
		}
	}
	if (journalPromptsDone !== undefined) { 
		if (journalPromptsDone["today"] !== undefined) {
			if (currentDivID in journalPromptsDone["today"]) {
				for (let i in journalPromptsDone["today"][currentDivID]) {

					if (journalPromptsDone["today"][currentDivID][i] === null) {
						continue
					}
					if ( promptID === journalPromptsDone["today"][currentDivID][i]["identifier"]) {
						matchToday = true
						break
					}
				}
			}
		}
	}
	if (journalScanPromptsDone !== undefined) { 
		if (journalScanPromptsDone["today"] !== undefined) {
			if (currentDivID in journalScanPromptsDone["today"]) {
				for (let i in journalScanPromptsDone["today"][currentDivID]) {

					if (journalScanPromptsDone["today"][currentDivID][i] === null) {
						continue
					}
					if ( promptID === journalScanPromptsDone["today"][currentDivID][i]["identifier"]) {
						matchToday = true
						break
					}
				}
			}
		}
	}
	return matchToday
}

const modeSelector = (props) => {
	
	let numberPrompts = 0
	for (let thing in props.journalValidPrompts) {
		// Valid prompt set
		if (props.journalValidPrompts[thing] !== undefined) {
			// Check what ID we are using...
			
			let targetSet = "usr"
			if (!props.journalValidPrompts[thing]["typeFlag"]) {
				//console.log("Should be division?")
				targetSet = props.journalValidPrompts[thing]["divTarget"]
			}
			//console.log(targetSet)
			for (let pIndex in props.journalValidPrompts[thing]["promptSet"]) {
				let promptID = props.journalValidPrompts[thing]["promptSet"][pIndex]["identifier"]
				
				let isDone = checkIfDoneToday(targetSet, promptID, props.validNonJournalDates, props.validJournalDates, props.validJournalScanDates)
				if (!isDone) {
					numberPrompts++
				}
			}
		}
	}

	let allowCompanySelect = 0
	// 0 === Admin, 1 === PrivateViewer, 2 === SendsToEmails, 3 === Governed
	//console.log(props.userLoadedCompanyList)
	// Find if we have one that is selectable...
	
	for (let index in props.userLoadedCompanyList) {
		for (let indexPerm in props.userLoadedCompanyList[index]["perm"]) {
			if (props.userLoadedCompanyList[index]["perm"][indexPerm] === 0 || props.userLoadedCompanyList[index]["perm"][indexPerm] === 1) {
				allowCompanySelect++
				break
			}
		}
	}
	
	//let userDisplay = (<div>Empty!</div>)
	// if something?
	let userDisplay = (
		<div>
			<div className="list-group-item">
				<b>{numberPrompts}</b> Prompts left for Today
			</div>
			<Link className="btn btn-primary btn-block" to={props.toUserPage}>
				Change To User Mode
			</Link>
		</div>
	)
	
	
	
	let companyDisplay = (<div>Empty!</div>)
	if (allowCompanySelect > 0) {
		companyDisplay = (
			<div>
				<div className="list-group-item">
					<b>{allowCompanySelect}</b> Viewable Divisions
				</div>
				<Link className="btn btn-primary btn-block" to={props.toCompanyPage}>
					Change To Company Mode
				</Link>
			</div>
		)
	}
	else {
		companyDisplay = (
			<div className="list-group-item">
				Nothing Viewable!
			</div>
		)
	}

	return (
		<div className="defaultView">
			<div className="container">
			
				<div className="mt-5">
					<div className="row my-3">
						<div className="col m-1">
							<div className="card shadow">
								<div className="card-header">
									<h4>
										Dashboard
									</h4>
								</div>
							</div>
						</div>
					</div>
				
					<div className="row my-3">
						<div className="col m-1">
						
							<div className="card shadow">
								<div className="card-body">
									{userDisplay}
								</div>
							</div>
							
						</div>
						
						<div className="col m-1">
						
							<div className="card shadow">
								<div className="card-body">
									{companyDisplay}
								</div>
							</div>
							
						</div>
					</div>
					
					<div className="row my-3">
						<div className="col m-1">
							<div className="card shadow">
								<div className="card-body">
									<h5>
										<u>
											Looking Nice Cap Off?
										</u>
									</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			
			</div>
		</div>
		
	)
}

export default withRouter(modeSelector);