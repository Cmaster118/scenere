import axios from "axios"

// Sign In!
export const APISignIn = (APIHost, requestUsername, requestPassword, callbackFunction, callbackFailure) => {
	const data = {
		username: requestUsername,
		password: requestPassword,
	};
	axios.post(APIHost +"/apiTokenAuth/", data )
	.then( res => {
		//res.data
		//console.log(res.data)
		let outData = res.data.token
		callbackFunction(outData)
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				let outError = err.response.status
				callbackFailure(outError)
			}
		}
	})
}

// Sign Up!
export const APISignUp = (APIHost, requestUsername, requestPassword1, requestPassword2, email, firstName, lastName, callbackFunction, callbackFailure) => {
	const data = {
			username: requestUsername,
			password: requestPassword1,
			password2: requestPassword2,
			email: email,
			first_name: firstName,
			last_name: lastName,
		};
		
		// Output of this boi is the error messages and stuff...
		// Because the only data we really need is that it succeeded before we continue...
		axios.post(APIHost +"/registerUser/", data )
		.then( res => { 
			//res.data
			let outData = res.status
			callbackFunction(outData)
		})
		.catch( err => {
			if (!(err === undefined)) {
				if (!(err.response === undefined)) {
					// Figure out how do display these better?
					let outError = err.response.status
					let outData = err.response.data
					callbackFailure(outError, outData)
				}
			}
		})
}

// Validator Check!
export const APIValidateAccount = (APIHost, authToken, activateToken, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	axios.get(APIHost +"/emailActivate/?token="+activateToken, config)
	.then( 
		res => {
			callbackFunction(res.status, res.data)
	})
	.catch( err => {
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				callbackFailure(err.response.status, err.response.data)
			}
		}
	});
}

// Resend Validation Email!
export const APIResendValidator = (APIHost, authToken, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	axios.get(APIHost +"/emailVerifyResend", config)
	.then( 
		res => {
			//console.log("Got Data!")
			//console.log(res.data)
			callbackFunction()
	})
	.catch( err => {
		console.log("Failure")
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					callbackFailure()
				}
			}
		}
	});
}

// Check if the user is active!
export const APICheckActive = (APIHost, authToken, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	axios.get(APIHost +"/userIsActive", config)
	.then( 
		res => {
			callbackFunction(res.data[0].isActive)
	})
	.catch( err => {
		//console.log("Failure")
		// I am going to have to redo everything in this style, as there can be several errors...
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				callbackFailure(err.response.status, err.response.data)
			}
		}
	});
}

// Get Divisions that we are allowed to send a suggestion to...
export const APIGetCompanyGovernedPermTree = (APIHost, authToken, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};

	axios.get(APIHost +"/getUsersGovernedDivisions", config)
	.then( 	res => {
			
			// Normal behaviour
			console.log("Got the tree of companies")
			
			// Now we convert this data into a tree... Tho why not just use it as is?
			//console.log(res.data)
			
			callbackFunction(res.data)
		})
		.catch( err => {
			if (!(err === undefined)) {
				if (!(err.response === undefined)) {
					if (err.response.status === 401) {
						// Force the logout stuff
						callbackFailure()
					}
				}
			}
		});
}
// Saving of the suggestion...
export const APISaveSuggestion = (APIHost, authToken, postingDate, targetDivision, content, editorBlock, callbackFunction, callbackFailure) => {
		
	//const randomID = Math.random().toString(16).substr(2, 8);
	
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	const data = {
		targetDivision: targetDivision,
		createdDate: postingDate.toJSON().split("T")[0],
		content: content,
	};
	
	//console.log(data)
	
	axios.post(APIHost +"/saveNewSuggestion/", data, config )
	.then( res => { 
		callbackFunction(res.data)
	})
	.catch( err => {
		// Change this depending on the error...?
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					callbackFailure()
				}
			}
		}
	})
}

// Save the journal data...
export const APISaveJournal = (APIHost, authToken, postingDate, content, editorBlock, callbackFunction, callbackFailure) => {
		
	const randomID = Math.random().toString(16).substr(2, 8);
	
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	const data = {
		shorthand: 'made from the website: '+randomID,
		// Author is filled in based on your Token on the server side...
	
		forDate: postingDate.toJSON().split("T")[0],

		content: content,
	};
	
	//console.log(data)
	
	axios.post(APIHost +"/saveUserJournal/", data, config )
	.then( res => { 
		callbackFunction(res.data)
	})
	.catch( err => {
		// Change this depending on the error...?
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					callbackFailure()
				}
			}
		}
	})
}

