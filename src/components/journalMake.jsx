import React from "react";

import { withRouter } from "react-router-dom";
import Store from "store"
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
//ContentState

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em',
	justifyContent: 'left',
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
			<button className={className} onClick={this.onToggle}>
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

// END OF THE EXAMPLE CODE!!!

const saveEditorData = () => {
	Store.set( "TodayTest", convertToRaw(this.state.editorState.getCurrentContent()) )
}

const loadEditorData = () => {
	let loadedEditor = convertFromRaw(Store.get("TodayTest"))
	//console.log(loadedEditor)
	
	this.setState({
		editorState: EditorState.createWithContent(loadedEditor)
	})
}

// This contains the EditorJS code... So lets do it last as I am unsure as of what to do...
const journalView = (props) => {
	
	// Example code... Can I alter this to be more my style?
	// It works, so its okay for now...
	const toggleBlockType = (blockType) => {
		this.onChange(
			RichUtils.toggleBlockType(
				this.state.editorState,
				blockType
			)
		);
	}
	
	const toggleInlineStyle = (inlineStyle) => {
		this.onChange(
            RichUtils.toggleInlineStyle(
				this.state.editorState,
				inlineStyle
            )
        );
	}
	
	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);

		if (newState) {
			props.onChange(newState);
			return 'handled';
		}

		return 'not-handled';
	}
	
	let placeholder = ""
	let promptType = "Open Ended"

	return (
		<div className="makeView">
			<div className="container">
				<div className="row my-2">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h4>Writing Today's Journal</h4>
							</div>
							<div className="card-body">
								<h5 className="card-title">Today's Prompt is: {promptType}</h5>
								
								<div className="row">
									<div className="col">
										<BlockStyleControls
											editorState={props.editorState}
											onToggle={toggleBlockType}
										/>
										<InlineStyleControls
											editorState={props.editorState}
											onToggle={toggleInlineStyle}
										/>
									</div>
								</div>
								
								<div className="row">
									<div className="col-1">
									</div>
									<div className="col">
										<div id="align-left">
											<div style={styles.editor} >
												<Editor
												  
													editorState={props.editorState}
													onChange={props.onChange}
													handleKeyCommand={handleKeyCommand}
													
													spellCheck={true}
													placeholder={placeholder}
												/>
											</div>
										</div>
									</div>
									<div className="col-1">
									</div>
								</div>

								<div className="row">
									<div className="col">
										<button className="btn btn-outline-primary" onClick={props.saveToServer}> Save current Journal entry </button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withRouter(journalView);