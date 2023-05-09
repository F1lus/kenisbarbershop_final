import { Router } from 'express'
import { getEvents, insertEvent } from '../../model/Calendar'
import { DateTime } from 'luxon'

type ServerInterval = {
    start: string,
    end: string,
    jsonTime: any
}

interface ClientRequest {
    firstname: string,
    lastname: string,
    phone: string,
    services: string,
    date: string,
    time: string,
    agree1: 'on' | 'off',
    agree2: 'on' | 'off',
}

const getInterval = (time: string, date: DateTime): ServerInterval => {
    const jsonTime = JSON.parse(time)
    const sHours = parseInt(jsonTime.start.split(':')[0])
    const sMins = parseInt(jsonTime.start.split(':')[1])

    const eHours = parseInt(jsonTime.end.split(':')[0])
    const eMins = parseInt(jsonTime.end.split(':')[1])

    const start = date.set({ hour: sHours, minute: sMins }).toISO()
    const end = date.set({ hour: eHours, minute: eMins }).toISO()

    return { start, end, jsonTime }
}

export default Router().post('/reserve', (req, res) => {
    const request: ClientRequest = req.body

    const resDate = DateTime.fromISO(request.date).setLocale('hu').setZone('Europe/Budapest')

    if (!resDate.isValid) {
        res.status(400).send({ error: 'no-date' })
        return
    }

    if (request.agree1 !== 'on' || request.agree2 !== 'on') {
        res.status(400).send({ error: 'terms-error' })
        return
    }

    if (!request.time) {
        res.status(400).send({ error: 'select-appointment' })
        return
    }

    if (!request.services) {
        res.status(400).send({ error: 'no-service' })
        return
    }

    if (
        request.firstname.length < 2 || !(/^[A-Z][A-Za-záéíóöőúüű]+[ .-]*[A-Za-záéíóöőúüű]*$/gm).test(request.firstname)
        || request.lastname.length < 2 || !(/^[A-Z][A-Za-záéíóöőúüű]+[ .-]*[A-Za-záéíóöőúüű]*$/gm).test(request.lastname)
    ) {
        res.status(400).send({ error: 'wrong-credentials' })
        return
    }

    if (!(/^[0-9]{9}$/gm.test(request.phone))) {
        res.status(400).send({ error: 'wrong-phone' })
        return
    }

    const { start, end, jsonTime } = getInterval(request.time, resDate)

    getEvents(start, end, false)
        .then(events => {
            if (events && events.length > 0) {
                return null
            }

            const event = {
                summary: `${request.lastname} ${request.firstname}`,
                description: `+36${request.phone} | ${request.services}`,
                start: {
                    dateTime: start,
                    timeZone: 'Europe/Budapest'
                },
                end: {
                    dateTime: end,
                    timeZone: 'Europe/Budapest'
                }
            }

            return insertEvent(event)
        })
        .then(result => {
            if(!result){
                res.status(200).send({ error: 'already-reserved' })
                return
            }
            res.status(200).send({ result, date: { start }, time: jsonTime.start })
        })
        .catch(err => {
            res.status(400).send({ error: err.message })
        })

})