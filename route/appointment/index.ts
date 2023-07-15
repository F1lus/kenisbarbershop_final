import { Router } from 'express';
import { DateTime, Interval } from 'luxon';
import { getAppointments, formatAppointments, Appointment } from './calculator';
import { getEvents, freebusy } from '../../model/calendar'
import { OpeninghrsController } from '../../model/db/controller/openinghrs.controller';
import {FeaturesController} from "../../model/db/controller/features.controller";


const isNotOverlapping = (first: Appointment, second: Appointment): boolean => {
    const interval = Interval.fromDateTimes(second.start, second.end)
    const interval2 = Interval.fromDateTimes(first.start, first.end)

    return interval.intersection(interval2) === null
}

export default Router().post('/appointments', async (req, res) => {

    const dateTime = DateTime.fromISO(req.body.workday).setLocale('hu').startOf('day').setZone('Europe/Budapest')

    if (!dateTime.isValid) {
        res.send({ error: 'wrong-date' })
        return
    }

    console.log(req.body)

    const featuresController = new FeaturesController()
    const feature = (await featuresController.getAll()).find(x=>x.type == req.body.service);

    let times = await getAppointments(dateTime, feature.time)

    const start = dateTime.toISO()
    const end = dateTime.plus({ day: 1 }).minus({ second: 1 }).toISO()

    getEvents(start, end, true)
        .then(events => {
            if (events && events.length > 0) {
                return null
            }

            return freebusy(start, end)
        })
        .then(events => {

            if (!events) {
                res.send({ appointment: [] })
                return
            }

            if (!events || events.length === 0) {
                res.send({ appointment: formatAppointments(times) })
                return
            }

            events.forEach(event => {
                const eventTime = {
                    start: DateTime.fromISO(event.start).plus({ minute: 1 }).setLocale('hu').setZone('Europe/Budapest'),
                    end: DateTime.fromISO(event.end).setLocale('hu').minus({ minute: 1 }).setZone('Europe/Budapest'),
                }

                times = times.filter(time => {
                    return isNotOverlapping(time, eventTime)
                })
            })

            res.send({ appointment: formatAppointments(times) })
        }).catch(err => {
            console.log(err)
        })
})