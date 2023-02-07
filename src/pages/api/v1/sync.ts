import { auth } from '../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../types/apiHandlerOpts'
import { getActivites } from '../../../stravaclient/activities'

export interface SyncResponse {
    antall: number
    tidspunkt: string
    page?: number
}

const handler = async function handler(opts: ApiHandlerOpts<SyncResponse>): Promise<void> {
    const { res, user, client } = opts
    if (!user) {
        res.status(401)
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
    let minPAge = page()
    console.log('Henter ' + minPAge)
    const activities = await getActivites({
        userId: user.id,
        accessToken: user.access_token!,
        page: minPAge,
        per_page: perPage,
    })
    for (const activity of activities) {
        await client.query(
            `
                INSERT INTO activities (user_id, activity_id, name, distance, moving_time, elapsed_time,
                                        total_elevation_gain, start_date, type1, sport_type, map_summary_polyline,
                                        raw_json)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                user.id,
                activity.id,
                activity.name,
                activity.distance,
                activity.moving_time,
                activity.elapsed_time,
                activity.total_elevation_gain,
                activity.start_date,
                activity.type,
                activity.sport_type,
                activity.map?.summary_polyline,
                JSON.stringify(activity),
            ],
        )
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
        [user.id, minPAge + 1],
    )

    res.status(200).json({
        page: minPAge,
        antall: activities.length,
        tidspunkt: new Date().toISOString(),
    })
}

export default auth(handler)
