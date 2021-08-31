import React from "react";

import { withRouter } from "react-router-dom";
//import Store from "store"
// ContentState, 
import { Alert } from 'react-bootstrap';
import { Editor, RichUtils, EditorState, convertToRaw, convertFromRaw } from 'draft-js';

//deleteStorageKey
import { timedLoadStorage, timedSaveStorage, APISaveJournal, APISaveNonJournal } from "../../utils";

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em',
	textAlign: 'left',
  }
};

/*
const promptType = [
	"Open",
	"Likert",
	"Rating",
	"Multi",
]
*/

// START OF EXAMPLE CODE FROM THE DRAFT.JS!!!!!
class StyleButton extends React.Component {
	constructor() {
		super();
		this.onToggle = (e) => {
			//console.log(this.props.style)
			e.preventDefault();
			this.props.onToggle(this.props.style);
		};
	}

	render() {
		let className = 'btn btn-outline-primary';
		if (this.props.active) {
			className += ' active';
		}

		return (
			<button className={className} onMouseDown={this.onToggle}>
				{this.props.label}
			</button>
		);
	}
}

const BLOCK_TYPES = [
	{label: 'H1', style: 'header-one'},
	{label: 'H2', style: 'header-two'},
	{label: 'H3', style: 'header-three'},
	{label: 'H4', style: 'header-four'},
	{label: 'H5', style: 'header-five'},
	{label: 'H6', style: 'header-six'},
	//{label: 'Blockquote', style: 'blockquote'},
	//{label: 'UL', style: 'unordered-list-item'},
	//{label: 'OL', style: 'ordered-list-item'},
	//{label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
	const {editorState} = props;
	const selection = editorState.getSelection();
	const blockType = editorState
	  .getCurrentContent()
	  .getBlockForKey(selection.getStartKey())
	  .getType();

	return (
		<div className="RichEditor-controls">
			{BLOCK_TYPES.map((type) =>
				<StyleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
					
				/>
			)}
		</div>
	);
};

const INLINE_STYLES = [
	{label: 'Bold', style: 'BOLD'},
	{label: 'Italic', style: 'ITALIC'},
	{label: 'Underline', style: 'UNDERLINE'},
	//{label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
	const currentStyle = props.editorState.getCurrentInlineStyle();
	
	return (
		<div className="RichEditor-controls">
			{INLINE_STYLES.map((type) =>
				<StyleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			)}
		</div>
	);
};

