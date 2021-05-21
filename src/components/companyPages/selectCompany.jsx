import React from "react";

import { withRouter } from "react-router-dom";

const selectCompany = (props) => {
		
	let keyID = 0
	let backLayerButtons = []
	
	let currentLayer = props.companyDataTree
	// Dig following each of the currentSelection...
	
	backLayerButtons.push(
		<button key={keyID} onClick={props.backLayer} value={0} className="btn btn-outline-dark"> 
			Root 
		</button>
	)
	keyID += 1
	
	let selectedDivisionFull = ""
	let selectedDivision = ""
	let selectedPerms = 0
	let selectedID = -1
	
	if (props.currentCompanySelections.length > 0) {
		// Display the currently selected aspects...
		
		for (let i = 0; i < props.currentCompanySelections.length; i++) {
			
			// The last iteration of this is the one we are on, before the currentLayer is reset...
			selectedDivisionFull += currentLayer[ props.currentCompanySelections[i] ]["name"] + "/"

			selectedDivision = currentLayer[ props.currentCompanySelections[i] ]["name"]
			selectedPerms = currentLayer[ props.currentCompanySelections[i] ]["perm"]
			selectedID = props.currentCompanySelections[i]
			
			let thisClass = "btn"
			if ( currentLayer[props.currentCompanySelections[i]]["perm"] ) {
				thisClass += " btn-secondary"
			}
			else {
				thisClass += " btn-outline-secondary"
			}
			backLayerButtons.push(
				<button key={keyID} onClick={props.backLayer} value={i+1} className={thisClass}> 
					{ currentLayer[props.currentCompanySelections[i]]["name"] } 
				</button>
			)
			keyID += 1
			
			// Enter the currentLayer, one stage at a time...
			currentLayer = currentLayer[ props.currentCompanySelections[i] ].children
		}
	}
	else {
		selectedDivisionFull = "No Selection"
	}

	let currentLayerButtons = []
	// Display the current layer we are selecting...
	for (let key in currentLayer) {

		let thisClass = "btn"
		if ( currentLayer[key]["perm"] ) {
			thisClass += " btn-primary"
		}
		else {
			thisClass += " btn-outline-primary"
		}
		
		currentLayerButtons.push(
			<button key={keyID} onClick={props.selectLayer} value={key} className={thisClass}>
				{currentLayer[key]["name"]}
			</button>
		)
		keyID += 1
	}
	
	// If we got to this point without putting anything into the array...
	if (currentLayerButtons.length === 0) {
		currentLayerButtons.push(
			<div className="btn btn-outline-secondary" key={keyID}> 
				End of Data
			</div>
		)
		keyID += 1
	}
	
	let getButtonClass = "btn "
	let errorCheckingClass = ""
	if (selectedPerms > 0) {
		getButtonClass += "btn-success"
		errorCheckingClass =' text-success'
	}
	else {
		getButtonClass += "btn-danger"
		errorCheckingClass =' text-danger'
	}
	
	/*let responseCheckingClass = ' bg-success'
	if (props.lastRequestStatus === false) {
		responseCheckingClass = ' bg-danger'
	}*/
	
	let currentSet = [selectedPerms, selectedDivision, selectedID]
	
	return (
		<div className="testPages">
			<div className="container-fluid">
				
				<div className="row my-2">
					<div className="col">
						<div className="card shadow">
							<div className="card-header">
								<div className="row">
									<div className="col my-2">
										Select a Company Division you have Viewing Privilege for:
									</div>
								</div>
								<div className="row">
									<div className="col my-2">
										<div className={errorCheckingClass}>
											{selectedDivisionFull}
										</div>
									</div>
								</div>
							</div>
							<div className="card-body">
								<div className="row my-2">
									<div className="col btn-group btn-group-sm">
										{backLayerButtons}
									</div>
								</div>
								
								<div className="row my-2">
									<div className="col btn-group btn-group-sm">
										{currentLayerButtons}
									</div>
								</div>
								<div className="row my-2">
									<div className="col">
										<button onClick={props.getDataRequest} value={ currentSet } className={ getButtonClass }>
											Get Data
										</button>
									</div>
								</div>
								
								{props.lastRequestStatus > 0 && 
									<div className="row">
										<div className="col">
											{ props.lastRequestStatus === 1 && "Data Obtained, Ready To Go!" }
											{ props.lastRequestStatus === 2 && "Not Allowed!" }
										</div>
									</div>
								}
								
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRouter(selectCompany);