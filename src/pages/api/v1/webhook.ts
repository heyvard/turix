import { NextApiRequest, NextApiResponse } from 'next'

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

    res.status(200).json({})
}
