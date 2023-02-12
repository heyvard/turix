import { auth } from '../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, user, client } = opts
    if (!user) {
        res.status(401)
        return
    }
    const activities = (
        await client.query(
            `
                SELECT name,
                       distance,
                       start_date,
                       type1,
                       sport_type,
                       moving_time,
                       elapsed_time
                FROM activities
                WHERE user_id = $1
                order by start_date desc;`,
            [user?.id],
        )
    ).rows
    res.status(200).json(activities)
}

export default auth(handler)
