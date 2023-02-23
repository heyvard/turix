import { UseUser } from '../queries/useUser'
import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getFirebaseAuth } from '../auth/clientApp'
import { SyncResponse } from '../pages/api/v1/sync'
import { UseActivities } from '../queries/useActivities'

export const Syncing = () => {
    const { data: megselv } = UseUser()
    const [user] = useAuthState(getFirebaseAuth())
    const queryClient = useQueryClient()
    const { data: activities } = UseActivities()

    const { data: syncresponse } = useQuery(
        ['sync'],
        async () => {
            const idtoken = await user?.getIdToken()
            let responsePromise = await fetch('/api/v1/sync', {
                method: 'GET',
                headers: { Authorization: `Bearer ${idtoken}` },
            })
            return (await responsePromise.json()) as Promise<SyncResponse>
        },
        {
            enabled: megselv && megselv.done != true && megselv.athlete_id != null,
            onSuccess: () => {
                const queryKey = 'activities' + megselv?.athlete_id
                queryClient.invalidateQueries(queryKey).then()
                queryClient.invalidateQueries('user-me').then()
                setTimeout(() => {
                    queryClient.invalidateQueries('sync').then()
                }, 1000)
            },
        },
    )
    if (megselv?.done == true) {
        return null
    }

    return (
        <>
            <br />
            <span>La denne fanen stå oppe til alt er syncet inn </span>
            <br />

            <span>Syncet {activities?.length || 0} aktiviteter</span>
            <br />
            <span>{JSON.stringify(syncresponse)}</span>
            <br />
        </>
    )
}
