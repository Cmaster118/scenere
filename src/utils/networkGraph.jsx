export const convertScanToWidth = (weight) => {
	
	// At these weights it starts lookin bad....
	const maxWeight = 7
	const minWeight = 1
	
	// So, if the weight coming in is just a number.... and we cant set previous ones, what do we do?
	// I guess I will keep it like this, that the weight of the line goes up to 7 in the length of time...
	
	let cappedWeight = weight

	if (cappedWeight > maxWeight) {
		cappedWeight = maxWeight
	}
	else if (cappedWeight < minWeight) {
		cappedWeight = minWeight
	}

	return cappedWeight
}
export const convertScanToColor = (senti) => {
	
	let red = 0
	let green = 0
	let blue = 0
	
	
	const maxSenti = 1
	const minSenti = -1
	let cappedSenti = senti
	if (cappedSenti > maxSenti) {
		cappedSenti = maxSenti
	}
	else if (cappedSenti < minSenti) {
		cappedSenti = minSenti
	}
	
	if (senti < 0) {
		red = Math.floor(255*(-senti))
	}
	else {
		green = Math.floor(255*senti)
	}
	
	let redHex = red.toString(16)
	if (red < 15) {
			redHex = "0"+redHex
	}
	
	let greenHex = green.toString(16)
	if (green < 15) {
			greenHex = "0"+greenHex
	}
	
	let blueHex = blue.toString(16)
	if (blue < 15) {
			blueHex = "0"+blueHex
	}
	
	return "#" + redHex + greenHex + blueHex
}
export const graphOptions = {
	nodes: {
		mass:1.1,
		shape: "box",
		//shape: "dot",
		//size: 10,
		/*
		color: {
			border:"#000000",
			background:"#FFFFFF",
		},
		*/
		//physics: false
		chosen: {
			node: function(values, id, selected, hovering) {
				values.shadow = true;
				values.color = "#AAFFAA";
				//console.log(values)
			},
			label: function(values, id, selected, hovering) {
				//console.log(values)
				values.mod = 'bold';
			}
		}
	},
	edges: {
		color: "#000000",
		arrowStrikethrough: true,
		//smooth: {"type":"curvedCW"},
		//smooth: {"type":"continuous"},
		smooth: {"type":"dynamic"},
		//physics: false,
		chosen: {
			
			edge: function(values, id, selected, hovering) {
				//console.log(values)
				values.shadow = true;
				//values.width = 3;
			},
			label: function(values, id, selected, hovering) {
				//console.log(values)
				values.size = 20;
				values.mod = 'bold';
				//values.mod = 'italic';
				
				//values.strokeWidth = 15;
			}
		}
	},
	layout: {
		hierarchical: false
	},
	interaction:{
		hover:true,
		dragNodes: true,
	},
	physics: {
		//enabled: false,
		solver: 'barnesHut',
		maxVelocity: 50,
		minVelocity: 0.1,
		
		/*
		barnesHut: {
				gravitationalConstant: -80000, 
				springConstant: 0.001, 
				springLength: 200
			}
		*/
	},
	height: "500px"
};