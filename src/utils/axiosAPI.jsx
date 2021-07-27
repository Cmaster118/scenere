import axios from "axios"

// Change this over!
const hostName = "https://cmaster.pythonanywhere.com"
//const hostName = "http://10.0.0.60:8000"

const axiosInstance = axios.create({
	baseURL: hostName,
	//headers: {'CSRF-TOKEN': getCookie('csrftoken')}
});

let accessToken = ""
let refreshToken = ""

export const setAccessToken = (token) => {
	accessToken = token
}
export const setRefreshToken = (token) => {
	refreshToken = token
}

/*
export const showTokens = () => {
	return [accessToken, refreshToken]
}
*/

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
// Maybe, I should keep ALLLLL data related to API stuff over here
// All reformats...

// Put a generalized Error Gathering here? Would save time...
// I would LOVE to make it so that all the general stuf happens in here, but I have yet to figure that out...
const checkError = (err) => {
	//console.log(err)
	// So.... Should I use my [ Action, Display ]
	// Or, should I simplify just to [ Action ]
	if (!err.response) {
		// Network Error
		return {'action':0, 'messages':[ {'mod':-1, 'text':"Newtork Error"} ]}
	}
	else {
		let errStatus = err.response.status
		let errData = err.response.data
		
		// Proper response
		if (errStatus === 401) {
			// Unauthorized
			// Trigger the LOGOUT function
			
			for (let errorName in errData) {
				if (errData[errorName] === "No active account found with the given credentials") {
					return {'action':3, 'messages':[ {'mod':3, 'text':errData[errorName]} ]}
				}
			}
			
			return {'action':1, 'messages':[ {'mod':1, 'text':"Try That Again!"} ]}
		}
		else if (errStatus === 403) {
			// Invalid Permissions, find out what it is
			// ALSO, remember! if it is a DEACTIVATED account, then it is different!
			return {'action':2, 'messages':[ {'mod':-1, 'text':"Permission Failed"} ]}
		}
		else if (errStatus === 400) {
			// Bad Request, sort out so its just a single number set...
			let errorSet = []
			
			for (let errorName in errData) {
				if (errorName === "username") {
					errorSet.push( {'mod':1, 'text':errData[errorName]} )
				}
				else if (errorName === "password") {
					errorSet.push( {'mod':2, 'text':errData[errorName]} )
				} 
				else if (errorName === "non_field_errors") {
					errorSet.push( {'mod':3, 'text':errData[errorName]} )
				}
				else if (errorName === "email") {
					errorSet.push( {'mod':4, 'text':errData[errorName]} )
				}
				else if (errorName === "dup") {
					errorSet.push( {'mod':5, 'text':errData[errorName]} )
				}
				else if (errorName === "token") {
					errorSet.push( {'mod':6, 'text':errData[errorName]} )
				}
				else if (errorName === "invite") {
					errorSet.push( {'mod':7, 'text':errData[errorName]} )
				}
				else if (errorName === "status") {
					errorSet.push( {'mod':8, 'text':errData[errorName]} )
				}
				else {
					errorSet.push( {'mod':0, 'text':errData[errorName]} )
				}
			}
			
			return {'action':3, 'messages':errorSet}
		}
		else if (errStatus === 500) {
			// Internal Server Error! Show why in the console!
			return {'action':4, 'messages':[ {'mod':-1, 'text':"Server Error!"} ]}
		}
		else {
			// Anything I have not determined...
			// Raw display
			return {'action':5, 'messages':[ {'mod':-1, 'text':"Unhandled Response! Error!"} ]}
		}
	}
}

// Refresh!
export const APIRefreshToken = (callbackFunction, callbackFailure, callbackRetrySignal) => {
	const data = {
		refresh: refreshToken,
	};
	
	axiosInstance.post("/api/refreshToken/", data)
	.then( 	res => {
		//console.log(res)
		
		// If we get here then we should have a new token
		//console.log("Token refreshed")
		callbackFunction(res.data, callbackRetrySignal)
	})
	.catch( err => {
		// Check for a specific error?
		let result = checkError(err, callbackRetrySignal)
		//console.log(result)
		
		callbackFailure(result)
	});
}	

