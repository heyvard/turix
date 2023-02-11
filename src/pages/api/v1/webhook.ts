import { NextApiRequest, NextApiResponse } from 'next'
import { getPool } from '../../../auth/authHandler'
import { hentEllerOppdaterToken } from '../../../auth/hentEllerOppdaterToken'
import { getActivity } from '../../../stravaclient/activities'
import { lagreActivity } from '../../../stravaclient/lagreActivity'

interface WebookRequest {
    aspect_type: 'create' | 'update' | 'delete'

    object_id: number
    object_type: 'activity' | 'athlete'
    owner_id: number
}

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
    console.log('webhook request' + req.body)
    const client = await getPool().connect()

    await client.query(
        `
            INSERT INTO webhook (body, headers)
            VALUES ($1, $2)`,
        [req.body, JSON.stringify(req.query)],
    )
    const body = req.body as WebookRequest
    if (body.object_type == 'activity') {
        if (body.aspect_type == 'update' || body.aspect_type == 'delete') {
            await client.query(
                `
                    delete
                    from activities
                    where activity_id = $1`,
                [`${body.object_id}`],
            )
        }

        if (body.aspect_type == 'update' || body.aspect_type == 'create') {
            const user = await hentEllerOppdaterToken(`${body.owner_id}`, client)
            const activity = await getActivity({
                accessToken: user.access_token!!,
                activityId: `${body.object_id}`,
            })
            await lagreActivity(client, user, activity)
        }
    }
    client.release()

    res.status(200).json({})
}
