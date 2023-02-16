import { useQuery } from 'react-query'
import { useAuthState } from 'react-firebase-hooks/auth'
import { SimpleActivity } from '../types/db'
import { getFirebaseAuth } from '../auth/clientApp'

export function UseActivities() {
    const [user] = useAuthState(getFirebaseAuth())

    return useQuery<SimpleActivity[], Error>('activities', async () => {
        const idtoken = await user?.getIdToken()
        let responsePromise = await fetch('/api/v1/activities', {
            method: 'GET',
            headers: { Authorization: `Bearer ${idtoken}` },
        })
        return responsePromise.json()
    })
}