// Sign In!
export const APISignIn = (isUserOrEmail, requestUsername, requestPassword, callbackFunction, callbackFailure) => {
	let data = {
		password: requestPassword,
	};
	
	if (isUserOrEmail) {
		data["email"] = requestUsername
	}
	else {
		data["username"] = requestUsername
	}
	
	//apiTokenAuth
	axiosInstance.post("/api/getToken/", data )
	.then( res => {
		//console.log(res.data)
		//let outData = res.data.access
		callbackFunction(res.data)
	})
	.catch( err => {
		// Find out what error it was, then change the sign in page accordingly by the by...
		let result = checkError(err)
		//console.log(result)

		callbackFailure(result)
	})
}

// Sign Up!
export const APISignUp = (requestUsername, requestPassword1, requestPassword2, email, firstName, lastName, callbackFunction, callbackFailure) => {
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
	axiosInstance.post("/registerUser/", data )
	.then( res => { 
		//res.data
		let outData = res.status
		callbackFunction(outData)
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		
		callbackFailure(result)
	})
}

// Validator Check!
export const APIValidateAccount = (activateToken, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	axiosInstance.get("/emailActivate/?token="+activateToken, config)
	.then(res => {
			callbackFunction(res.status, res.data)
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		
		callbackFailure(result)
	});
}

