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
exports.formatAppointments = exports.getAppointments = exports.workCalculator = void 0;
var openinghrs_controller_1 = require("../../model/db/controller/openinghrs.controller");
var workCalculator = function (start, end, serviceTime) { return __awaiter(void 0, void 0, void 0, function () {
    var times;
    return __generator(this, function (_a) {
        times = [];
        while (start.plus({ minutes: serviceTime }).toMillis() < end.toMillis()) {
            times.push({
                start: start,
                end: start.plus({ minutes: serviceTime })
            });
            start = start.plus({ minutes: serviceTime });
        }
        return [2 /*return*/, times];
    });
}); };
exports.workCalculator = workCalculator;
var getAppointments = function (dateTime, serviceTime) { return __awaiter(void 0, void 0, void 0, function () {
    var start, end, c, openingHrs, openhr, endhr, openmin, closemin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                c = new openinghrs_controller_1.OpeninghrsController();
                return [4 /*yield*/, c.selectAll()];
            case 1:
                openingHrs = _a.sent();
                openhr = openingHrs.find(function (d) { return d.day === dateTime.weekday.toString(); }).openhr;
                endhr = openingHrs.find(function (d) { return d.day === dateTime.weekday.toString(); }).closehr;
                openmin = openingHrs.find(function (d) { return d.day === dateTime.weekday.toString(); }).openmin;
                closemin = openingHrs.find(function (d) { return d.day === dateTime.weekday.toString(); }).closemin;
                if (!openhr || !endhr) {
                    start = dateTime;
                    end = dateTime;
                }
                else {
                    start = dateTime.set({ hour: parseInt(openhr), minute: parseInt(openmin), second: 0 });
                    end = dateTime.set({ hour: parseInt(endhr), minute: parseInt(closemin), second: 0 });
                }
                return [2 /*return*/, (0, exports.workCalculator)(start, end, serviceTime)];
        }
    });
}); };
exports.getAppointments = getAppointments;
var formatAppointments = function (appointments) {
    return appointments.map(function (appointment) {
        return {
            start: appointment.start.toFormat('HH:mm'),
            end: appointment.end.toFormat('HH:mm')
        };
    });
};
exports.formatAppointments = formatAppointments;
