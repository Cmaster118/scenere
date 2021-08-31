import React from "react";

import { withRouter } from "react-router-dom";

import { Header, Features, About, ContactUs, BetaContact} from "./landingPages";
// Services, Testimonials, ContactInfo,

// I honestly dont know what to put in the Free pages yet...

class FreePages extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
        };
	}
	
	// Rendering this with Bootstrap React.... To see if there is anything really interesting I can do with it
	// So far it doesnt look all that different 
	render() {
		
		return (
			<div className="freePages">
			
				<Header />
				
				<BetaContact 
					
				/>
				<Features />
				<About />
				{/* <Services /> */}
				{/* <Testimonials /> */}
				<ContactUs 
					
				/>
				{/* <ContactInfo /> */}
				{/*Would this be better as an empty set?*/}
			</div>
		);
	}
}

export default withRouter(FreePages);