import React from "react";

import { withRouter } from "react-router-dom";
//EditorState, convertToRaw, convertFromRaw
import {Editor, RichUtils,  } from 'draft-js';
import { Alert } from 'react-bootstrap';
//ContentState

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

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em',
	textAlign: 'left',
  }
};

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
	{label: 'UL', style: 'unordered-list-item'},
	{label: 'OL', style: 'ordered-list-item'},
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

// This contains the EditorJS code... So lets do it last as I am unsure as of what to do...
class suggestionMake extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			pageNum:0,
			numPerPage:3,
			
			numChooseLimit:5,
			
			subList: this.initializeSubList(),
		}	
		
		this.focusMe = () => this.refs.editor.focus();
	}
	
	initializeSubList = () => {
		
		let generateingList = []
		
		// Hm, this may run multiple times due to my now-messed data reloading structure...
		for (let index in this.props.userLoadedCompanyList) {
			
			let permType = -1
			for (let permIndex in this.props.userLoadedCompanyList[index]["perm"]) {
				if (this.props.userLoadedCompanyList[index]["perm"][permIndex] === 3) {
					//console.log("Is Admin")
					// Set the thing to admin no matter what
					permType = 3
				}
			}
			
			if (permType >= 0 && permType < 4) {
				generateingList.push( this.props.userLoadedCompanyList[index] )
			}
		}
		
		return generateingList
	}
	
	// Example code... Can I alter this to be more my style?
	// It works, so its okay for now...
	toggleBlockType = (blockType) => {
		this.props.onChange(
			RichUtils.toggleBlockType(
				this.props.editorState,
				blockType
			)
		);
	}
	
	toggleInlineStyle = (inlineStyle) => {
		this.props.onChange(
            RichUtils.toggleInlineStyle(
				this.props.editorState,
				inlineStyle
            )
        );
	}
	
	handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);

		if (newState) {
			this.props.onChange(newState);
			return 'handled';
		}

		return 'not-handled';
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
	
	setCompany = (event) => {
		this.props.setSuggestionDivision(Number(event.target.value))
	}
	
	render() {
		// Dig following each of the currentSelection...
		
		let displayDivisionList = []
		
		let selectedDivisionFull = "No Valid Company!"
		let selectedPerms = 0
		
		for (let index in this.props.userLoadedCompanyList) {
			if (this.props.currentDivisionID === this.props.userLoadedCompanyList[index]["id"]) {
				selectedDivisionFull = this.props.userLoadedCompanyList[index]["name"]
				
				if (this.props.userLoadedCompanyList[index]["perm"].indexOf(3)) {
					selectedPerms = 1
				}
			}
		}
		
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
							{this.state.subList[adjustedIndex]["fullname"]}
						</div>
						<div className="col-2">
							<button className="btn btn-primary" value={this.state.subList[adjustedIndex]["id"]} onClick={this.setCompany}>
								Choose!
							</button>
						</div>
				</li>
			)
		}
		
		if (displayDivisionList.length === 0) {
			displayDivisionList.push(
				<div className="row" key="0">
					<div className="col">
						The Server has reported you are not the governed user for any companies!
					</div>
				</div>
			)
		}
		
		let getButtonClass = "btn "
		if (selectedPerms > 0) {
			getButtonClass += "btn-success"
		}
		else {
			getButtonClass += "btn-danger"
		}
		
		let errorCheckingClass = ""
		if (this.props.lastRequestStatus === false) {
			errorCheckingClass =' bg-danger'
		}		
		
		let placeholder = ""
		
		//let showIdle = this.props.postSuggestionStatus === 0
		let showSubmit = this.props.postSuggestionStatus === 1
		let showSuccess = this.props.postSuggestionStatus === 2
		let showError = this.props.postSuggestionStatus === 3
		
		let errorParse = []
		for (let index in this.props.suggestionErrors) {
			errorParse.push(
				this.props.suggestionErrors[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}

		return (
			<div className="makeView">
				<div className="container-fluid">
				
					<div className="row my-2">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<div className="row">
										<div className="col my-2">
											<div className={errorCheckingClass}>
												<h4><u>Which Company Part Is This For?</u></h4>
											</div>
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
				
					<div className="row my-2">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h4><u>Writing Suggestion for:</u></h4>
									<div className="row">
										<div className="col my-2">
											<div className={errorCheckingClass}>
												<h5><b>{selectedDivisionFull}</b></h5>
											</div>
										</div>
									</div>
								</div>
								<div className="card-body">
									
									<div className="row">
										<div className="col">
											<BlockStyleControls
												editorState={this.props.editorState}
												onToggle={this.toggleBlockType}
											/>
											<InlineStyleControls
												editorState={this.props.editorState}
												onToggle={this.toggleInlineStyle}
											/>
										</div>
									</div>
									
									<div className="row">
										<div className="col-1">
										</div>
										<div className="col" onClick={this.focusMe}>
											<div id="align-left">
												<div style={styles.editor} >
													<Editor
													  
														editorState={this.props.editorState}
														onChange={this.props.onChange}
														handleKeyCommand={this.handleKeyCommand}
														
														spellCheck={true}
														placeholder={placeholder}
														
														ref="editor"
													/>
												</div>
											</div>
										</div>
										<div className="col-1">
										</div>
									</div>

									<div className="row">
										<div className="col">
											<button className={getButtonClass} onMouseDown={this.props.saveToServer}> Save Suggestion </button>
										</div>
									</div>
									
									{/*{showSuccess && successData}
									{showSuccess && successData2}
									{showNormalError && normalError}
									{showUnknownError && unknownError}*/}
								</div>
							</div>
						</div>
					</div>
					
					<Alert show={showSubmit} variant="warning">
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
						  Successfully submitted suggestion!
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

export default withRouter(suggestionMake);