class MultiIteration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: this.loadData()
		}	
	}
	
	loadData = () => {
		if (this.props.initialSave !== undefined) {
			return this.props.initialSave["data"]
		}
		return undefined
	}
	
	selectMulti = (event) => {
		
		this.setState({
			selected: event.target.value
		})
		
		this.props.saveTo(this.props.targetDiv, this.props.id, 3, event.target.value)
	}
	
	render() {
		
		let disableThis = ""
		let displayColor = "primary"
		if (this.props.alreadyDone) {
			disableThis = " disabled"
			displayColor = "danger"
		}
		
		let buttonSet = []
		for (let key in this.props.choices) {
			
			let isActive = ""
			if (this.state.selected === key) {
				isActive = "active"
			}
			
			buttonSet.push(
				<button type="button" key={key} onClick={this.selectMulti} value={key} className={"btn btn-outline-"+displayColor+" "+isActive+disableThis}>{this.props.choices[key]}</button>
			)
		}
		
		return (
			<div className="RatingIteration">
				{this.props.alreadyDone && 
					<div className="row">
						<div className="col text-warning">
							Already Submitted!
						</div>
					</div>
				}
				<div className="row">
					<div className="col">
						<div className="btn-group" role="group" aria-label="...">
							{buttonSet}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class RatingIteration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: this.loadData()
		}	
	}
	
	loadData = () => {
		if (this.props.initialSave !== undefined) {
			return this.props.initialSave["data"]
		}
		return -1
	}
	
	selectRating = (event) => {
		let index = Number(event.target.value)
		
		this.setState({
			selected: index
		})
		
		this.props.saveTo(this.props.targetDiv, this.props.id, 2, index)
	}
	
	render() {

		let isActive = ["", "", "", "", "", ""]	
		if (this.state.selected >= 0 && this.state.selected < isActive.length) {
			isActive[this.state.selected] = "active"
		}
		
		let disableThis = ""
		let displayColor = "primary"
		if (this.props.alreadyDone) {
			disableThis = " disabled"
			displayColor = "danger"
		}
		
		let buttonSet = []
		for (let index in isActive) {
			buttonSet.push(
				<button type="button" key={index} onClick={this.selectRating} value={index} className={"btn btn-outline-"+displayColor+" "+isActive[index] + disableThis}>{index}</button>
			)
		}
		
		return (
			<div className="RatingIteration">
				{this.props.alreadyDone && 
					<div className="row">
						<div className="col text-warning">
							Already Submitted!
						</div>
					</div>
				}
				<div className="row">
					<div className="col">
						<div className="btn-group" role="group" aria-label="...">
						{buttonSet}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class LikertIteration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: this.loadData()
		}	
	}
	
	loadData = () => {
		if (this.props.initialSave !== undefined) {
			return this.props.initialSave["data"]
		}
		return -1
	}
	
	selectLikert = (event) => {
		let index = Number(event.target.value)
		
		this.setState({
			selected: index
		})
		
		this.props.saveTo(this.props.targetDiv, this.props.id, 1, index)
	}
	
	render() {
		
		let isActive = ["", "", "", "", ""]		
		if (this.state.selected >= 0 && this.state.selected < isActive.length) {
			isActive[this.state.selected] = "active"
		}
		
		let disableThis = ""
		let displayColor = "primary"
		if (this.props.alreadyDone) {
			disableThis = " disabled"
			displayColor = "danger "
		}
		
		let buttonSet = []
		for (let index in isActive) {
			buttonSet.push(
				<button type="button" key={index} onClick={this.selectLikert} value={index} className={"btn btn-outline-"+displayColor+" "+isActive[index] + disableThis}>{index-2}</button>
			)
		}
		
		return (
			<div className="LikertIteration">
				{this.props.alreadyDone && 
					<div className="row">
						<div className="col text-warning">
							Already Submitted!
						</div>
					</div>
				}
				<div className="row">
					<div className="col">
						<div className="btn-group" role="group" aria-label="...">
							<span className="btn btn-link disabled" disabled>Highly Disagree</span>
							{buttonSet}
							<span className="btn btn-link disabled" disabled>Highly Agree</span>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class JournalIteration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: this.loadData(),
		}	
		this.focusMe = (event) => this.refs.editor.focus();
		this.onToggle = (e) => {
			//console.log(this.props.style)
			e.preventDefault();
			//this.props.onToggle(this.props.style);
		};
	}
	
	loadData = () => {
		
		if (this.props.initialSave !== undefined) {
			return EditorState.createWithContent( convertFromRaw(this.props.initialSave["data"]["block"]) )
		}
		
		return EditorState.createEmpty()
	}
	
	onChange = (incomingState) => {
		this.setState({
			editorState:incomingState,
		})	
		
		// These are magic
		this.props.saveTo(this.props.targetDiv, this.props.id, 0, {"raw":incomingState.getCurrentContent().getPlainText(), "block":convertToRaw(incomingState.getCurrentContent())})
	}
	
	toggleBlockType = (blockType) => {
		this.onChange(
			RichUtils.toggleBlockType(
				this.state.editorState,
				blockType
			)
		);
	}
	
	toggleInlineStyle = (inlineStyle) => {
		this.onChange(
            RichUtils.toggleInlineStyle(
				this.state.editorState,
				inlineStyle
            )
        );
	}
	
	handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);

		if (newState) {
			this.onChange(newState);
			return 'handled';
		}

		return 'not-handled';
	}
	
	render() {

		let displayStuff = ""
		if (this.props.alreadyDone) {
			displayStuff = "Journal Already Submitted!"
		}

		return (
			<div className="journalIteratorContainer">
				
				{this.props.alreadyDone && 
					<div className="row">
						<div className="col text-warning">
							Already Submitted!
						</div>
					</div>
				}
			
				{!this.props.alreadyDone && 
					<div className="row">
						<div className="col">
							<BlockStyleControls
								editorState={this.state.editorState}
								onToggle={this.toggleBlockType}
							/> 
							<InlineStyleControls
								editorState={this.state.editorState}
								onToggle={this.toggleInlineStyle}
							/>
						</div>
					</div>
				}

				<div className="row">
					<div className="col" onClick={this.focusMe}>
					
						<div id="align-left">
							<div style={styles.editor} >
								<Editor
									editorState={this.state.editorState}
									onChange={this.onChange}
									handleKeyCommand={this.handleKeyCommand}
									
									spellCheck={true}
									placeholder={displayStuff}
									
									readOnly={this.props.alreadyDone}
									
									ref="editor"
								/>
							</div>
						</div>
						
					</div>
				</div>
			</div>
		);
	}
}

