import { NextApiRequest, NextApiResponse } from 'next'
import { getPool } from '../../../auth/authHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method == 'GET') {
        res.status(200).json({
            'hub.challenge': req.query['hub.challenge'],
        })
        return
    }
    if (req.method != 'POST') {
        res.status(404).send('Feil metode')
        return
    }
    const client = await getPool().connect()
    await client.query(
        `
            INSERT INTO webhook (body, headers)
            VALUES ($1, $2)`,
        [req.body, JSON.stringify(req.query)],
    )
    client.release()
    res.status(200).json({})
}
