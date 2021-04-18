import React from "react";

import { withRouter } from "react-router-dom";
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
					
					<div className="col m-2">
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
				<div className="row">
					<div className="col">
					
					</div>
				</div>
			</div>	
		</div>
	);
}

export default withRouter(suggesstionBox);