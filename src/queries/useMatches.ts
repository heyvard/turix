import { useQuery } from 'react-query'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from '../auth/clientApp'
import { Match } from '../types/types'
import dayjs from 'dayjs'

export function UseMatches() {
    const [user] = useAuthState(firebase.auth())

    return useQuery<Match[], Error>('matches', async () => {
        const idtoken = await user?.getIdToken()
        const responsePromise = await fetch('https://betpool-2022-backend.vercel.app/api/v1/matches', {
            method: 'GET',
            headers: { Authorization: `Bearer ${idtoken}` },
        })
        let matchene: Match[] = await responsePromise.json()
        matchene.sort((a, b) => dayjs(b.game_start).unix() - dayjs(a.game_start).unix())
        return matchene
    })
}
