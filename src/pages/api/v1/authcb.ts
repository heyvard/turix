import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

const handler = async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    let url = `https://www.strava.com/oauth/token?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&code=${req.query.code}&grant_type=authorization_code&client_secret=${process.env.STRAVA_CLIENT_SECRET}`
    const response = await fetch(url, { method: 'POST' })
    const js = await response.json()
    console.log(req.query)
    console.log(js)
    res.redirect('/')
}

export default handler
