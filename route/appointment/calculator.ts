import { DateTime } from "luxon"
import { OpeninghrsController } from "../../model/db/controller/openinghrs.controller"

export type Appointment = {
    start: DateTime,
    end: DateTime,
}

export type TimeFormat = {
    start: string,
    end: string,
}

export const workCalculator = async (start: DateTime, end: DateTime, serviceTime:number): Promise<Appointment[]> => {

    const times: Appointment[] = []

    while (start.plus({ minutes: serviceTime}).toMillis() < end.toMillis()) {
        times.push({
            start: start,
            end: start.plus({ minutes: serviceTime })
        })

        start = start.plus({ minutes: serviceTime })
    }

    return times
}

export const getAppointments = async (dateTime: DateTime, serviceTime:number) : Promise<Appointment[]> => {
    let start: DateTime, end: DateTime
    const c = new OpeninghrsController();

    const openingHrs = await c.selectAll();
    const openhr = openingHrs.find(d => d.day === dateTime.weekday.toString()).openhr;
    const endhr = openingHrs.find(d => d.day === dateTime.weekday.toString()).closehr;
    const openmin = openingHrs.find(d => d.day === dateTime.weekday.toString()).openmin;
    const closemin = openingHrs.find(d => d.day === dateTime.weekday.toString()).closemin;

    if(!openhr || !endhr){
        start = dateTime
        end = dateTime
    }
    else{
        start = dateTime.set({hour: parseInt(openhr), minute: parseInt(openmin), second:0})
        end = dateTime.set({hour: parseInt(endhr), minute: parseInt(closemin), second:0})
    }
    return workCalculator(start, end, serviceTime)
}

export const formatAppointments = (appointments : Appointment[]) : TimeFormat[] => {
    return appointments.map(appointment => {
        return {
            start: appointment.start.toFormat('HH:mm'),
            end: appointment.end.toFormat('HH:mm')
        }
    })
}