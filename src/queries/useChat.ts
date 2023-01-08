import { useQuery } from 'react-query'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from '../auth/clientApp'
import { Chat } from '../types/types'

export function UseChat() {
    const [user] = useAuthState(firebase.auth())

    return useQuery<Chat[], Error>('chat', async () => {
        const idtoken = await user?.getIdToken()
        const responsePromise = await fetch('https://betpool-2022-backend.vercel.app/api/v1/chat', {
            method: 'GET',
            headers: { Authorization: `Bearer ${idtoken}` },
        })
        return responsePromise.json()
    })
}
