import fetch from 'node-fetch'

import { Activity } from '../types/strava'

interface Opts {
    userId: string
    accessToken: string
    page: number
    per_page: number
}

export async function getActivites(opts: Opts) {
    const url = `https://www.strava.com/api/v3/athlete/activities?per_page=${opts.per_page}&page=${opts.page}`
    const response = await fetch(url, { method: 'GET', headers: { authorization: `Bearer ${opts.accessToken}` } })
    return (await response.json()) as Activity[]
}

interface GetActivityOpts {
    activityId: string
    accessToken: string
}

export async function getActivity(opts: GetActivityOpts) {
    const url = `https://www.strava.com/api/v3/activities/${opts.activityId}`
    const response = await fetch(url, { method: 'GET', headers: { authorization: `Bearer ${opts.accessToken}` } })
    return (await response.json()) as Activity
}
