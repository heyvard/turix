import { auth } from '../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../types/apiHandlerOpts'
import { User } from '../../../types/db'

const handler = async function handler(opts: ApiHandlerOpts<User>): Promise<void> {
    const { res, user, jwtPayload, client } = opts
    if (user) {
        res.status(200).json(user)
        return
    }

    const nyBruker = await client.query(
        `
            INSERT INTO users (firebase_user_id, picture, email, name, admin)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [jwtPayload.sub, jwtPayload.picture, jwtPayload.email, jwtPayload.name || jwtPayload.email, false],
    )

    res.status(200).json(nyBruker.rows[0])
}

export default auth(handler)
