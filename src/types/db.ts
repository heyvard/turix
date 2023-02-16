export interface User {
    name: string
    email: string
    picture: string
    firebase_user_id: string
    admin: boolean
    active: boolean
    id: string
    access_token?: string
    refresh_token?: string
    expires_at?: number
    athlete_id: string
    page?: string
    done?: boolean
}

export interface SimpleActivity {
    name: string
    activity_id: string
    distance: number
    start_date: string
    type1: string
    sport_type: string
    moving_time?: number
    elapsed_time?: number
    map_summary_polyline?: string
}
