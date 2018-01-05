const functions = require('firebase-functions');
const slownessSrc = 'https://us-central1-slowness-as-a-service.cloudfunctions.net/slowifyApp';
const https = require('https');

const googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyDII_KvbCZSapZTDZ99t4eZgxgZds2yJl4',
	Promise: Promise
});


function getGoogleGeocode(city, state) {
	return googleMapsClient.geocode({
		address: `${city},+${state}`
	}).asPromise();
}

function getSlowness() {
	return new Promise((resolve, reject) => {
		let request = https.get(slownessSrc, (response) => {
			if (response.statusCode !== 200 ) {
				reject(new Error(`Error ${response.statusCode}`));
			}
			let body = [];
			response.on('data', (chunk) => body.push(chunk));
			response.on('end', () => resolve(body.join('')));
		});
		request.on('error', err => reject(new Error('Complete Failure')));
	});
}

exports.getLatLong = functions.https.onRequest((req, res) => {

	const state = req.query.state;
	const city = req.query.city;

	return getSlowness().then(slowness => {
		getGoogleGeocode(city, state).then(geocode => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.status(200).json(geocode.json.results);
	})}).catch(error => res.status(500).send(`Bad news, I'm broken`));
});