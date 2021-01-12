import React from "react";
import axios from "axios";

//import Store from "store"
import {Editor, EditorState, RichUtils, ContentState} from 'draft-js';

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  }
};

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
		this.onChange = (editorState) => this.setState({editorState});
		this.setEditor = (editor) => {
			this.editor = editor;
		};
		
	};

	// Lets test a POST request then!
	saveJournal = () => {
		
		if (this.props.authToken == null) {
			console.log("Not logged in")
			return false
		}
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
		
		const data = {
			shorthand: 'Some sort of has identifier?',
			
			// This is my workaround before I learn what ACTUALLY TO DO HERE
			author: '',
		
			// It SHOULD be sufficient to use the current date...
			// Because the journal transitions on date changes...		
			createdDate: this.state.currentDate.toJSON().split("T")[0],
			
			// Same here, Should be able to do this...
			// The question is, is this an "overwrite" or just an add?
			content: this.state.editorState.getCurrentContent().getPlainText(),
		};
		
		console.log(data.content)
		
		axios.post("http://10.0.0.60:8000/saveUserJournal/", data, config )
		.then( res => { 
		
			console.log(res)
			console.log("Success")
			
		})
		.catch( err => {
			// Change this depending on the error...
			console.log(err)
		})
	}

	changeJournal = (content) => {
		
		//let currentContent = this.state.editorState.getCurrentContent()
		
		let newContent = ContentState.createFromText( content )
		let newState = EditorState.createWithContent( newContent )
		
		this.setState( {editorState: newState} )
		
	};

	onBoldClick = () => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
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
						<div className="col">
							{this.state.messages}
						</div>
					</div>
				
					<div className="row">
						<div className="col border mx-2 my-2">		
							<button onClick={this.onBoldClick.bind(this)}>Bold</button>
							<div style={styles.editor} >
								<Editor
								  ref={this.setEditor}
								  editorState={this.state.editorState}
								  onChange={this.onChange}
								  handleKeyCommand={this.handleKeyCommand}
								  
								  placeholder={this.state.journalPlaceolder}
								/>
							</div>
							<button onClick={this.saveJournal}> Save current Journal entry </button>
						</div>
					</div>
					
				</div>
			</div>
		)
	}
}

export default journalView;