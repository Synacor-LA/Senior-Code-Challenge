const functions = require('firebase-functions');

const googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyDII_KvbCZSapZTDZ99t4eZgxgZds2yJl4',
	Promise: Promise
});


function getGoogleGeocode(city, state) {
	return googleMapsClient.geocode({
		address: `${city}, ${state}`
	}).asPromise();
}

exports.getLatLong = functions.https.onRequest((req, res) => {
	const state = req.state;
	const city = req.city;

	return getGoogleGeocode(city, state).then(geocode => res.send(geocode.json.results));
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
