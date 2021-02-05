import React from "react";
import axios from "axios";

import { withRouter } from "react-router-dom";
import Store from "store"
import {Editor, EditorState, ContentState, RichUtils, convertToRaw } from 'draft-js';

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
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

class journalView extends React.Component {
	
	constructor(props) {
        super(props);
		
		const today = new Date()
		
		this.state = {
			currentDate: today,
			
			messages: "Creating journal for: " + today.toJSON().split("T")[0],
			
			editorState: EditorState.createEmpty(),
			
			journalPlaceolder: "",

        };
		
		// This doesnt look right... Fix this later I guess
		this.onChange = (incomingState) => {
			//console.log(incomingState)
			this.setState({
				editorState:incomingState,
			})	
		}
		
		this.setEditor = (editor) => {
			this.editor = editor;
		};
		
	};

	backButton = () => {
		this.props.history.goBack()
	}

	// Lets test a POST request then!
	saveJournal = () => {
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
		
		const data = {
			shorthand: 'made from the website (random code needed)',
			
			// This is my workaround before I learn what ACTUALLY TO DO HERE
			author: '',
		
			// It SHOULD be sufficient to use the current date...
			// Because the journal transitions on date changes...		
			createdDate: this.state.currentDate.toJSON().split("T")[0],
			
			// Same here, Should be able to do this...
			// The question is, is this an "overwrite" or just an add?
			content: this.state.editorState.getCurrentContent().getPlainText(),
		};
		
		//console.log(data.content)
		
		axios.post(this.props.APIHost +"/saveUserJournal/", data, config )
		.then( res => { 
		
			console.log(res)
			console.log("Success")
			
		})
		.catch( err => {
			// Change this depending on the error...
			if (err.response.status === 401) {
				this.props.forceLogout()
				this.props.history.push(this.props.reRouteTarget)
			}
		})
	}
	
	loadToday = () => {
		let test2 = Store.get("TodayTest")
		
		console.log(this.state.editorState.getCurrentContent().getBlocksAsArray())
		console.log(test2)
		
		let test = this.state.editorState.getCurrentContent().getBlocksAsArray()
		
		let next = ContentState.createFromBlockArray(test)
		
		this.setState({
			
			editorState: EditorState.createWithContent(next)
		})
	}
	
	cookieToday = () => {
		console.log('content state', convertToRaw(this.state.editorState.getCurrentContent()));
		//Store.set( "TodayTest", this.state.editorState.getCurrentContent().getBlocksAsArray() )
	}

	onBoldClick = () => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
	}
	// Example code... Can I alter this to be more my style?
	// It works, so its okay for now...
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
		return (
			<div className="makeView">
				<div className="container">

					<div className="row">
						<div className="col-sm-3 m-2">	
							<button className="btn btn-primary" onClick={this.backButton}>
								Go Back
							</button>
						</div>
						<div className="col-sm m-2">	
							Page Title Test!
						</div>
					</div>
				
					<div className="row">
						<div className="col">
							{this.state.messages}
						</div>
					</div>
				
					<div className="row">
						<div className="col border mx-2 my-2">		
							
							<BlockStyleControls
								editorState={this.state.editorState}
								onToggle={this.toggleBlockType}
							/>
							<InlineStyleControls
								editorState={this.state.editorState}
								onToggle={this.toggleInlineStyle}
							/>
							
							<div style={styles.editor} >
								<Editor
								  ref={this.setEditor}
								  
								  editorState={this.state.editorState}
								  onChange={this.onChange}
								  
								  handleKeyCommand={this.handleKeyCommand}
								  placeholder={this.state.journalPlaceolder}
								/>
							</div>
							
							<button className="btn btn-outline-primary" onClick={this.saveJournal}> Save current Journal entry </button>
							
							<button className="btn btn-outline-primary" onClick={this.loadToday}> Load Today's Data </button>
							
							<button className="btn btn-outline-primary" onClick={this.cookieToday}> Cookie Today's Data </button>
						</div>
					</div>
					
				</div>
			</div>
		)
	}
}

export default withRouter(journalView);