import { getActivites } from '../stravaclient/activities'
import { getPool } from '../auth/authHandler'

export async function syncAllActivities(userId: string, token: string) {
    console.log('Starter syncing')
    const dbClient = await getPool().connect()

    let page = 1
    const perPage = 200
    while (true) {
        console.log('henter page ' + page)
        const activities = await getActivites({
            userId,
            accessToken: token,
            page,
            per_page: perPage,
        })

        for (const activity of activities) {
            await dbClient.query(
                `
                    INSERT INTO activities (user_id, activity_id, name, distance, moving_time, elapsed_time, total_elevation_gain, start_date, type1, sport_type, map_summary_polyline, raw_json)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [
                    userId,
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
        /*

        t.string('user_id').index().notNullable()
        t.string('activity_id').unique().notNullable()
        t.string('name').notNullable()
        t.double('distance').nullable()
        t.integer('moving_time').nullable()
        t.integer('elapsed_time').nullable()
        t.integer('total_elevation_gain').nullable()
        t.timestamp('start_date').nullable()
        t.string('type1').nullable()
        t.string('sport_type').nullable()
        t.string('map_summary_polyline').nullable()
        t.string('raw_json').notNullable()
 */

        if (activities.length != perPage) {
            break
        }
        page++
    }
}
