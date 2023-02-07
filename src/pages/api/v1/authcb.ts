import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { getPool } from '../../../auth/authHandler'

const handler = async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    let url = `https://www.strava.com/oauth/token?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&code=${req.query.code}&grant_type=authorization_code&client_secret=${process.env.STRAVA_CLIENT_SECRET}`
    const response = await fetch(url, { method: 'POST' })
    const js = (await response.json()) as any

    const client = await getPool().connect()
    const userId = req.query.state as string
    const expires_at = js.expires_at
    const refresh_token = js.refresh_token
    const access_token = js.access_token
    const athlete_id = js.athlete.id
    await client.query(
        `
            UPDATE users
            SET expires_at    = $2,
                refresh_token = $3,
                access_token  = $4,
                athlete_id    = $5
            WHERE id = $1;
        `,
        [userId, expires_at, refresh_token, access_token, athlete_id],
    )
    await client.release()
    res.redirect('/')
}

export default handler
