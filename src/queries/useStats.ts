import { useQuery } from 'react-query'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from '../auth/clientApp'
import { UserCharity } from '../types/types'

type Stats = {
    charity: number
    pot: number
    deltakere: number
    premier: number[]
}

export function UseStats() {
    const [user] = useAuthState(firebase.auth())

    return useQuery<Stats, Error>('stats', async () => {
        const idtoken = await user?.getIdToken()
        let responsePromise = await fetch('https://betpool-2022-backend.vercel.app/api/v1/stats', {
            method: 'GET',
            headers: { Authorization: `Bearer ${idtoken}` },
        })
        let stats = (await responsePromise.json()) as UserCharity[]

        const charity = stats.map((a) => (a.charity / 100.0) * 300).reduce((partialSum, a) => partialSum + a, 0)
        const pot = stats.length * 300 - charity
        const deltakere = stats.length
        return {
            charity,
            pot,
            deltakere,
            premier: [Math.round(pot * 0.5), Math.round(pot * 0.3), Math.round(pot * 0.2)],
        }
    })
}
