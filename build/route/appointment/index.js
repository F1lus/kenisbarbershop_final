"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var luxon_1 = require("luxon");
var calculator_1 = require("./calculator");
var calendar_1 = require("../../model/calendar");
var features_controller_1 = require("../../model/db/controller/features.controller");
var isNotOverlapping = function (first, second) {
    var interval = luxon_1.Interval.fromDateTimes(second.start, second.end);
    var interval2 = luxon_1.Interval.fromDateTimes(first.start, first.end);
    return interval.intersection(interval2) === null;
};
exports.default = (0, express_1.Router)().post('/appointments', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dateTime, featuresController, feature, times, start, end;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dateTime = luxon_1.DateTime.fromISO(req.body.workday).setLocale('hu').startOf('day').setZone('Europe/Budapest');
                if (!dateTime.isValid) {
                    res.send({ error: 'wrong-date' });
                    return [2 /*return*/];
                }
                featuresController = new features_controller_1.FeaturesController();
                return [4 /*yield*/, featuresController.getAll()];
            case 1:
                feature = (_a.sent()).find(function (x) { return x.type == req.body.service; });
                return [4 /*yield*/, (0, calculator_1.getAppointments)(dateTime, feature.time)];
            case 2:
                times = _a.sent();
                start = dateTime.toISO();
                end = dateTime.plus({ day: 1 }).minus({ second: 1 }).toISO();
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
                return [2 /*return*/];
        }
    });
}); });
