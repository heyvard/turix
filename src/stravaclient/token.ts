import fetch from 'node-fetch'
import { Token } from '../types/strava'

export async function hentToken(refreshToken: string): Promise<Token> {
    let url = `https://www.strava.com/oauth/token?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&refresh_token=${refreshToken}&grant_type=refresh_token&client_secret=${process.env.STRAVA_CLIENT_SECRET}`
    const response = await fetch(url, { method: 'POST' })
    const js = (await response.json()) as Token
    return js
}
