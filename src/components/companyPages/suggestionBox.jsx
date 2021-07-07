import React from "react";

import { withRouter } from "react-router-dom";
import { Alert } from 'react-bootstrap';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

const suggesstionBox = (props) => {
	
	const tileClassName = ({ date, view }) => {
	
		// Add class to tiles in month view only
		if (view === 'month') {
			
			const checkDate = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()

			// Check if a date React-Calendar wants to check is on the list of dates to add class to
			const hasStuff = props.validDays.find( element => element === checkDate)
			
			if (hasStuff) {
				return 'btn btn-success'
			} else {
				//return 'btn btn-outline-dark'
			}
			
		}
	}
	
	let keyID = 0
	let displayData = []
	
	//console.log(props.validDays)
	//console.log(props.dataSet)
	
	for ( let suggestion in props.dataSet ) {
		displayData.push(
			<div className="row m-2" key={keyID}>
				<div className="col border">
					{props.dataSet[suggestion].content}
				</div>
			</div>
		)
		keyID += 1
	}
	if ( displayData.length === 0 ) {
		displayData.push(
			<div className="row m-2" key={keyID}>
				<div className="col">
					No data to show!
				</div>
			</div>
		)
		keyID += 1
	}
	
	if ( props.dataDay === false  ) {
		displayData = [
			<div className="row m-2" key={keyID}>
				<div className="col">
					No Day Selected!
				</div>
			</div>
		]
	}
	
	let currentSelectedDayFilter = props.currentDate
	if ( props.currentDate === false ) {
		currentSelectedDayFilter = new Date()
	}
	
	//let showIdle = props.getCompanySuggestionDataStatus === 0
	let showWaiting = props.getCompanySuggestionDataStatus === 1
	let showSuccess = false//props.getCompanySuggestionDataStatus === 2
	let showError = props.getCompanySuggestionDataStatus === 3
	
	let errorParse = []
		for (let index in props.getSettingsError) {
			errorParse.push(
				props.getSettingsError[index]["text"]
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
			
				<div className="row m-2">
					<div className="col- m-2">
						<Calendar 
							className="shadow"
							onChange={props.pickDate}
							value={currentSelectedDayFilter}
							tileClassName={tileClassName}

							minDetail={'year'}
							maxDetail={'month'}
						/>
					</div>
					
					<div className="col-md-12 col-lg-6 m-2">
						<div className="card shadow">
							<div className="card-header">
								<div>Suggestions for Date: {props.dataDay && props.dataDay.toString()}</div>
							</div>
							<div className="card-body">
								{displayData}
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
					  Successfully obtained data!
					</p>
					<hr />
				</Alert>
				
				<Alert show={showError} variant="danger">
					<Alert.Heading>Error!</Alert.Heading>
					<hr />
					<p>
						{errorParse}
					</p>
					<hr />
				</Alert>
			</div>	
		</div>
	);
}

export default withRouter(suggesstionBox);