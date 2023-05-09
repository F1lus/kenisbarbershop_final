"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Calendar_1 = require("../../model/Calendar");
var luxon_1 = require("luxon");
var getInterval = function (time, date) {
    var jsonTime = JSON.parse(time);
    var sHours = parseInt(jsonTime.start.split(':')[0]);
    var sMins = parseInt(jsonTime.start.split(':')[1]);
    var eHours = parseInt(jsonTime.end.split(':')[0]);
    var eMins = parseInt(jsonTime.end.split(':')[1]);
    var start = date.set({ hour: sHours, minute: sMins }).toISO();
    var end = date.set({ hour: eHours, minute: eMins }).toISO();
    return { start: start, end: end, jsonTime: jsonTime };
};
exports.default = (0, express_1.Router)().post('/reserve', function (req, res) {
    var request = req.body;
    var resDate = luxon_1.DateTime.fromISO(request.date).setLocale('hu').setZone('Europe/Budapest');
    if (!resDate.isValid) {
        res.status(400).send({ error: 'no-date' });
        return;
    }
    if (request.agree1 !== 'on' || request.agree2 !== 'on') {
        res.status(400).send({ error: 'terms-error' });
        return;
    }
    if (!request.time) {
        res.status(400).send({ error: 'select-appointment' });
        return;
    }
    if (!request.services) {
        res.status(400).send({ error: 'no-service' });
        return;
    }
    if (request.firstname.length < 2 || !(/^[A-Z][A-Za-záéíóöőúüű]+[ .-]*[A-Za-záéíóöőúüű]*$/gm).test(request.firstname)
        || request.lastname.length < 2 || !(/^[A-Z][A-Za-záéíóöőúüű]+[ .-]*[A-Za-záéíóöőúüű]*$/gm).test(request.lastname)) {
        res.status(400).send({ error: 'wrong-credentials' });
        return;
    }
    if (!(/^[0-9]{9}$/gm.test(request.phone))) {
        res.status(400).send({ error: 'wrong-phone' });
        return;
    }
    var _a = getInterval(request.time, resDate), start = _a.start, end = _a.end, jsonTime = _a.jsonTime;
    (0, Calendar_1.getEvents)(start, end, false)
        .then(function (events) {
        if (events && events.length > 0) {
            return null;
        }
        var event = {
            summary: "".concat(request.lastname, " ").concat(request.firstname),
            description: "+36".concat(request.phone, " | ").concat(request.services),
            start: {
                dateTime: start,
                timeZone: 'Europe/Budapest'
            },
            end: {
                dateTime: end,
                timeZone: 'Europe/Budapest'
            }
        };
        return (0, Calendar_1.insertEvent)(event);
    })
        .then(function (result) {
        if (!result) {
            res.status(200).send({ error: 'already-reserved' });
            return;
        }
        res.status(200).send({ result: result, date: { start: start }, time: jsonTime.start });
    })
        .catch(function (err) {
        res.status(400).send({ error: err.message });
    });
});
