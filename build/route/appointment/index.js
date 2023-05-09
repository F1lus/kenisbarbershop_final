"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var luxon_1 = require("luxon");
var calculator_1 = require("./calculator");
var calendar_1 = require("../../model/calendar");
var openinghrs_controller_1 = require("../../model/db/controller/openinghrs.controller");
var isNotOverlapping = function (first, second) {
    var interval = luxon_1.Interval.fromDateTimes(second.start, second.end);
    var interval2 = luxon_1.Interval.fromDateTimes(first.start, first.end);
    return interval.intersection(interval2) === null;
};
exports.default = (0, express_1.Router)().post('/appointments', function (req, res) {
    var dateTime = luxon_1.DateTime.fromISO(req.body.workday).setLocale('hu').startOf('day').setZone('Europe/Budapest');
    if (!dateTime.isValid) {
        res.send({ error: 'wrong-date' });
        return;
    }
    var ohr = new openinghrs_controller_1.OpeninghrsController();
    ohr.selectAll().then(function (e) {
        console.log(e);
    });
    var times = (0, calculator_1.getAppointments)(dateTime);
    var start = dateTime.toISO();
    var end = dateTime.plus({ day: 1 }).minus({ second: 1 }).toISO();
    (0, calendar_1.getEvents)(start, end, true)
        .then(function (events) {
        if (events && events.length > 0) {
            return null;
        }
        return (0, calendar_1.freebusy)(start, end);
    })
        .then(function (events) {
        if (!events) {
            res.send({ appointment: [] });
            return;
        }
        if (!events || events.length === 0) {
            res.send({ appointment: (0, calculator_1.formatAppointments)(times) });
            return;
        }
        events.forEach(function (event) {
            var eventTime = {
                start: luxon_1.DateTime.fromISO(event.start).plus({ minute: 1 }).setLocale('hu').setZone('Europe/Budapest'),
                end: luxon_1.DateTime.fromISO(event.end).setLocale('hu').minus({ minute: 1 }).setZone('Europe/Budapest'),
            };
            times = times.filter(function (time) {
                return isNotOverlapping(time, eventTime);
            });
        });
        res.send({ appointment: (0, calculator_1.formatAppointments)(times) });
    }).catch(function (err) {
        console.log(err);
    });
});
