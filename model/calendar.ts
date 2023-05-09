import { google, calendar_v3 } from 'googleapis'
import CREDENTIALS from './credentials'

const calendarId = "u6bu88au41o3d6qjf4cutkacv8@group.calendar.google.com"

const calendar = google.calendar({ version: 'v3' })
const SCOPES = 'https://www.googleapis.com/auth/calendar'

const auth = new google.auth.JWT(CREDENTIALS.client_email, null, CREDENTIALS.private_key, SCOPES)

export const insertEvent = (event: calendar_v3.Schema$Event): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        calendar.events.insert({
            auth,
            calendarId,
            requestBody: event
        })
        .then(response => {
            resolve(response.status === 200 && response.statusText === 'OK')
        })
        .catch(error => {
            console.error(`Hiba az esemény beszúrása során: ${error.message}`)
        })
    })
}

export const getEvents = (dateTimeStart: string, dateTimeEnd: string, holiday: boolean): Promise<calendar_v3.Schema$Event[]> => {
    return new Promise((resolve, reject) => {
        calendar.events.list({
            auth,
            calendarId: holiday ? 'hu.hungarian#holiday@group.v.calendar.google.com' : calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Europe/Budapest'
        })
        .then(response => {
            resolve(response.data.items)
        })
        .catch(error => {
            console.log(`Hiba az események lekérdezése során: ${error.message}`)
        })
    })
}

export const freebusy = (dateTimeStart: string, dateTimeEnd: string): Promise<calendar_v3.Schema$TimePeriod[]> => {
    return new Promise((resolve, reject) => {
        calendar.freebusy.query({
            auth,
            requestBody: {
                items: [{ id: calendarId }],
                timeMin: dateTimeStart,
                timeMax: dateTimeEnd,
            }
        })
        .then(response => {
            resolve(response.data.calendars[calendarId].busy)
        })
        .catch(error => {
            console.log(`Hiba az események lekérdezése során: ${error.message}`)
        })
    })
}

