const functions = require('firebase-functions');

const googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyDII_KvbCZSapZTDZ99t4eZgxgZds2yJl4',
	Promise: Promise
});


function getGoogleGeocode(city, state) {
	return googleMapsClient.geocode({
		address: `${city},+${state}`
	}).asPromise();
}

exports.getLatLong = functions.https.onRequest((req, res) => {

	const state = req.query.state;
	const city = req.query.city;

	return getGoogleGeocode(city, state).then(geocode => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.status(200).json(geocode.json.results);
	}).catch(error => res.status(500).send(`Bad news, I'm broken`));
})