import { auth } from '../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../types/apiHandlerOpts'
import { getActivites } from '../../../stravaclient/activities'
import { lagreActivity } from '../../../stravaclient/lagreActivity'

export interface SyncResponse {
    antall: number
    tidspunkt: string
    page?: number
}

const handler = async function handler(opts: ApiHandlerOpts<SyncResponse | string>): Promise<void> {
    const { res, user, client } = opts
    if (!user) {
        res.status(401).send('401')
        return
    }
    if (!user.athlete_id) {
        res.status(400).send('Ingen athlete id')
        return
    }
    if (user.done) {
        res.status(200).json({
            antall: 0,
            tidspunkt: new Date().toISOString(),
        })
        return
    }
    const perPage = 50
    const page = () => {
        if (user.page) {
            return Number(user.page)
        }
        return 1
    }
    const minPAge = page()
    const activities = await getActivites({
        userId: user.id,
        accessToken: user.access_token!,
        page: minPAge,
        per_page: perPage,
    })
    for (const activity of activities) {
        await lagreActivity(client, user, activity)
    }
    if (activities.length != perPage) {
        await client.query(
            `
                UPDATE users
                SET done = true
                WHERE id = $1;
            `,
            [user.id],
        )
    }

    await client.query(
        `
            UPDATE users
            SET page = $2
            WHERE id = $1;
        `,
        [user.id, minPAge + 1 + ''],
    )

    res.status(200).json({
        page: minPAge,
        antall: activities.length,
        tidspunkt: new Date().toISOString(),
    })
}

export default auth(handler)
