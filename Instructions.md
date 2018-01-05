# Synacor Senior Developer Code Challenge

At Synacor, we often write microservices as facades for one or more third-party services. These microservices fulfill two purposes:

* They enable us to make the calls that make sense for our uses, not the calls that the third-party provider designed in (AKA massaging data to better fit our needs)
* Caching, of course

We’d like to see how you can handle working with this kind of a product.

- [The Challenge](#the-challenge)
- [Request and response formats](#request-and-response-formats)
- [Third-Party APIs](#third-party-apis)
	- [Location](#location)
	- [Weather](#weather)
- [Acceptance criteria](#acceptance-criteria)

## The Challenge

We have a third-party provider who gives us weather for given locations. Their API response includes all of their weather data for a single location. Our front-end displays a _limited subset_ of that weather data for _multiple_ user-favorited locations. (The front-end handles management of user favorites through a separate service; in this case, just go ahead and choose 5 locations).

There is a second API which we use to translate user-favorited locations -- e.g. “Baltimore, MD” -- to the latitude/longitude dyad required by our weather partner, e.g. “39.29, -76.61”. This API provider is pretty flaky, so handling their slowness and errors is a significant issue for us.

We need an internal API that serves as a facade for these two services, allowing our front end developers to make a single API request to power the UI of the entire widget. Your service will field these requests which contain multiple location values (e.g., ["Baltimore, MD", "Reston, VA", "Playa Vista, CA"]), and return just the information needed by the UI. The UI is expecting the following data points, for each location, to create an entry: Location, Temperature, Icon URL.

## Request and response formats

Please feel free to design this API as you see best. However, it should:

* Take multiple locations, each in a “City, St.” format
* For each location, return the location, temperature, and a URL pointing to an icon for the weather type
* Fail gracefully, or otherwise handle well, an error from either API

## Third-Party APIs

We have two CORS-enabled API endpoints:

### Location
https://us-central1-location-service-6a71d.cloudfunctions.net/getLatLong?city={city}&state={st}

Get the geocoded information for the city and state. For example:

```
GET  https://us-central1-location-service-6a71d.cloudfunctions.net/getLatLong?city=baltimore&state=md
```
Will return:
```json
[{
	"address_components": [{
			"long_name": "Baltimore",
			"short_name": "Baltimore",
			"types": [
				"locality",
				"political"
			]
		},
		{
			"long_name": "Maryland",
			"short_name": "MD",
			"types": [
				"administrative_area_level_1",
				"political"
			]
		},
		{
			"long_name": "United States",
			"short_name": "US",
			"types": [
				"country",
				"political"
			]
		}
	],
	"formatted_address": "Baltimore, MD, USA",
	"geometry": {
		"bounds": {
			"northeast": {
				"lat": 39.3722059,
				"lng": -76.5294528
			},
			"southwest": {
				"lat": 39.1972069,
				"lng": -76.71151909999999
			}
		},
		"location": {
			"lat": 39.2903848,
			"lng": -76.6121893
		},
		"location_type": "APPROXIMATE",
		"viewport": {
			"northeast": {
				"lat": 39.3722059,
				"lng": -76.5294528
			},
			"southwest": {
				"lat": 39.1972069,
				"lng": -76.71151909999999
			}
		}
	},
	"place_id": "ChIJt4P01q4DyIkRWOcjQqiWSAQ",
	"types": [
		"locality",
		"political"
	]
}]
```

> _Note:_ The value you need there is in `geometry.location`.

### Weather
https://weathersync.herokuapp.com/weather/$lat,$lng

Get weather for a given latitude and longitude. For example:

```
GET https://weathersync.herokuapp.com/weather/39.2903848,-76.6121893
```

Will return

```json
{
	coord: {
		lon: -76.61,
		lat: 39.29
	},
	weather: [{
		id: 804,
		main: "Clouds",
		description: "overcast clouds",
		icon: "04n"
	}],
	base: "stations",
	main: {
		temp: 282.48,
		pressure: 1019,
		humidity: 87,
		temp_min: 281.15,
		temp_max: 284.15
	},
	visibility: 16093,
	wind: {
		speed: 1.69,
		deg: 237.501
	},
	clouds: {
		all: 90
	},
	dt: 1510797120,
	sys: {
		type: 1,
		id: 1315,
		message: 0.17,
		country: "US",
		sunrise: 1510833088,
		sunset: 1510869042
	},
	id: 4347778,
	name: "Baltimore",
	cod: 200
}
```

>_Note:_ This API call will return an {icon} property. Your API should return an _absolute_ URL for the icon, formed as http://openweathermap.org/img/w/${icon}.png

## Acceptance criteria

You may use PHP, Go, or Node.js to complete this task.

* Code must be written by you, with minimal libraries or dependencies.

	* If you use Go, please try to use only the stdlib.
	* If you use Node, you may use any LTS version you prefer, and also use Express, Koa, or Hapi, and a test framework of your choice.
	* For PHP, please use version 7. If you choose to use a framework, you may use Lumen.

* Assume your service is behind a reverse proxy, and attempt to return sensible cache headers.
* Our providers update their current temperature readings every 10 minutes.
* Provide unit tests (really, we test everything at Synacor!)
* Document your API in a README.md (or another format if you have a tool that you prefer, and which distributes documentation that we can read in a text editor or Web browser).
