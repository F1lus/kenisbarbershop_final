import { DateTime } from "luxon"

export type Appointment = {
    start: DateTime,
    end: DateTime,
}

export type TimeFormat = {
    start: string,
    end: string,
}

export const workCalculator = (start: DateTime, end: DateTime, serviceTime: number): Appointment[] => {

    const times: Appointment[] = []

    while (start.toMillis() < end.toMillis()) {
        times.push({
            start: start,
            end: start.plus({ minutes: serviceTime })
        })

        start = start.plus({ minutes: serviceTime })
    }

    return times
}

export const getAppointments = (dateTime: DateTime) : Appointment[] => {
    let start: DateTime, end: DateTime

    switch (dateTime.weekday) {
        case 1:
            start = dateTime.set({ hour: 12, minute: 0, second: 0 })
            end = dateTime.set({ hour: 20, minute: 0, second: 0 })
            break
        case 2:
        case 3:
            start = dateTime.set({ hour: 10, minute: 0, second: 0 })
            end = dateTime.set({ hour: 18, minute: 0, second: 0 })
            break
        case 4:
            start = dateTime.set({ hour: 8, minute: 0, second: 0 })
            end = dateTime.set({ hour: 16, minute: 0, second: 0 })
            break
        case 5:
            start = dateTime.set({ hour: 9, minute: 0, second: 0 })
            end = dateTime.set({ hour: 14, minute: 0, second: 0 })
            break
        default:
            start = dateTime
            end = dateTime
    }

    return workCalculator(start, end, 45)
}

export const formatAppointments = (appointments : Appointment[]) : TimeFormat[] => {
    return appointments.map(appointment => {
        return {
            start: appointment.start.toFormat('HH:mm'),
            end: appointment.end.toFormat('HH:mm')
        }
    })
}