import React from "react";
import { slide as Menu } from 'react-burger-menu';

export class Sidebar extends React.Component {

	constructor(props) {
        super(props);
		this.state = {
			
		}
	}
	
	render() {
		return (
			<Menu>
				<a className="menu-item" href="/scenere">
					Home
				</a>

				<a className="menu-item" href="/scenere">
					Laravel
				</a>

				<a className="menu-item" href="/scenere">
					Angular
				</a>

				<a className="menu-item" href="/scenere">
					React
				</a>

				<a className="menu-item" href="/scenere">
					Vue
				</a>

				<a className="menu-item" href="/scenere">
					Node
				</a>
			</Menu>
		)
			
	}
}