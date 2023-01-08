import { useMutation, useQueryClient } from 'react-query'

import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from '../auth/clientApp'

export function UseMutateMatch(
    id: string,
    homeScore: number | null,
    awayScore: number | null,
    successCallback: () => void,
) {
    const queryClient = useQueryClient()
    const [user] = useAuthState(firebase.auth())

    return useMutation<unknown, Error>(
        async () => {
            const idtoken = await user?.getIdToken()
            const responsePromise = await fetch(`https://betpool-2022-backend.vercel.app/api/v1/matches/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ home_score: homeScore, away_score: awayScore }),
                headers: { Authorization: `Bearer ${idtoken}` },
            })
            return responsePromise.json()
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('matches').then()
                queryClient.invalidateQueries('all-bets').then()
                successCallback()
            },
        },
    )
}
