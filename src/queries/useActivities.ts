import { useQuery } from 'react-query'
import { useAuthState } from 'react-firebase-hooks/auth'
import { SimpleActivity } from '../types/db'
import { getFirebaseAuth } from '../auth/clientApp'

export function UseActivities(athleteId?: string) {
    const [user] = useAuthState(getFirebaseAuth())

    return useQuery<SimpleActivity[], Error>('activities' + athleteId, async () => {
        const idtoken = await user?.getIdToken()
        let input = athleteId ? '/api/v1/activities?athleteId=' + athleteId : '/api/v1/activities'
        let responsePromise = await fetch(input, {
            method: 'GET',
            headers: { Authorization: `Bearer ${idtoken}` },
        })
        return responsePromise.json()
    })
}
