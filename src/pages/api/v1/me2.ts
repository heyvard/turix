import { VercelRequest, VercelResponse } from '@vercel/node'

const handler = async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    res.status(200).json({ hei: 1234 })
}

export default handler
