import { NextApiRequest, NextApiResponse } from 'next'

const handler = async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    console.log('api me2')
    res.status(200).json({ hei: 1234 })
}

export default handler
