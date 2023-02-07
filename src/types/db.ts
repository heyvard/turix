export interface User {
    name: string
    email: string
    picture: string
    firebase_user_id: string
    admin: boolean
    active: boolean
    id: string
    access_token?: string
    athlete_id: string
    page?: string
    done?: boolean
}

export interface SimpleActivity {
    name: string
    distance: number
    start_date: string
    type1: string
    sport_type: string
}