// Get the dates for a specific user, defined in the auth token
// I may have to redo this?
export const APIGetJournalDates = (APIHost, authToken, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	axios.get(APIHost +"/getJournalDates", config)
	.then( 
		res => {
			console.log("Got Data!")
			let tempAIArray = []
			let tempJoArray = []
			var item = ""
			for (item in res.data){
				const newDate = new Date(res.data[item].forDate)
				const checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+1)			
				if (res.data[item].hasAI) {
					tempAIArray.push( checkDate )
				} else {
					tempJoArray.push( checkDate )
				}
			}
			callbackFunction(tempJoArray, tempAIArray)
	})
	.catch( err => {
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					callbackFailure()
				}
			}
		}
	});
};

// Get the data for a speific date, where the user defined is in the token
export const APIGetJournalData = (APIHost, authToken, selectedDate, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	console.log("Requesting Date from Server")
	const dateReq = selectedDate.toJSON().split("T")[0]
	
	axios.get(APIHost +"/getUserJournal/?reqDate="+dateReq, config)
	.then( 
		res => {
			// What if it is > 1?
			if (res.data.length > 0) {
				console.log("obtained a journal entry")
				
				let journalContent = res.data[0].content
				//let journalBlock = res.data[0].blockData
				
				let AIData = {}
				if (res.data[0].hasAI) {
					
					AIData = res.data[0].AIresult
				}
				
				callbackFunction(journalContent, AIData)
				
			}
			else{
				console.log("No entry for that day")
				
				let journalContent = ""
				let AIData = {}
				
				callbackFunction(journalContent, AIData)
			}

	})
	.catch( err => {
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					// Force the logout stuff
					callbackFailure()
				}
			}
		}
	});
};

// Get the company list under the user, defined in the token
export const APIGetCompanyPermTree = (APIHost, authToken, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};

	axios.get(APIHost +"/getUsersViewableDivisions", config)
	.then( 	res => {
			
			// Normal behaviour
			console.log("Got the tree of companies")
			
			// Now we convert this data into a tree... Tho why not just use it as is?
			//console.log(res.data)
			
			callbackFunction(res.data)
		})
		.catch( err => {
			if (!(err === undefined)) {
				if (!(err.response === undefined)) {
					if (err.response.status === 401) {
						// Force the logout stuff
						callbackFailure()
					}
				}
			}
		});
}

export const APIGetCompanyValidDates = (APIHost, authToken, divisionID, callbackFunction, callbackFailure) => {
	
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost + "/getCompanyWeekDates?reqDiv="+divisionID, config)
	.then( 	res => {
			let tempSumArray = []
			
			console.log("Got Valid Dates!")
			//console.log(res.data)
			var item = ""
			for (item in res.data){
				
				// THESE DATES HAVE THE WRONG TIMEZONE COMING IN, SO THE RESULTING DAY CAN BE WRONG!!!!
				// CHANGE THIS!!!
				const newDate = new Date(res.data[item].forDate)
				// Move to next dat btw
				newDate.setDate(newDate.getDate()+1)
				// This is the "Anchor Date"
				if (res.data[item].hasMon) {
					tempSumArray.push( newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()) )
				}
				newDate.setDate(newDate.getDate()+1)
				if (res.data[item].hasTue) {
					tempSumArray.push( newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()) )
				}
				newDate.setDate(newDate.getDate()+1)
				if (res.data[item].hasWed) {
					tempSumArray.push( newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()) )
				}
				newDate.setDate(newDate.getDate()+1)
				if (res.data[item].hasThu) {
					tempSumArray.push( newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()) )
				}
				newDate.setDate(newDate.getDate()+1)
				if (res.data[item].hasFri) {
					tempSumArray.push( newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()) )
				}
				newDate.setDate(newDate.getDate()+1)
				if (res.data[item].hasSat) {
					tempSumArray.push( newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()) )
				}
				newDate.setDate(newDate.getDate()+1)
				if (res.data[item].hasSun) {
					tempSumArray.push( newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()) )
				}
			}
			
			callbackFunction(tempSumArray)
	})
	.catch( err => {
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					// Force the logout stuff
					callbackFailure()
				}
			}
		}
	});
}

