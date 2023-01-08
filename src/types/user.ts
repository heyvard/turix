export interface User {
    id: string
    firebase_user_id: string
    picture: string
    active: boolean
    email: string
    name: string
    admin: boolean
    created_at: string
    updated_at: string
    charity: number
    winner: string
    topscorer: string | undefined
}