// Resend Validation Email!
export const APIResendValidator = (callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	axiosInstance.get("/emailVerifyResend", config)
	.then(res => {
			//console.log("Got Data!")
			//console.log(res.data)
			callbackFunction()
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// Check if the user is active!
export const APICheckActive = (callbackFunction, callbackFailure) => {
	const config = {
		headers: { 
			Authorization: `JWT ${accessToken}`,
			'Content-Type': 'application/json',
			'accept': 'application/json'
		}
	};
	
	axiosInstance.get("/userIsActive", config)
	.then(res => {
		callbackFunction(res.data[0].isActive)
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		
		callbackFailure(result)
	});
}

// Contact Us Email
export const APIContactUsEmail = (firstName, lastName, email, company, content, callbackFunction, callbackFailure) => {
	const data = {
			
		firstName: firstName,
		lastName: lastName,
		
		email: email,
		company: company,
		
		content: content,		
	};

	axiosInstance.post("/sendContactEmail/", data )
	.then( res => { 
	
		// Successfully Sent the email, can trigger something on this side
		if (res.status === 200) {

		}
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	})
}

// Beta Sign Up Email
export const APIBetaSignEmail = (email, callbackFunction, callbackFailure) => {
	const data = {
		email: email,
	};

	axiosInstance.post("/sendBetaEmail/", data )
	.then( res => { 
	
		// Successfully Sent the email, can trigger something on this side
		if (res.status === 200) {

		}
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	})
}


// Forgot Password Email Send!
export const APIForgotEmailSend = (sendEmail, callbackFunction, callbackFailure) => {

	// Not logged in, so no token
	const data = {
		targetEmail: sendEmail,
	};
	
	axiosInstance.post("/nonAuthPassword/sendEmail/", data)
	.then(res => {
			//console.log(res)
			callbackFunction(res.status)
		}
	)
	.catch(err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}
// Forgot Password Validator Token Check!
export const APIForgotEmailValidate = (passToken, callbackFunction, callbackFailure) => {

	// Not logged in, so no token
	const config = {
		
	};
	
	axiosInstance.get("/nonAuthPassword/validate/?token="+passToken, config)
	.then(res => {
			callbackFunction(res.status)
		}
	)
	.catch(err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// Forgot Password Password Changer!
export const APIForgotEmailChangePassword = (passToken, password1, password2, callbackFunction, callbackFailure) => {
	// Not logged in, so no token
	const data = {
		password:password1,
		password2:password2,
		passToken:passToken,
	};
	
	axiosInstance.put("/nonAuthPassword/Change/", data)
	.then(res => {
			// If this triggers, we should be completly fine...
			callbackFunction(res.status)
		}
	)
	.catch(err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// Logged In Password Changer!
export const APILoggedInPasswordChanger = (callbackFunction, callbackFailure) => {

}

// Saving of the suggestion...
export const APISaveSuggestion = (postingDate, targetDivision, content, editorBlock, callbackFunction, callbackFailure) => {
	
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	// As UTC: postingDate.toJSON().split("T")[0]
	const data = {
		reqDiv: targetDivision,
		
		targetDivision: targetDivision,
		createdDate: convertDate( postingDate ),
		content: content,
		
		richText: editorBlock,
	};
	
	axiosInstance.post("/saveNewSuggestion/", data, config )
	.then( res => { 
		callbackFunction(res.data)
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	})
}

// Save the journal data...
export const APISaveJournal = (postingDate, promptValue, content, editorBlock, callbackFunction, callbackFailure) => {
		
	const randomID = Math.random().toString(16).substr(2, 8);
	
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
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
	
	axiosInstance.post("/saveUserJournal/", data, config )
	.then( res => { 
		callbackFunction(res.data)
	})
	.catch( err => {
		// Change this depending on the error...?
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	})
}

// Save the Non-journal data...
export const APISaveNonJournal = (postingDate, promptValue, incomingData, callbackFunction, callbackFailure) => {
		
	const randomID = Math.random().toString(16).substr(2, 8);
	
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	const data = {
		shorthand: 'made from the website: '+randomID,
		
		// Author is filled in based on your Token on the server side...
		// The timezone on the server is different.....
		forDate: convertDate( postingDate ),

		usedPromptKeyText: promptValue,

		chosenValue: incomingData,
	};
	//console.log(data)
	axiosInstance.post("/saveUserNonJournal/", data, config )
	.then( res => { 
		callbackFunction(res.data)
	})
	.catch( err => {
		// Change this depending on the error...?
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	})
}

export const APIGetJournalPrompts = (callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	axiosInstance.get("/getValidPrompts", config)
	.then( 
		res => {
			// This should be ok for now?
			callbackFunction( res.data )
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// Get the dates for a specific user, defined in the auth token
// I may have to redo this?
export const APIGetJournalDates = (callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getJournalDates", config)
	.then( 
		res => {
			//console.log("Got Data!")
			
			let todayDateFull = new Date()
			let todayDate = todayDateFull.getFullYear()+"-"+todayDateFull.getMonth()+"-"+(todayDateFull.getDate())

			let tempAIObject = []
			let tempJoObject = []
			
			for (let item in res.data){
				const newDate = new Date(res.data[item].forDate)
				const checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+1)	
				
				if (res.data[item].hasAI) {
					if (checkDate in tempJoObject) {
						tempAIObject[checkDate].push( res.data[item].usedPromptKey )
					}
					else {
						tempAIObject[checkDate] = [ res.data[item].usedPromptKey ]
					}
					
					if (todayDate === checkDate) {
						if ("today" in tempAIObject) {
							tempAIObject["today"].push( res.data[item].usedPromptKey )
						}
						else {
							tempAIObject["today"] = [ res.data[item].usedPromptKey ]
						}
					}
				} else {
					if (checkDate in tempJoObject) {
						tempJoObject[checkDate].push( res.data[item].usedPromptKey )
					}
					else {
						tempJoObject[checkDate] = [ res.data[item].usedPromptKey ]
					}
					
					if (todayDate === checkDate) {
						if ("today" in tempJoObject) {
							tempJoObject["today"].push( res.data[item].usedPromptKey )
						}
						else {
							tempJoObject["today"] = [ res.data[item].usedPromptKey ]
						}
					}
				}
			}
			callbackFunction(tempJoObject, tempAIObject)
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		
		callbackFailure(result)
	});
};

export const APIGetNonJournalDates = (callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	axiosInstance.get("/getNonJournalDates", config)
	.then( 
		res => {
			//console.log("Got Data!")
			let todayDateFull = new Date()
			let todayDate = todayDateFull.getFullYear()+"-"+todayDateFull.getMonth()+"-"+(todayDateFull.getDate())
			
			let tempJoObject = []
			for (let item in res.data){
				const newDate = new Date(res.data[item].forDate)
				const checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+1)
				
				if (checkDate in tempJoObject) {
					tempJoObject[checkDate].push( res.data[item].usedPromptKey )
				}
				else {
					tempJoObject[checkDate] = [ res.data[item].usedPromptKey ]
				}
				
				if (todayDate === checkDate) {
					if ("today" in tempJoObject) {
						tempJoObject["today"].push( res.data[item].usedPromptKey )
					}
					else {
						tempJoObject["today"] = [ res.data[item].usedPromptKey ]
					}
				}
			}
			callbackFunction(tempJoObject)
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		
		callbackFailure(result)
	});
};

// Get the data for a speific date, where the user defined is in the token
export const APIGetJournalData = (selectedDate, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	//console.log("Requesting Date from Server")
	const dateReq = selectedDate.toJSON().split("T")[0]
	
	axiosInstance.get("/getUserJournal/?reqDate="+dateReq, config)
	.then( 
		res => {
			//console.log(res.data)
			/*
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
			*/
			
			callbackFunction(res.data)

	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
};

export const APIGetNonJournalData = (selectedDate, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	//console.log("Requesting Date from Server")
	const dateReq = selectedDate.toJSON().split("T")[0]
	
	axiosInstance.get("/getUserNonJournal/?reqDate="+dateReq, config)
	.then( 
		res => {
			//console.log(res.data)
			callbackFunction(res.data)

	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
};

// Get the company list under the user, defined in the token
export const APIGetUsersPermTree = (reqPerms, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};

	axiosInstance.get("/getUsersPermissionTree?reqPerms="+reqPerms, config)
	.then( 	res => {
			
			// Normal behaviour
			//console.log("Got the tree of companies")
			// Now we convert this data into a tree... Tho why not just use it as is?
			//console.log(res.data)
			
			// Convert the stuff... I am not going to need trees honestly...
			
			callbackFunction(res.data["divList"])
		})
		.catch( err => {
			
			let result = checkError(err)
			//console.log(result)
			callbackFailure(result)
		});
}

export const APIGetCompanyValidDates = (divisionID, callbackFunction, callbackFailure) => {
	
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getCompanyDates/?reqDiv="+divisionID, config)
	.then( 	res => {
			// This is highly likely to be unneeded
			let tempObjectSorter = {}
			
			//console.log("Got Valid Dates!")
			var item = ""
			for (item in res.data){
				
				// These dates may be off... I will need to check HOW and WHY.... Because we will need to get the dates from this side..
				
				let typeName = convertSummaryType[ res.data[item].summaryType ]

				if ( !(typeName in tempObjectSorter) ) {
					tempObjectSorter[typeName] = []
				}
				tempObjectSorter[typeName].push( {'date':res.data[item].forDate, 'num':res.data[item].hasPrompts} )
			}
			
			//console.log(res.data)
			//console.log(tempObjectSorter)
			callbackFunction(tempObjectSorter)
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// Get a specific company's summary for the list...
export const APIGetCompanySummary = (divisionID, summaryType, selectedDate, callbackFunction, callbackFailure) => {
	
	let copiedDate = new Date(selectedDate.getTime());
	const dateReq = copiedDate.toJSON().split("T")[0]

	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getCompanySummary/?reqDate="+dateReq+"&reqDiv="+divisionID+"&type="+summaryType, config)
	.then( 
		res => {
			//console.log(res.data)

			/*for (let index in res.data) {
				console.log("obtained a company summary")
			}*/

			callbackFunction(res.data[0], summaryType)
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

export const APIGetServerEHIData = (targetCompany, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getCompanyEHI/?reqDiv="+targetCompany, config)
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
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

export const APIGetSuggestionDates = (targetCompany, callbackFunction, callbackFailure) => {
	
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getCompanySuggestionDates/?reqDiv="+targetCompany, config)
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
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

export const APIGetSuggestionData = (targetCompany, targetDate, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	const dateReq = targetDate.toJSON().split("T")[0]
	
	axiosInstance.get("/getCompanySuggestionData?reqDiv="+targetCompany+"&reqDate="+dateReq, config)
	.then( 	res => {
		// Should respond with a 1 length thing
		//console.log(res.data)
		
		//console.log("Got the suggestion data!")
		callbackFunction(targetDate, res.data)
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// CREATING a new invite from the Company Settings Page
export const APIDivisionInvitesCreate = (targetDivision, targetInvite, targetAction, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	const data = {
		reqDiv:targetDivision,
		targetUser:targetInvite,
		targetAction:targetAction,
	}
	
	axiosInstance.post("/createDivisionInvite/", data, config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// GETTING a divisions Invites, NOT THE HEAD ONE!
export const APIDivisionInvitesSet = (targetDivision, targetInvite, targetAction, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	const data = {
		reqDiv:targetDivision,
		targetInvite:targetInvite,
		targetAction:targetAction,
	}
	
	axiosInstance.put("/setDivisionInvite/", data, config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// GETTING a divisions Invites, NOT THE HEAD ONE!
export const APIDivisionInvitesGet = (targetCompany, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getDivisionInvites?reqDiv="+targetCompany, config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction(succData)
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// GETTING a divisions profile, NOT THE HEAD ONE!
export const APIDivisionSettingsGet = (targetCompany, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getDivisionData?reqDiv="+targetCompany, config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data[0]

		callbackFunction(succData)
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// SAVING an edited division's profile, NOT THE HEAD ONE! THAT IS LATER!
export const APIDivisionSettingsEdit = (dataSet, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	//const data = {
		
	//};
	
	const data = dataSet
	
	axiosInstance.put("/setDivisionData/", data, config)
	.then( 	res => {
		
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction(succData)
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
	
}

export const APIUserSettingsEdit = (dataSet, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	//const data = {
		
	//};
	
	const data = dataSet
	
	axiosInstance.put("/setUserProfileData/", data, config)
	.then( 	res => {
		
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction(succData)
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
	
}

// Sign up for the company's governed list that matches this code...
export const APIUserInviteCode = (inviteCode, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	//let data = {
	//	
	//}

	axiosInstance.get("/useDivisionInvite?joinCode="+inviteCode, config)
	.then( 	res => {
		// Should respond with a 1 length thing
		//let succCode = res.response.status
		let succData = res.response.data
		//console.log(res.data)

		callbackFunction( succData )
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// Get the invites!
export const APIUserInvitesGet = (callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};

	axiosInstance.get("/getUsersInvites", config)
	.then( 	res => {
		//console.log(res)
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction(succData)
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

// Set the invites!
export const APIUserInvitesSet = (targetInvite, targetAction, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	const data = {
		targetInvite:targetInvite,
		targetAction:targetAction,
	}
	
	axiosInstance.put("/setUserInvite/", data, config)
	.then( 	res => {
		// I am clearly not thinking these through correctly...
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

export const APIGetUserDetails = (callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getUserDetails/", config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

export const APIChangeUserEmail = (newEmail, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	// Verify data before we do this?
	const data = {
		email:newEmail,
	}
	
	axiosInstance.put("/updateUserEmail/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

export const APIChangeUserName = (newFirst, newLast, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	// Verify data before we do this?
	const data = {
		first_name:newFirst,
		last_name:newLast,
	}
	
	axiosInstance.put("/updateUserName/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
}

export const APIChangeUserPassword = (newPass, oldPass, oldPass2, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	// Verify data before we do this?
	const data = {
		oldPassword:newPass,
		password:oldPass,
		password2:oldPass2,
	}
	
	axiosInstance.put("/updateUserPassword/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
		
	});
}

export const APIGetSearchPrompts = (searchTerm, searchType, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/searchPrompts/?queryText=" + searchTerm + "&queryType=" + searchType, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( succData )
	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	})
}

export const APIGetDivisionEvents = (divisionID, callbackFunction, callbackFailure) => {
		
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getDivisionEvents/?reqDiv="+divisionID, config)
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
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)		
	})
}

export const APISetNonDivisionEvents = (savedID, incomingId, incomingDivision, incomingEnabledDiv, callbackFunction, callbackFailure) => {

	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	const data = {
		// Supply an ID to update...
		// If this is here, its an update, if it is NOT, its a create
		id: incomingId,
		reqDiv: incomingDivision,
		
		enabledDiv: incomingEnabledDiv,
	}
	
	axiosInstance.post("/setNonDivisionEvents/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( savedID, succData )
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
		
		//callbackFailure( savedID, errCodes, errDatas )
		
	})
}

export const APISetDivisionEvents = (savedID, incomingId, incomingDivision, incomingEnabledDiv, incomingEnabled, incomingType, incomingPrompts, callbackFunction, callbackFailure) => {

	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
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
	
	axiosInstance.post("/setDivisionEvents/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( savedID, succData )
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
		
		//callbackFailure( savedID, errCodes, errDatas )
		
	})
}

export const APIDeleteDivisionEvents = (savedID, incomingId, incomingDivision, callbackFunction, callbackFailure) => {

	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	const data = {
		// Supply an ID to update...
		// If this is here, its an update, if it is NOT, its a create
		id: incomingId,
		reqDiv: incomingDivision,
	}
	
	axiosInstance.post("/deleteDivisionEvents/", data, config)
	.then( 	res => {
		//let succCode = res.status
		let succData = res.data

		callbackFunction( savedID, succData )
	})
	.catch( err => {
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
		
		//callbackFailure( savedID, errCodes, errDatas )
		
	})
}

// Gatting the Web Dates from the server!
export const APIGetDivisionWebDates = (divisionID, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	axiosInstance.get("/getWebDates/?reqDiv="+divisionID, config)
	.then( 
		res => {
			if (res.data.length > 0) {
				callbackFunction(res.data)
			}
			else {
				callbackFailure({'mod':37, 'text':"No Data to read!"})
			}

	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
};

// Gatting the Web from the server!
export const APIGetDivisionWeb = (divisionID, targetDate, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	let dateReq = "recent"
	if (!(targetDate === undefined)) {
		dateReq = targetDate.toJSON().split("T")[0]
	}
	
	axiosInstance.get("/getWebData/?reqDiv="+divisionID+"&reqDate="+dateReq, config)
	.then( 
		res => {
			//console.log(res.data)
			if (res.data.length > 0) {
				callbackFunction(res.data[0])
			}
			else {
				callbackFailure({'mod':37, 'text':"No Data to read!"})
			}

	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
};

// This is for our testing!
export const APIGetEmailAIData = (requestID, callbackFunction, callbackFailure) => {
	const config = {
		headers: { Authorization: `JWT ${accessToken}` }
	};
	
	//!! IS THE EMAIL ID ACTUALLY SECRET? !!
	//!! CHANGE THIS TO A POST IF SO!!
	
	axiosInstance.get("/getEmailScan/?emailID="+requestID, config)
	.then( 
		res => {
			//console.log(res.data)
			if (res.data.length > 0) {
				callbackFunction(res.data[0])
			}
			else {
				callbackFailure({'mod':37, 'text':"No Data to read!"})
			}

	})
	.catch( err => {
		
		let result = checkError(err)
		//console.log(result)
		callbackFailure(result)
	});
};