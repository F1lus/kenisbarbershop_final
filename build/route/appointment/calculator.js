"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAppointments = exports.getAppointments = exports.workCalculator = void 0;
var workCalculator = function (start, end, serviceTime) {
    var times = [];
    while (start.toMillis() < end.toMillis()) {
        times.push({
            start: start,
            end: start.plus({ minutes: serviceTime })
        });
        start = start.plus({ minutes: serviceTime });
    }
    return times;
};
exports.workCalculator = workCalculator;
var getAppointments = function (dateTime) {
    var start, end;
    switch (dateTime.weekday) {
        case 1:
            start = dateTime.set({ hour: 12, minute: 0, second: 0 });
            end = dateTime.set({ hour: 20, minute: 0, second: 0 });
            break;
        case 2:
        case 3:
            start = dateTime.set({ hour: 10, minute: 0, second: 0 });
            end = dateTime.set({ hour: 18, minute: 0, second: 0 });
            break;
        case 4:
            start = dateTime.set({ hour: 8, minute: 0, second: 0 });
            end = dateTime.set({ hour: 16, minute: 0, second: 0 });
            break;
        case 5:
            start = dateTime.set({ hour: 9, minute: 0, second: 0 });
            end = dateTime.set({ hour: 14, minute: 0, second: 0 });
            break;
        default:
            start = dateTime;
            end = dateTime;
    }
    return (0, exports.workCalculator)(start, end, 45);
};
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
