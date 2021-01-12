// Use this or localstorage?
import Store from "store"

// Maybe I should put ALL the storage stuff here...
export const login = (tokenKey, username) => {
	Store.set('jwtSession', {user:username, token:tokenKey})
}

export const logout = () => {
	Store.remove('jwtSession')
}

export const isLoggedIn = () => {
	if (Store.get('jwtSession')) {
		return true;
	}
	
	return false;
}

// Lets try this for the Graph Data...
// See if this works out okay...
// The options may be overkill though...
export const getRadarEmotionData = (inputData) => {
	
	const data = {
		labels: ['Anger', 'Disgust', 'Fear', 'Joy', 'Sadness'],
			datasets: [ 
			{
				label: 'Confidence Levels',
				data: inputData,
				backgroundColor: 'rgba(99, 255, 132, 0.2)',
				borderColor: 'rgba(99, 255, 132, 1)',
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getRadarEmotionOptions = () => {
	const options = {
	  scale: {
		ticks: { 
			beginAtZero: true,
			suggestedMin: 0,
			suggestedMax: 1,
		},
	  },
	}
	
	return options
}

export const getSentimentData = (inputData) => {
	const data = {
	labels: ['Positive', 'Negative'],
	datasets: [
			{
			label: ['Sentiment'], 
			data: inputData,
			backgroundColor: [
				'rgba(99, 255, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(99, 255, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getSentimentOptions = () => {
	const options = {
		cutoutPercentage: 50,
	}
	
	return options
}

export const getConceptsData = (inputData, labels) => {
	const data = {
	labels: labels,
	datasets: [
			{
			label: 'Concepts Relevance',
			data: inputData,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getConceptsOptions = () => {
	const options = {
		scales: {
			yAxes: [{
					ticks: {
						beginAtZero: true,
						suggestedMin: 0,
						suggestedMax: 1,
					},
				},
			],
		},
	}
	
	return options
}

// This can probobly be merged with the other one... but it is here for perhaps a color shift?
export const getCategoryData = (inputData, labels) => {
	const data = {
	labels: labels,
	datasets: [
			{
			label: 'Categories Score',
			data: inputData,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getCategoryOptions = () => {
	const options = {
		scales: {
			yAxes: [{
					ticks: {
						beginAtZero: true,
						suggestedMin: 0,
						suggestedMax: 1,
					},
				},
			],
		},
	}
	
	return options
}


// This is where my template stuff here?
export const getDoughData = (inputData, inputData2) => {
	const data = {
		labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
		datasets: [
			{
				label: '# of Votes',
				data: inputData,
				backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
				borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getDoughOptions = () => {
	const options = {
		cutoutPercentage: 50,
	}
	
	return options
}

export const getRadarData = (inputData) => {
	const data = {
		labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
			datasets: [ 
			{
				label: '# of Votes',
				data: inputData,
				backgroundColor: 'rgba(99, 255, 132, 0.2)',
				borderColor: 'rgba(99, 255, 132, 1)',
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getRadarOptions = () => {
	const options = {
	  scale: {
		ticks: { beginAtZero: true },
	  },
	}
	
	return options
}

export const getLineData = (inputData, inputData2) => {
	const data = {
		labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
			datasets: [ 
			{
				label: '# of Votes',
				data: inputData,
				fill: false,
				backgroundColor: 'rgb(99, 255, 132)',
				borderColor: 'rgba(99, 255, 132, 0.2)',
			},
			{
				label: '# of Votes2',
				data: inputData2,
				fill: false,
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgba(255, 99, 132, 0.2)',
			},
		],
	}
	
	return data
}

export const getLineOptions = () => {
	const options = {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	}
	
	return options
}

export const getBarData = (inputData) => {
	const data = {
	labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	datasets: [
			{
			label: '# of Votes',
			data: inputData,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getBarOptions = () => {
	const options = {
		scales: {
			yAxes: [{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	}
	
	return options
}

export const getScatterData = (inputData, inputData2) => {
	const data = {
		labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
			datasets: [ 
			{
				label: '# of Votes',
				data: inputData,
				backgroundColor: 'rgba(99, 255, 132, 0.2)',
				borderColor: 'rgba(99, 255, 132, 1)',
				borderWidth: 1,
			},
			{
				label: '# of Votes2',
				data: inputData2,
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getScatterOptions = () => {
	const options = {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true,
				},
			},],
		},
	}
	
	return options
}