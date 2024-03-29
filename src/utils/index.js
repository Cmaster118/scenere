// Lets do some local storage fun time tests!
import Store from "store"

export * from "./axiosAPI"
export * from "./graphs"
export * from "./sidebarCustom"
export * from "./networkGraph"
export * from "./infoDisplayMulti"

export const timedLoadStorage = (key) => {
	
	let loadData = Store.get(key)

	// Return 0 if there is no key by this name....
	if (loadData === undefined) {
		return 0
	}
	if (loadData["data"] === undefined) {
		Store.remove(key)
		return 2
	}
	
	// Return 1 if the it is to "old"
	let dateSaved = loadData["expiryDate"]
	let now = Date.now()
	
	if (now > dateSaved) {
		//console.log("Expired")
		Store.remove(key)
		return 1
	}
	else {
		//console.log("Allowed")
	}

	return loadData["data"]
}
export const timedSaveStorage = (key, data, length) => {

	// Now, How exactly do I determine when the expiry should be?
	// So, this is local storage, which is still the single WORST PLACE TO PUT THIS
	// However, I will wait for next version before I change that
	try {
		let storageTime = new Date()
		
		if (length === 0) {
			storageTime.setHours(storageTime.getHours()+1)
		}
		else if (length === 1) {
			storageTime.setDate(storageTime.getDate()+1)
		}
		else if (length === 2) {
			storageTime.setDate(storageTime.getDate()+7)
		}
		else {
			// BASIC!
			storageTime.setSeconds(storageTime.getSeconds()+90)
		}
		
		let storeData = {"expiryDate":storageTime.getTime(), "data":data}
		Store.set(key, storeData)
	} catch (error) {
		return false
	}

	return true
}
export const clearStorage = () => {
	console.log("Clearing Data...")
	Store.clearAll()
	console.log("Done!")
	
	return false
}
export const checkStorageContents = () => {
	console.log("Checking Storage contents:")
	Store.each(function(value, key) {
		console.log(key, '==', value)
		
		let dateSaved = value["expiryDate"]
		let now = Date.now()
		if (now > dateSaved) {
			console.log("Found Expired Key!")
			Store.remove(key)
		}
	})
	console.log("Done!")
	
	return false
}

export const displayStorageContents = () => {
	console.log("Showing Storage contents:")
	Store.each(function(value, key) {
		console.log(key, '==', value)
	})
	console.log("Done!")
	
	return false
}

export const deleteStorageKey = (key) => {
	Store.remove(key)
}

// THIS IS EXAMPLE COMPANY TEST DATA!!!
const makeCompanyDaydata = () => {
	
	let dayData = {
			emotion: { 
				max:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()}, 
				min:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()}, 
				ave:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
				
				threshold:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
			},
			sentiment: {
				max:2*Math.random()-1, 
				min:2*Math.random()-1, 
				ave:2*Math.random()-1,
				
				thresholdPos:Math.random(),
				thresholdNeg:Math.random(),
			},
			entities: [
				{text:"Example Entity", 
					count:12,
					type:"Whatever",
					confidence:{ 
						max:Math.random(), 
						min:Math.random(), 
						ave:Math.random(),
						
						std:Math.random(),
					},
					relevance:{
						max:Math.random(),
						min:Math.random(),
						ave:Math.random(),
						
						std:Math.random(),
					},
					emotion:{
						max:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
						min:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
						ave:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
						
						std:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
					}, 
					sentiment:{
						max:2*Math.random()-1, 
						min:2*Math.random()-1, 
						ave:2*Math.random()-1,
						
						std:Math.random(),
					},
				}, 
			],
			keywords: [
				{text:"Example Keyword", 
					count:6, 
					
					relevance:{
						max:Math.random(),
						min:Math.random(),
						ave:Math.random(),
						
						std:Math.random(),
					}, 
					emotion:{
						max:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
						min:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
						ave:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
						
						std:{joy:Math.random(), anger:Math.random(), sadness:Math.random(), disgust:Math.random(), fear:Math.random()},
					}, 
					sentiment:{
						max:2*Math.random()-1, 
						min:2*Math.random()-1, 
						ave:2*Math.random()-1,
						
						std:Math.random(),
					},
				},
			],
			relations: [
				{type:"didTo", 
					count:4, 
					score:{
						max:2*Math.random()-1, 
						min:2*Math.random()-1, 
						ave:2*Math.random()-1,
						
						std:Math.random(),
					}, 
					arguments:[{text:"person1"},{text:"person2"}] 
				}
			],
		}
	return dayData
}