// This contains the EditorJS code... So lets do it last as I am unsure as of what to do...
class journalCreate extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			promptData: this.checkDataSet(),
			
			selectedDivision: 0,
			
			journalErrors: [],
			postJournalStatus: 0,
			
			nonJournalErrors: [],
			postNonJournalStatus: 0,
		}
	}
	
	journalPostFailure = (responseData) => {
		//let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.saveFullSet)
			return
		}
		// Invalid Permissions
		else if (responseData["action"] === 2) {
			
		}
		// Bad Request
		else if (responseData["action"] === 3) {
			
		}
		// Server Exploded Error
		else if (responseData["action"] === 4) {

		}
		// Unknown Error
		else if (responseData["action"] === 5) {

		}
		
		//returnData = responseData['messages']
		this.setState({
			//journalErrors: returnData,
			postJournalStatus:3,
		})
	}
	journalPostCallback = (incomingStuff) => {
		// Set something to notify user....
		this.setState({
			journalErrors: [],
			postJournalStatus:2,
		})
	}
	postJournal = (incomingID, incomingEditor, incomingTargetDivision) => {
		// This may need to be overridden?
		let inputDate = this.props.currentDate
		let journalContent = incomingEditor["raw"]
		let richContent = incomingEditor["block"]
		
		if (incomingID !== undefined) {		
			APISaveJournal( inputDate, incomingID, incomingTargetDivision, journalContent, richContent, this.journalPostCallback, this.journalPostFailure)
		}
		else {
			// Just in case!
			let insertID = "none"
			APISaveJournal( inputDate, insertID, incomingTargetDivision, journalContent, richContent, this.journalPostCallback, this.journalPostFailure)
		}
		this.setState({
			postJournalStatus:1,
		})
	}
	
	nonJournalPostFailure = (responseData) => {
		let returnData = []
		// Server is dead
		if (responseData["action"] === 0) {
			
		}
		// Unauthorized
		else if (responseData["action"] === 1) {
			this.props.refreshToken(this.saveFullSet)
			return
		}
		// Invalid Permissions
		else if (responseData["action"] === 2) {
			
		}
		// Bad Request
		else if (responseData["action"] === 3) {
			
		}
		// Server Exploded Error
		else if (responseData["action"] === 4) {

		}
		// Unknown Error
		else if (responseData["action"] === 5) {

		}
		
		returnData = responseData['messages']
		this.setState({
			nonJournalErrors: returnData,
			postNonJournalStatus:3,
		})
	}
	nonJournalPostCallback = (incomingStuff) => {
		// Set something to notify user....
		this.setState({
			journalErrors: [],
			postNonJournalStatus:2,
		})
	}
	postNonJournal = (incomingID, incomingValue, incomingTargetDivision) => {
		// This may need to be overridden?
		let inputDate = this.props.currentDate
		
		if (incomingID !== undefined) {		
			APISaveNonJournal( inputDate, incomingID, incomingTargetDivision, incomingValue, this.nonJournalPostCallback, this.nonJournalPostFailure)
			this.setState({
				postNonJournalStatus:1,
			})
		}
		else {
			this.setState({
				nonJournalErrors: [{'mod':-1, 'text':'Invalid prompt id!'} ],
				postNonJournalStatus:3,
			})
		}
	}
	
	checkDataSet = () => {
		let dataSet = timedLoadStorage("promptDataSaved-"+this.props.currentUser)
		if (dataSet === 0) {
			//console.log("No Saved Data!")
		}
		else if (dataSet === 2) {
			//console.log("Invalid Save Data!")
		}
		else if (dataSet === 1) {
			//console.log("Expired load!")
		}
		else {
			return dataSet
		}
		
		return {}
	}
	
	savePromptData = (targetID, identifier, type, data) => {
		
		var duplicate = {};
		for (let prop in this.state.promptData) {
			duplicate[prop] = this.state.promptData[prop];
		}
		
		duplicate[identifier] = {"targetID":targetID, "type":type, "data":data}
		
		this.setState({
			promptData: duplicate
		})
		
		timedSaveStorage("promptDataSaved-"+this.props.currentUser, duplicate, 1)
	}
	
	saveFullSet = () => {

		let targetID = -1
		if (this.props.promptList.length > 0 && this.state.selectedDivision >= 0 && this.state.selectedDivision < this.props.promptList.length) {
			targetID = this.props.promptList[this.state.selectedDivision]["divTarget"]["id"]
		}
		else {
			// Invalid Selection!]
			return
		}
		
		for (let index in this.state.promptData) {

			if (this.state.promptData[index] === undefined) {
				continue
			}
			
			if (this.state.promptData[index]["targetID"] === targetID) {
				//console.log("Allowed to save!")
				//console.log(this.state.promptData[index]["data"])
				
				if ( this.state.promptData[index]["type"] === 0 ) {
				this.postJournal( index, this.state.promptData[index]["data"], this.state.promptData[index]["targetID"] )
				}
				else {
					this.postNonJournal( index, this.state.promptData[index]["data"], this.state.promptData[index]["targetID"] )
				}
			}
			else {
				//Display Error
			}
		}
	}
	
	selectDisplayButton = (event) => {
		//console.log(event.target.id)
		this.setState({
			selectedDivision:Number(event.target.value)
		})
	}

	render() {
		
		let promptSet = []
		let currentDisplayDivision = "None Selected!"
		let currentDivID = -1
		if (this.props.promptList.length > 0 && this.state.selectedDivision >= 0 && this.state.selectedDivision < this.props.promptList.length) {
			currentDisplayDivision = this.props.promptList[this.state.selectedDivision]["divTarget"]["divisionName"]
			currentDivID = this.props.promptList[this.state.selectedDivision]["divTarget"]["id"]
			promptSet = this.props.promptList[this.state.selectedDivision]["promptSet"]
		}
		
		let displayButtonSet = []
		for (let index in this.props.promptList) {
			let dataTarget = this.props.promptList[index]["divTarget"]
			//let dataPromptList = this.props.promptList[index]["divTarget"]
			
			let classSet = "btn btn-outline-secondary"
			if (String(this.state.selectedDivision) === index) {
				classSet = "btn btn-secondary"
			}
			
			displayButtonSet.push(			
				<button key={index} className={classSet} value={index} id={dataTarget.id} onClick={this.selectDisplayButton}>
					{dataTarget.divisionName}
				</button>
			)
		}
		
		// Lets mess about!
		let promptDisplay = []
		for (let index in promptSet) {

			let outputThing = "Prompt Showing Error!"
			let promptID = promptSet[index]['identifier']
			
			let matchToday = false
			for (let i in this.props.nonJournalPromptsDone["today"]) {
				if (this.props.nonJournalPromptsDone["today"][i] === null) {
					continue
				}
				if ( promptID === this.props.nonJournalPromptsDone["today"][i]["identifier"]) {
					matchToday = true
					break
				}
			}
			for (let i in this.props.journalPromptsDone["today"]) {
				if (this.props.journalPromptsDone["today"][i] === null) {
					continue
				}
				if ( promptID === this.props.journalPromptsDone["today"][i]["identifier"]) {
					matchToday = true
					break
				}
			}
			for (let i in this.props.journalScanPromptsDone["today"]) {
				if (this.props.journalScanPromptsDone["today"][i] === null) {
					continue
				}
				if ( promptID === this.props.journalScanPromptsDone["today"][i]["identifier"]) {
					matchToday = true
					break
				}
			}
			
			
			switch ( promptSet[index]['promptType'] ) {
				// Open Ended
				case 0:
					outputThing = <JournalIteration
						
						initialSave={this.state.promptData[promptID]}
						id={promptID}
						targetDiv={currentDivID}
						saveTo={this.savePromptData}	
						alreadyDone={matchToday}
					/>
					break;
				// Likert
				case 1:
					outputThing = <LikertIteration 
					
						initialSave={this.state.promptData[promptID]}
						id={promptID}
						targetDiv={currentDivID}
						saveTo={this.savePromptData}	
						alreadyDone={matchToday}
					/>
					break;
				// Rating
				case 2:
					outputThing = <RatingIteration 
					
						initialSave={this.state.promptData[promptID]}
						id={promptID}
						targetDiv={currentDivID}
						saveTo={this.savePromptData}	
						alreadyDone={matchToday}
					/>
					break;
				// Multi
				case 3:
					outputThing = <MultiIteration
					
						choices={promptSet[index]["promptChoices"]}
					
						initialSave={this.state.promptData[promptID]}
						id={promptID}
						targetDiv={currentDivID}
						saveTo={this.savePromptData}	
						alreadyDone={matchToday}
					/>
					break;
				default:
					outputThing = "Prompt Showing Error!"
					break;

			}
			
			promptDisplay.push (
				<div key={index}>
					<div className="row my-3">
						<div className="col">
							<h5>
								{promptSet[index]['text']}
							</h5>
							<div>
								{outputThing}
							</div>
						</div>
					</div>
					<hr />
				</div>
			)	
			
		}
		
		if (promptDisplay.length === 0) {
			let promptID = "misc"
			
			let matchToday = false
			for (let i in this.props.nonJournalPromptsDone["today"]) {
				if ( promptID === this.props.nonJournalPromptsDone["today"][i]) {
					matchToday = true
					break
				}
			}
			for (let i in this.props.journalPromptsDone["today"]) {
				if ( promptID === this.props.journalPromptsDone["today"][i]) {
					matchToday = true
					break
				}
			}
			for (let i in this.props.journalScanPromptsDone["today"]) {
				if ( promptID === this.props.journalScanPromptsDone["today"][i]) {
					matchToday = true
					break
				}
			}
			
			promptDisplay.push (
				<div key={0}>
					<div className="row my-3">
						<div className="col">
							<h5>
								No Prompts! have a free Open Ended Journal!
							</h5>
							<div>
								<JournalIteration
									initialSave={this.state.promptData[promptID]}
									id={promptID}
									saveTo={this.savePromptData}	
									alreadyDone={matchToday}
								/>
							</div>
						</div>
					</div>
					<hr />
				</div>
			)
		}
		
		//let showIdle = this.state.postJournalStatus === 0 || this.state.postNonJournalStatus === 0
		let showWaiting = this.state.postJournalStatus === 1 || this.state.postNonJournalStatus === 1
		let showSuccess = this.state.postJournalStatus === 2 || this.state.postNonJournalStatus === 2
		let showError = this.state.postJournalStatus === 3 || this.state.postNonJournalStatus === 3
		
		let errorParse = []
		for (let index in this.state.journalErrors) {
			errorParse.push(
				this.state.journalErrors[index]["text"]
			)
		}
		for (let index in this.state.nonJournalErrors) {
			errorParse.push(
				this.state.nonJournalErrors[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}
		
		//var editor = new Quill('#quillTest');
		return (
			<div className="makeView">
				<div className="container-fluid">
				
					<div className="card shadow">
						<div className="card-header">
							<div className="row">
								<div className="col">
									<h4>
										{currentDisplayDivision}
									</h4>
								</div>
							</div>
							<div className="row">
								<div className="col">
									{displayButtonSet}
								</div>
							</div>
						</div>
						<div className="card-body">
							{promptDisplay}
							
							<div className="row">
								<div className="col">
									<button className="btn btn-outline-primary" onMouseDown={this.saveFullSet}> Post! </button>
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
						  Entry Posted!
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
		)
	}
}

export default withRouter(journalCreate);