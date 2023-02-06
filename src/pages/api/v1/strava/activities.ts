import { auth } from '../../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../../types/apiHandlerOpts'
import { getActivites } from '../../../../stravaclient/activities'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, user } = opts
    if (!user) {
        res.status(401)
        return
    }

    const data = await getActivites({ userId: user.id, accessToken: user.access_token!, page: 1, per_page: 30 })

    res.status(200).json(data)
}

export default auth(handler)
