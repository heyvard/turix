import { PoolClient } from 'pg'

import { User } from '../types/db'
import { hentToken } from '../stravaclient/token'

export async function hentEllerOppdaterToken(athleteId: string, client: PoolClient): Promise<User> {
    const hentBrukeren = async (): Promise<User | undefined> => {
        const userList = await client.query('SELECT * from users where athlete_id = $1', [athleteId])
        if (userList.rows.length == null) {
            return undefined
        }
        return userList.rows[0]
    }
    const brukeren = await hentBrukeren()
    if (!brukeren || !brukeren.expires_at || !brukeren.refresh_token) {
        throw Error('Ingen bruker funnet')
    }
    const secondsSinceEpoch = Math.round(Date.now() / 1000)

    if (Number(brukeren.expires_at) > secondsSinceEpoch) {
        return brukeren
    }

    const oppdatert = await hentToken(brukeren.refresh_token)
    await client.query(
        `
            UPDATE users
            SET expires_at    = $2,
                refresh_token = $3,
                access_token  = $4
            WHERE id = $1;
        `,
        [brukeren.id, oppdatert.expires_at + '', oppdatert.refresh_token + '', oppdatert.access_token],
    )

    return (await hentBrukeren())!
}