export const makeCompanyTestDataOtherFormat = () => {
	
	const testData = {
		mon: {
			responsePurity: 90,
			p1: {
				name:"Prompt 1 Full Name",
				data: makeCompanyDaydata(),
			},
			p2: {
				name:"Prompt 2 Full Name",
				data: makeCompanyDaydata(),
			},
			p3: {
				name:"Prompt 3 Full Name",
				data: makeCompanyDaydata(),
			},
			p4: {
				name:"Prompt 4 Full Name",
				data: makeCompanyDaydata(),
			},
		},
		tue: {
			responsePurity: 23,
			p1: {
				name:"Prompt 1 Full Name",
				data: makeCompanyDaydata(),
			},
			p2: {
				name:"Prompt 2 Full Name",
				data: makeCompanyDaydata(),
			},
			p3: {
				name:"Prompt 3 Full Name",
				data: makeCompanyDaydata(),
			},
			p4: {
				name:"Prompt 4 Full Name",
				data: makeCompanyDaydata(),
			},
		},
		wed: {
			responsePurity: 55,
			p1: {
				name:"Prompt 1 Full Name",
				data: makeCompanyDaydata(),
			},
			p2: {
				name:"Prompt 2 Full Name",
				data: makeCompanyDaydata(),
			},
			p3: {
				name:"Prompt 3 Full Name",
				data: makeCompanyDaydata(),
			},
			p4: {
				name:"Prompt 4 Full Name",
				data: makeCompanyDaydata(),
			},
		},
		thu: {
			responsePurity: 78,
			p1: {
				name:"Prompt 1 Full Name",
				data: makeCompanyDaydata(),
			},
			p2: {
				name:"Prompt 2 Full Name",
				data: makeCompanyDaydata(),
			},
			p3: {
				name:"Prompt 3 Full Name",
				data: makeCompanyDaydata(),
			},
			p4: {
				name:"Prompt 4 Full Name",
				data: makeCompanyDaydata(),
			},
		},
		fri: {
			responsePurity: 34,
			p1: {
				name:"Prompt 1 Full Name",
				data: makeCompanyDaydata(),
			},
			p2: {
				name:"Prompt 2 Full Name",
				data: makeCompanyDaydata(),
			},
			p3: {
				name:"Prompt 3 Full Name",
				data: makeCompanyDaydata(),
			},
			p4: {
				name:"Prompt 4 Full Name",
				data: makeCompanyDaydata(),
			}
		},
		sat: {
			responsePurity: 90,
			p1: {
				name:"Prompt 1 Full Name",
				data: makeCompanyDaydata(),
			},
			p2: {
				name:"Prompt 2 Full Name",
				data: makeCompanyDaydata(),
			},
			p3: {
				name:"Prompt 3 Full Name",
				data: makeCompanyDaydata(),
			},
			p4: {
				name:"Prompt 4 Full Name",
				data: makeCompanyDaydata(),
			}
		},
		sun: {
			responsePurity: 90,
			p1: {
				name:"Prompt 1 Full Name",
				data: makeCompanyDaydata(),
			},
			p2: {
				name:"Prompt 2 Full Name",
				data: makeCompanyDaydata(),
			},
			p3: {
				name:"Prompt 3 Full Name",
				data: makeCompanyDaydata(),
			},
			p4: {
				name:"Prompt 4 Full Name",
				data: makeCompanyDaydata(),
			}
		},
		allDay: {
			responsePurity: 90,
			p1: {
				name:"Prompt 1 Full Name",
				data: makeCompanyDaydata(),
			},
			p2: {
				name:"Prompt 2 Full Name",
				data: makeCompanyDaydata(),
			},
			p3: {
				name:"Prompt 3 Full Name!!2",
				data: makeCompanyDaydata(),
			},
			p4: {
				name:"Prompt 4 Full Name",
				data: makeCompanyDaydata(),
			}
		}
	}
			
	return testData
}