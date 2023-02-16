import { FirebaseApp, initializeApp } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { Auth, getAuth } from '@firebase/auth'

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let auth: Auth | undefined = undefined
let app: FirebaseApp | undefined = undefined

export function getFirebaseApp() {
    if (!app) {
        app = initializeApp(clientCredentials)
    }
    return app
}

export function getFirebaseAuth() {
    if (!auth) {
        auth = getAuth(getFirebaseApp())
    }
    return auth
}
