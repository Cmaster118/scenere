import axios from "axios"

const convertSummaryType = [
	"day",
	"week",
	"month",
	"year",
]

const convertDate = (date) => {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}

// Put a generalized Error Gathering here? Would save time...
const checkError = (err) => {
	if (!err.response) {
		// Network Error
	}
	else {
		// Proper response
		if (err.response.status === 401) {
			//Invalid Token
		}
		else if (err.response.status === 403) {
			//Invalid Permissions
		}
		else if (err.response.status === 400) {
			// Bad Request
		}
	}
}

// Refresh!
export const APIRefreshToken = (APIHost, sessionToken, callbackFunction, callbackFailure) => {
	const data = {
			token: sessionToken,
		};
		
		axios.post(APIHost + "/apiTokenRefresh/", data)
		.then( 	res => {
			//console.log(res)
			
			// If we get here then we should have a new token
			//console.log("Token refreshed")
			callbackFunction()
		})
		.catch( err => {
			//console.log(err)
			// Check for a specific error?
			
			this.logout()
			
			return false
		});
}	

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
		//console.log(err)
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response
			//let errCode = err.response.status
			let errData = err.response.data
			
			// First version.... Hmmmmmmmmmmm This is still too simple...
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				//console.log(errorName)
				
				if (errorName === "username") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else if (errorName === "password") {
					errCodes.push(2)
					errDatas.push(errData[errorName])
				} else if (errorName === "non_field_errors") {
					errCodes.push(3)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure(errCodes, errDatas)
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
			//console.log(err)
			if (!err.response) {
				console.log("Network Error!")
				callbackFailure([0],["Network Error"])
			}
			else {
				//let errCode = err.response.status
				let errData = err.response.data
				
				// First version.... Hmmmmmmmmmmm This is still too simple...
				let errCodes = []
				let errDatas = []
				
				for (let errorName in errData) {
					//console.log(errorName)
					
					if (errorName === "username") {
						errCodes.push(1)
						errDatas.push(errData[errorName])
					}
					else if (errorName === "password") {
						errCodes.push(2)
						errDatas.push(errData[errorName])
					} else if (errorName === "email") {
						errCodes.push(3)
						errDatas.push(errData[errorName])
					}
					else {
						errCodes.push(10)
						errDatas.push("Unknown Error")
					}
				}
				
				callbackFailure(errCodes, errDatas)
			}
		})
}