// Get a specific company's summary for the list...
export const APIGetCompanySummary = (APIHost, authToken, divisionID, selectedDate, callbackFunction, callbackFailure) => {
	
	let todayWeekday = (selectedDate.getDay()-1)
	if (todayWeekday < 0) {
		todayWeekday = 6
	}
	
	let copiedDate = new Date(selectedDate.getTime());

	copiedDate.setDate(copiedDate.getDate()-(todayWeekday))
	const dateReq = copiedDate.toJSON().split("T")[0]

	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost +"/getCompanyWeekSummary/?reqDate="+dateReq+"&reqDiv="+divisionID, config)
	.then( 
		res => {
			// What if it is > 1?
			if (res.data.length > 0) {
				console.log("obtained a company summary")
				
				// Check for matching stuff on this end?
				//console.log(res.data[0].summaryResult)
				
				let incomingDict = {
					mon:res.data[0].monResult,
					tue:res.data[0].tueResult,
					wed:res.data[0].wedResult,
					thu:res.data[0].thuResult,
					fri:res.data[0].friResult,
					sat:res.data[0].satResult,
					sun:res.data[0].sunResult,
					allDay:res.data[0].summaryResult,
				}
				
				callbackFunction(incomingDict, dateReq)
				
			}
			else{
				callbackFunction({}, dateReq)
			}
	})
	.catch( err => {
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					// Force the logout stuff
					callbackFailure()
				}
			}
		}
	});
}

export const APIGetServerEHIData = (APIHost, authToken, targetCompany, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost +"/getCompanyEHI?reqDiv="+targetCompany, config)
	.then( 	res => {
		// Should respond with a 1 length thing
		//console.log(res)
		if (res.data.length > 0) {
			// Normal behaviour
			console.log("Got the company data!")
			
			let labelsDays = []
			let dataDays = []
			
			let labelsWeeks = []
			let dataWeeks = []
			
			let index;
			for (index in res.data[0].EHIstorage["days"]) {
				
				labelsDays.push(index)
				dataDays.push(res.data[0].EHIstorage["days"][index])
			}
			for (index in res.data[0].EHIstorage["weeks"]) {
				labelsWeeks.push(index)
				dataWeeks.push(res.data[0].EHIstorage["days"][index])
			}
			
			callbackFunction(labelsDays, dataDays, labelsWeeks, dataWeeks)
		}
		else {
			// This should not trigger
		}
	})
	.catch( err => {
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					// Force the logout stuff
					callbackFailure()
				}
			}
		}
	});
}

export const APIGetSuggestionDates = (APIHost, authToken, targetCompany, callbackFunction, callbackFailure) => {
	
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost +"/getCompanySuggestionDates?reqDiv="+targetCompany, config)
	.then( 	res => {
		// Should respond with a 1 length thing
		//console.log(res.data)
		if (res.data.length > 0) {
			// Normal behaviour
			//console.log("Got the suggestion dates!")
			//console.log(res.data)
			let datesData = []
			
			let item = ""
			for (item in res.data) {
				
				const newDate = new Date(res.data[item])
				const checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+1)		
				//console.log( checkDate )
					
				datesData.push(checkDate)
			}
			
			//console.log(datesData)
			callbackFunction(datesData)
		}
		else {
			// This should not trigger
		}
	})
	.catch( err => {
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					// Force the logout stuff
					callbackFailure()
				}
			}
		}
	});
}

export const APIGetSuggestionData = (APIHost, authToken, targetCompany, targetDate, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	const dateReq = targetDate.toJSON().split("T")[0]
	
	axios.get(APIHost +"/getCompanySuggestionData?reqDiv="+targetCompany+"&reqDate="+dateReq, config)
	.then( 	res => {
		// Should respond with a 1 length thing
		//console.log(res.data)
		
		console.log("Got the suggestion data!")
		callbackFunction(targetDate, res.data)
	})
	.catch( err => {
		if (!(err === undefined)) {
			if (!(err.response === undefined)) {
				if (err.response.status === 401) {
					// Force the logout stuff
					callbackFailure()
				}
			}
		}
	});
}