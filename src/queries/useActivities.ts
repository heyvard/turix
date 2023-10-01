import { useQuery } from 'react-query'
import { useAuthState } from 'react-firebase-hooks/auth'

import { SimpleActivity } from '../types/db'
import { getFirebaseAuth } from '../auth/clientApp'

import { UseUser } from './useUser'

export function UseActivities(athleteId?: string) {
    const [user] = useAuthState(getFirebaseAuth())
    const { data: megselv } = UseUser()

    const queryKey = 'activities' + (athleteId || megselv?.athlete_id)
    return useQuery<SimpleActivity[], Error>(queryKey, async () => {
        const idtoken = await user?.getIdToken()
        const input = athleteId ? '/api/v1/activities?athleteId=' + athleteId : '/api/v1/activities'
        const responsePromise = await fetch(input, {
            method: 'GET',
            headers: { Authorization: `Bearer ${idtoken}` },
        })
        return responsePromise.json()
    })
}