// Validator Check!
export const APIValidateAccount = (APIHost, authToken, activateToken, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	axios.get(APIHost +"/emailActivate/?token="+activateToken, config)
	.then(res => {
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
	.then(res => {
			//console.log("Got Data!")
			//console.log(res.data)
			callbackFunction()
	})
	.catch( err => {
		//console.log("Failure")
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
	.then(res => {
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

// Contact Us Email
export const APIContactUsEmail = (APIHost, firstName, lastName, email, company, content, callbackFunction, callbackFailure) => {
	const data = {
			
		firstName: firstName,
		lastName: lastName,
		
		email: email,
		company: company,
		
		content: content,		
	};

	axios.post(APIHost +"/sendContactEmail/", data )
	.then( res => { 
	
		// Successfully Sent the email, can trigger something on this side
		if (res.status === 200) {

		}
	})
	.catch( err => {
		//console.log(err.response.status)
		//console.log(err.response.data)
	})
}

// Beta Sign Up Email
export const APIBetaSignEmail = (APIHost, email, callbackFunction, callbackFailure) => {
	const data = {
		email: email,
	};

	axios.post(APIHost +"/sendBetaEmail/", data )
	.then( res => { 
	
		// Successfully Sent the email, can trigger something on this side
		if (res.status === 200) {

		}
	})
	.catch( err => {
		//console.log(err.response.status)
		//console.log(err.response.data)
	})
}


// Forgot Password Email Send!
export const APIForgotEmailSend = (APIHost, sendEmail, callbackFunction, callbackFailure) => {

	// Not logged in, so no token
	const data = {
		targetEmail: sendEmail,
	};
	
	axios.post(APIHost + "/nonAuthPassword/sendEmail/", data)
	.then(res => {
			//console.log(res)
			callbackFunction(res.status)
		}
	)
	.catch(err => {
		if (!err.response) {
			console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				//console.log(errorName)
				
				if (errorName === "email") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure(errCodes, errDatas)
		}
	});
}
// Forgot Password Validator Token Check!
export const APIForgotEmailValidate = (APIHost, passToken, callbackFunction, callbackFailure) => {

	// Not logged in, so no token
	const config = {
		
	};
	
	axios.get(APIHost + "/nonAuthPassword/validate/?token="+passToken, config)
	.then(res => {
			callbackFunction(res.status)
		}
	)
	.catch(err => {
		if (!err.response) {
			console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				//console.log(errorName)
				
				if (errorName === "status") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure(errCodes, errDatas)
		}
	});
}

// Forgot Password Password Changer!
export const APIForgotEmailChangePassword = (APIHost, passToken, password1, password2, callbackFunction, callbackFailure) => {
	// Not logged in, so no token
	const data = {
		password:password1,
		password2:password2,
		passToken:passToken,
	};
	
	axios.put(APIHost + "/nonAuthPassword/Change/", data)
	.then(res => {
			// If this triggers, we should be completly fine...
			callbackFunction(res.status)
		}
	)
	.catch(err => {
		// If THIS triggers, we are having a bad time...
		//console.log(err)
		if (!err.response) {
			console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				//console.log(errorName)
				
				if (errorName === "password") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure(errCodes, errDatas)
		}
	});
}

// Logged In Password Changer!
export const APILoggedInPasswordChanger = (APIHost, authToken, callbackFunction, callbackFailure) => {

}

// Saving of the suggestion...
export const APISaveSuggestion = (APIHost, authToken, postingDate, targetDivision, content, editorBlock, callbackFunction, callbackFailure) => {
	
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	// As UTC: postingDate.toJSON().split("T")[0]
	const data = {
		reqDiv: targetDivision,
		
		targetDivision: targetDivision,
		createdDate: convertDate( postingDate ),
		content: content,
		
		richText: editorBlock,
	};
	
	axios.post(APIHost +"/saveNewSuggestion/", data, config )
	.then( res => { 
		callbackFunction(res.data)
	})
	.catch( err => {
		// Change this depending on the error...?
		if (!err.response) {
			console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			//console.log(err)
			if (err.response.status === 401) {
				callbackFailure([401],["Invalid Token"])
			}
			else if (err.response.status === 403) {
				callbackFailure([3],["You do not have permission to post to this!"])
			}
			else {
				let errData = err.response.data
				//let errCode = err.response.status
				
				let errCodes = []
				let errDatas = []
				
				for (let errorName in errData) {
					//console.log(errorName)
					
					// Not a valid Error
					if (errorName === "targetDivision") {
						errCodes.push(10)
						errDatas.push(errData[errorName])
					}
					else {
						errCodes.push(10)
						errDatas.push("Unknown Error")
					}
				}
				
				callbackFailure(errCodes,errDatas)
			}
		}
	})
}

// Save the journal data...
export const APISaveJournal = (APIHost, authToken, postingDate, promptValue, content, editorBlock, callbackFunction, callbackFailure) => {
		
	const randomID = Math.random().toString(16).substr(2, 8);
	
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	const data = {
		shorthand: 'made from the website: '+randomID,
		
		// Author is filled in based on your Token on the server side...
		// The timezone on the server is different.....
		forDate: convertDate( postingDate ),

		usedPromptKeyText: promptValue,

		content: content,
		richText: editorBlock,
	};
	
	//console.log(data)
	
	axios.post(APIHost +"/saveUserJournal/", data, config )
	.then( res => { 
		callbackFunction(res.data)
	})
	.catch( err => {
		// Change this depending on the error...?
		
		if (!(err === undefined)) {
			if (err.response.status === 401) {
				callbackFailure([401], ['Invalid Token'])
			}
			else {
				let errData = err.response.data
				//let errCode = err.response.status
		
				let errCodes = []
				let errDatas = []
				
				for (let errorName in errData) {
					//console.log(errorName)
					//console.log(errData)
					if (errorName === "author" || errorName === "non_field_errors") {
						errCodes.push(3)
						errDatas.push(errData[errorName])
					}
					else {
						errCodes.push(10)
						errDatas.push("Unknown Error")
					}
				}
				
				callbackFailure(errCodes,errDatas)
			}
		}
	})
}

export const APIGetJournalPrompts = (APIHost, authToken, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	axios.get(APIHost +"/getValidPrompts", config)
	.then( 
		res => {
			// This should be ok for now?
			callbackFunction( res.data )
	})
	.catch( err => {
		if (!err.response) {
			console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			//console.log(err)
			if (err.response.status === 401) {
				callbackFailure([401],["Invalid Token"])
			}
			else if (err.response.status === 403) {
				callbackFailure([3],["You do not have permission!"])
			}
			else {
				let errData = err.response.data
				//let errCode = err.response.status
				
				let errCodes = []
				let errDatas = []
				
				for (let errorName in errData) {
					
					// Not a valid Error
					if (errorName === "???") {
						errCodes.push(10)
						errDatas.push(errData[errorName])
					}
					else {
						errCodes.push(10)
						errDatas.push("Unknown Error")
					}
				}
				
				callbackFailure(errCodes,errDatas)
			}
		}
	});
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
			//console.log("Got Data!")
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
	
	//console.log("Requesting Date from Server")
	const dateReq = selectedDate.toJSON().split("T")[0]
	
	axios.get(APIHost +"/getUserJournal/?reqDate="+dateReq, config)
	.then( 
		res => {
			//console.log(res.data)
			let promptSet = []
			let contentSet = []
			let blockSet = []
			let AISet = []
			
			for (let index in res.data) {
			
				promptSet.push(res.data[index].usedPromptKey)
				contentSet.push(res.data[index].content)
				blockSet.push(res.data[index].richText)
				
				let AIData = {}
				if (res.data[index].hasAI) {
					AIData = res.data[index].AIresult
				}
				AISet.push(AIData)
			}
			
			callbackFunction(promptSet, contentSet, blockSet, AISet)

	})
	.catch( err => {

			if (!err.response) {
				console.log("Network Error!")
				callbackFailure([0],["Network Error"])
			}
			else {
				//let errData = err.response.data
				let errCode = err.response.status
				
				/*let errCodes = []
				let errDatas = []
				
				for (let errorName in errData) {
					//console.log(errorName)
					
					if (errorName === "password") {
						errCodes.push(1)
						errDatas.push(errData[errorName])
					}
					else {
						errCodes.push(10)
						errDatas.push("Unknown Error")
					}
				}*/
				
				// Currently I have this as still being Logout...
				if (errCode === 401) {	
					callbackFailure([401],["Unauthorized"])
				}
			}
	});
};

// Get the company list under the user, defined in the token
export const APIGetUsersPermTree = (APIHost, authToken, reqPerms, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};

	axios.get(APIHost +"/getUsersPermissionTree?reqPerms="+reqPerms, config)
	.then( 	res => {
			
			// Normal behaviour
			//console.log("Got the tree of companies")
			// Now we convert this data into a tree... Tho why not just use it as is?
			//console.log(res.data)
			
			callbackFunction(res.data["tree"], res.data["nameList"], res.data["idList"])
		})
		.catch( err => {
			if (!err.response) {
				console.log("Network Error!")
				callbackFailure([0],["Network Error"])
			}
			else {
				//let errData = err.response.data
				let errCode = err.response.status
				
				/*let errCodes = []
				let errDatas = []
				
				for (let errorName in errData) {
					//console.log(errorName)
					
					if (errorName === "password") {
						errCodes.push(1)
						errDatas.push(errData[errorName])
					}
					else {
						errCodes.push(10)
						errDatas.push("Unknown Error")
					}
				}*/
				
				// Currently I have this as still being Logout...
				if (errCode === 401) {	
					callbackFailure([401],["Unauthorized"])
				}
			}
		});
}

export const APIGetCompanyValidDates = (APIHost, authToken, divisionID, callbackFunction, callbackFailure) => {
	
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost + "/getCompanyDates/?reqDiv="+divisionID, config)
	.then( 	res => {
			let tempObjectSorter = {}
			
			//console.log("Got Valid Dates!")
			var item = ""
			for (item in res.data){
				
				// These dates may be off... I will need to check HOW and WHY.... Because we will need to get the dates from this side..
				
				let typeName = convertSummaryType[ res.data[item].summaryType ]

				if ( !(typeName in tempObjectSorter) ) {
					tempObjectSorter[typeName] = []
				}
				tempObjectSorter[typeName].push( res.data[item].forDate )
			}
			callbackFunction(tempObjectSorter)
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
export const APIGetCompanySummary = (APIHost, authToken, divisionID, summaryType, selectedDate, callbackFunction, callbackFailure) => {
	
	let copiedDate = new Date(selectedDate.getTime());
	const dateReq = copiedDate.toJSON().split("T")[0]

	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost +"/getCompanySummary/?reqDate="+dateReq+"&reqDiv="+divisionID+"&type="+summaryType, config)
	.then( 
		res => {
			//console.log(res.data)

			/*for (let index in res.data) {
				console.log("obtained a company summary")
			}*/

			if (res.data.length > 0) {
				callbackFunction(res.data[0], summaryType)
			}
			else {
				//callbackFailure()
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
	
	axios.get(APIHost +"/getCompanyEHI/?reqDiv="+targetCompany, config)
	.then( 	res => {
		// Should respond with a 1 length thing
		//console.log(res.data)
		if (res.data.length > 0) {
			// Normal behaviour
			//console.log("Got the company EHI data!")
			
			callbackFunction(res.data[0]["EHIstorage"])
		}
		else {
			// This should not trigger
			callbackFailure()
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
	
	axios.get(APIHost +"/getCompanySuggestionDates/?reqDiv="+targetCompany, config)
	.then( 	res => {
		
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
		
		//console.log("Got the suggestion data!")
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

// CREATING a new invite from the Company Settings Page
export const APIDivisionInvitesCreate = (APIHost, authToken, targetDivision, targetInvite, targetAction, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	const data = {
		reqDiv:targetDivision,
		targetUser:targetInvite,
		targetAction:targetAction,
	}
	
	axios.post(APIHost +"/createDivisionInvite/", data, config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			//let errCode = err.response.status
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

// GETTING a divisions Invites, NOT THE HEAD ONE!
export const APIDivisionInvitesSet = (APIHost, authToken, targetDivision, targetInvite, targetAction, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	const data = {
		reqDiv:targetDivision,
		targetInvite:targetInvite,
		targetAction:targetAction,
	}
	
	axios.put(APIHost +"/setDivisionInvite/", data, config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			//let errCode = err.response.status
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

// GETTING a divisions Invites, NOT THE HEAD ONE!
export const APIDivisionInvitesGet = (APIHost, authToken, targetCompany, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost +"/getDivisionInvites?reqDiv="+targetCompany, config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction(succData)
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			//let errCode = err.response.status
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

// GETTING a divisions profile, NOT THE HEAD ONE!
export const APIDivisionSettingsGet = (APIHost, authToken, targetCompany, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost +"/getDivisionData?reqDiv="+targetCompany, config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data[0]

		callbackFunction(succData)
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			//let errCode = err.response.status
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

// SAVING an edited division's profile, NOT THE HEAD ONE! THAT IS LATER!
export const APIDivisionSettingsEdit = (APIHost, authToken, dataSet, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	//const data = {
		
	//};
	
	const data = dataSet
	
	axios.put(APIHost +"/setDivisionData/", data, config)
	.then( 	res => {
		
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction(succData)
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			//let errCode = err.response.status
			//let errData = err.response.data
			//console.log(errData)
			
			let errCodes = []
			let errDatas = []
			
			/*for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}*/
			
			callbackFailure( errCodes, errDatas )
		}
	});
	
}

export const APIUserSettingsEdit = (APIHost, authToken, dataSet, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	//const data = {
		
	//};
	
	const data = dataSet
	
	axios.put(APIHost +"/setUserProfileData/", data, config)
	.then( 	res => {
		
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction(succData)
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			//let errCode = err.response.status
			//let errData = err.response.data
			//console.log(errData)
			
			let errCodes = []
			let errDatas = []
			
			/*for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}*/
			
			callbackFailure( errCodes, errDatas )
		}
	});
	
}

// Sign up for the company's governed list that matches this code...
export const APIUserInviteCode = (APIHost, authToken, inviteCode, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	//let data = {
	//	
	//}

	axios.get(APIHost +"/useDivisionInvite?joinCode="+inviteCode, config)
	.then( 	res => {
		// Should respond with a 1 length thing
		//let succCode = res.response.status
		let succData = res.response.data
		//console.log(res.data)

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response
			//let errCode = err.response.status
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				//console.log(errorName)
				
				if (errorName === "dup") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else if (errorName === "token") {
					errCodes.push(2)
					errDatas.push(errData[errorName])
				}
				else if (errorName === "invite") {
					errCodes.push(3)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

// Get the invites!
export const APIUserInvitesGet = (APIHost, authToken, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};

	axios.get(APIHost +"/getUsersInvites", config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction(succData)
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			//let errCode = err.response.status
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

// Set the invites!
export const APIUserInvitesSet = (APIHost, authToken, targetInvite, targetAction, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	const data = {
		targetInvite:targetInvite,
		targetAction:targetAction,
	}
	
	axios.put(APIHost +"/setUserInvite/", data, config)
	.then( 	res => {
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			//console.log("Network Error!")
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			//let errCode = err.response.status
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

export const APIGetUserDetails = (APIHost, authToken, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost +"/getUserDetails/", config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			let errCode = err.response.status
			if (errCode === 500) {
				callbackFailure( [10], ["Server Error"] )
			}
			
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

export const APIChangeUserEmail = (APIHost, authToken, newEmail, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	// Verify data before we do this?
	const data = {
		email:newEmail,
	}
	
	axios.put(APIHost +"/updateUserEmail/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		//console.log(err)
		if (!err.response) {
			// network Error
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			let errCode = err.response.status
			if (errCode === 500) {
				callbackFailure( [10], ["Server Error"] )
			}
			
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

export const APIChangeUserName = (APIHost, authToken, newFirst, newLast, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	// Verify data before we do this?
	const data = {
		first_name:newFirst,
		last_name:newLast,
	}
	
	axios.put(APIHost +"/updateUserName/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...

		if (!err.response) {
			// network Error
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			let errCode = err.response.status
			if (errCode === 500) {
				callbackFailure( [10], ["Server Error"] )
			}
			
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

export const APIChangeUserPassword = (APIHost, authToken, newPass, oldPass, oldPass2, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	// Verify data before we do this?
	const data = {
		oldPassword:newPass,
		password:oldPass,
		password2:oldPass2,
	}
	
	axios.put(APIHost +"/updateUserPassword/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...

		if (!err.response) {
			// network Error
			callbackFailure([0],["Network Error"])
		}
		else {
			// proper response... Still not liking this....
			let errCode = err.response.status
			if (errCode === 500) {
				callbackFailure( [10], ["Server Error"] )
			}
			
			let errData = err.response.data
			
			let errCodes = []
			let errDatas = []
			
			for (let errorName in errData) {
				if (errorName === "???") {
					errCodes.push(1)
					errDatas.push(errData[errorName])
				}
				else {
					errCodes.push(10)
					errDatas.push("Unknown Error")
				}
			}
			
			callbackFailure( errCodes, errDatas )
		}
	});
}

export const APIGetSearchPrompts = (APIHost, authToken, searchTerm, searchType, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost +"/searchPrompts/?queryText=" + searchTerm + "&queryType=" + searchType, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		
		checkError(err)
		let errCodes = []
		let errDatas = []
		
		callbackFailure( errCodes, errDatas )
		
	})
}

export const APIGetDivisionEvents = (APIHost, authToken, divisionID, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	axios.get(APIHost +"/getDivisionEvents/?reqDiv="+divisionID, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data
		
		for (let index in succData) {
			let isEnabled = false
			if ( succData[index]["usedBy"].find(element => element === Number(divisionID)) !== undefined ) {
				isEnabled = true
			}
			succData[index]["usedBy"] = isEnabled
			succData[index]["fromServer"] = true
		}
		

		callbackFunction( succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		
		checkError(err)
		let errCodes = []
		let errDatas = []
		
		callbackFailure( errCodes, errDatas )
		
	})
}

export const APISetDivisionEvents = (APIHost, authToken, savedID, incomingId, incomingDivision, incomingEnabledDiv, incomingEnabled, incomingType, incomingPrompts, callbackFunction, callbackFailure) => {

	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	const data = {
		// Supply an ID to update...
		// If this is here, its an update, if it is NOT, its a create
		id: incomingId,
		reqDiv: incomingDivision,
		
		enabledDiv: incomingEnabledDiv,
		enabled: incomingEnabled,
		triggerType: incomingType,
		promptSet: incomingPrompts,
	}
	
	axios.post(APIHost +"/setDivisionEvents/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( savedID, succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		
		checkError(err)
		let errCodes = []
		let errDatas = []
		
		callbackFailure( savedID, errCodes, errDatas )
		
	})
}

export const APIDeleteDivisionEvents = (APIHost, authToken, savedID, incomingId, incomingDivision, callbackFunction, callbackFailure) => {

	const config = {
		headers: { Authorization: `JWT ${authToken}` }
	};
	
	const data = {
		// Supply an ID to update...
		// If this is here, its an update, if it is NOT, its a create
		id: incomingId,
		reqDiv: incomingDivision,
	}
	
	axios.post(APIHost +"/deleteDivisionEvents/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( savedID, succData )
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		
		checkError(err)
		let errCodes = []
		let errDatas = []
		
		callbackFailure( savedID, errCodes, errDatas )
		
	})
}