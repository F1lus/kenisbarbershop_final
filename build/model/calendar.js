"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freebusy = exports.getEvents = exports.insertEvent = void 0;
var googleapis_1 = require("googleapis");
var credentials_1 = require("./credentials");
var calendarId = "u6bu88au41o3d6qjf4cutkacv8@group.calendar.google.com";
var calendar = googleapis_1.google.calendar({ version: 'v3' });
var SCOPES = 'https://www.googleapis.com/auth/calendar';
var auth = new googleapis_1.google.auth.JWT(credentials_1.default.client_email, null, credentials_1.default.private_key, SCOPES);
var insertEvent = function (event) {
    return new Promise(function (resolve, reject) {
        calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            requestBody: event
        })
            .then(function (response) {
            resolve(response.status === 200 && response.statusText === 'OK');
        })
            .catch(function (error) {
            console.error("Hiba az esem\u00E9ny besz\u00FAr\u00E1sa sor\u00E1n: ".concat(error.message));
        });
    });
};
exports.insertEvent = insertEvent;
var getEvents = function (dateTimeStart, dateTimeEnd, holiday) {
    return new Promise(function (resolve, reject) {
        calendar.events.list({
            auth: auth,
            calendarId: holiday ? 'hu.hungarian#holiday@group.v.calendar.google.com' : calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Europe/Budapest'
        })
            .then(function (response) {
            resolve(response.data.items);
        })
            .catch(function (error) {
            console.log("Hiba az esem\u00E9nyek lek\u00E9rdez\u00E9se sor\u00E1n: ".concat(error.message));
        });
    });
};
exports.getEvents = getEvents;
var freebusy = function (dateTimeStart, dateTimeEnd) {
    return new Promise(function (resolve, reject) {
        calendar.freebusy.query({
            auth: auth,
            requestBody: {
                items: [{ id: calendarId }],
                timeMin: dateTimeStart,
                timeMax: dateTimeEnd,
            }
        })
            .then(function (response) {
            resolve(response.data.calendars[calendarId].busy);
        })
            .catch(function (error) {
            console.log("Hiba az esem\u00E9nyek lek\u00E9rdez\u00E9se sor\u00E1n: ".concat(error.message));
        });
    });
};
exports.freebusy = freebusy;
