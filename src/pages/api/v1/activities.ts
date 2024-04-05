import { auth } from '../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../types/apiHandlerOpts'
import { erMock } from '../../../utils/erMock'
import { testdata } from '../../../testdata/testdata'
import { SimpleActivity } from '../../../types/db'

const handler = async function handler(opts: ApiHandlerOpts<SimpleActivity[]>): Promise<void> {
    const { res, user, req, client } = opts
    if (!user) {
        res.status(401)
        return
    }
    if (erMock()) {
        res.status(200).json(testdata)
        return
    }
    const athleteId = (req.query.athleteId || user.athlete_id) as string
    const activities = (
        await client.query(
            `
                SELECT u.name as username,
                       a.name,
                       distance,
                       activity_id,
                       start_date,
                       type1,
                       sport_type,
                       moving_time,
                       map_summary_polyline,
                       elapsed_time
                FROM activities a, users u
                WHERE a.user_id = u.id::text
                and u.athlete_id = $1
                order by start_date desc;`,
            [athleteId],
        )
    ).rows
    res.status(200).json(activities)
}

export default auth(handler)
