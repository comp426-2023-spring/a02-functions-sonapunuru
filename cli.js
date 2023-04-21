#!/usr/bin/env node


//import dependencies
import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';


//process arguments
var agrs = minimist(process.argv.slice(2));


//create the help text
if (args.h) {
	Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    		-h            Show this help message and exit.
   		-n, -s        Latitude: N positive; S negative.
    		-e, -w        Longitude: E positive; W negative.
    		-z            Time zone: uses tz.guess() from moment-timezone by default.
    		-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    		-j            Echo pretty JSON from open-meteo API and exit.
			process.exit(0);
}

//extract system timezone
const timezone = moment.tz.guess();


//set latitude and longitude
const latitude = args.n || args.s * -1;
const longitude = args.e || args.w * -1;


//weather data
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=weathercode,temperature_2m_max,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=' + timezone);

const data = await response.json();


//allow user to log out
if (args.j) {
	console.log(data);
	process.exit(0);
}


//define days according to minimist's output
let days;

if (args.d == null) {
	days = 1;
} else {
	days = args.d;
}


//create weather messages
let weather = "";
if (data.daily.precipitation_hours[days] > 0) {
	weather += "Expect rain! ";
} else {
	weather += "It will be sunny!";
}

//append the appropriate string to the weather message
if (days == 0) {
	weather += "today";
} else if (days > 1) {
	weather += "in " + days + " days.";
} else {
	weather += "tomorrow.";
}

//push weather message to console
console.log(weather);
