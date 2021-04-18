import React from "react";

import { withRouter } from "react-router-dom";
//import Store from "store"
// ContentState, EditorState, convertToRaw, convertFromRaw 
import {Editor, RichUtils, } from 'draft-js';

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

// END OF THE EXAMPLE CODE!!!
/*const saveEditorData = () => {
	Store.set( "TodayTest", convertToRaw(this.state.editorState.getCurrentContent()) )
}

const loadEditorData = () => {
	let loadedEditor = convertFromRaw(Store.get("TodayTest"))
	//console.log(loadedEditor)
	
	this.setState({
		editorState: EditorState.createWithContent(loadedEditor)
	})
}*/

// This contains the EditorJS code... So lets do it last as I am unsure as of what to do...
class journalView extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
		}	
		
		this.focusMe = () => this.refs.editor.focus();
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

	render() {
		
		let placeholder = ""
		let promptType = "Open Ended"
		
		let showSuccess = false
		let showNormalError = false
		let showUnknownError = false
		
		let successData = false
		let successData2 = false
		let normalError = false
		let unknownError = false
		for (let index in this.props.journalErrors[0]) {
			// Display Success 1!
			if (this.props.journalErrors[0][index] === 1) {
				showSuccess = true
				successData = 
					<div className="row">
						<div className="col text-success">
							{this.props.journalErrors[1][index]}
						</div>
					</div>
			}
			// Display Success 2!
			else if (this.props.journalErrors[0][index] === 2) {
				showSuccess = true
				//console.log(this.props.journalErrors[1][index])
				successData2 =
					<div className="row">
						<div className="col text-success">
							{"Created Journal for: "+this.props.journalErrors[1][index].forDate}
						</div>
					</div>
			}
			// Already Exists?
			else if (this.props.journalErrors[0][index] === 3) {
				showNormalError = true
				normalError =
					<div>
						<div className="row">
							<div className="col text-warning">
								Sorry! That Journal already exists
							</div>
						</div>
						{/*<div className="row">
							<div className="col text-warning">
								{this.props.journalErrors[1][index]}
							</div>
						</div> */}
					</div>
			}
			// Unknown
			else if (this.props.journalErrors[0][index] === 10) {
				showUnknownError = true
				unknownError =
					<div className="row">
						<div className="col text-danger">
							{this.props.journalErrors[1][index]}
						</div>
					</div>
			}
		}
		
		return (
			<div className="makeView">
				<div className="container-fluid">
					<div className="row my-2">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									<h4>Writing Today's Journal</h4>
								</div>
								<div className="card-body">
									<h5 className="card-title">Today's Prompt is: {promptType}</h5>
									
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
											<button className="btn btn-outline-primary" onMouseDown={this.props.saveToServer}> Save current Journal entry </button>
										</div>
									</div>
									
									{showSuccess && successData}
									{showSuccess && successData2}
									{showNormalError && normalError}
									{showUnknownError && unknownError}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(journalView);