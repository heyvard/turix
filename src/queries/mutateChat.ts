import { useMutation, useQueryClient } from 'react-query'

import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from '../auth/clientApp'
import { Chat } from '../types/types'
import { UseUser } from './useUser'

export function UseMutateChat(message: string, successCallback: () => void) {
    const queryClient = useQueryClient()
    const [user] = useAuthState(firebase.auth())
    const { data: megselv } = UseUser()
    if (!megselv) {
        throw Error('Meg selv skal være satt')
    }
    return useMutation<unknown, Error>(
        async () => {
            const idtoken = await user?.getIdToken()
            const responsePromise = await fetch(`https://betpool-2022-backend.vercel.app/api/v1/chat`, {
                method: 'POST',
                body: JSON.stringify({ message }),
                headers: { Authorization: `Bearer ${idtoken}` },
            })
            return responsePromise.json()
        },

        {
            onSuccess: () => {
                queryClient.invalidateQueries('chat').then()
            },
            onMutate: () => {
                successCallback()
                const previousTodos = queryClient.getQueryData('chat') as Chat[]
                const ny: Chat = {
                    message,
                    id: 'optimistic',
                    picture: megselv.picture,
                    name: megselv.name,
                    created_at: Date(),
                    user_id: megselv.id,
                }
                // Optimistically update to the new value
                queryClient.setQueryData('chat', [...previousTodos, ny])

                // Return a context object with the snapshotted value
                return { previousTodos }
            },
        },
    )
}
