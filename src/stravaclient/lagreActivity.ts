import { PoolClient } from 'pg'

import { User } from '../types/db'
import { Activity } from '../types/strava'

export async function lagreActivity(client: PoolClient, user: User, activity: Activity) {
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
