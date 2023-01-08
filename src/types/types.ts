export interface LeaderboardLinje {
    picture?: string
    name: string
    userid: string
    score: number
}

export interface UserCharity {
    charity: number
}

export interface Bet {
    game_start: string
    away_team: string
    home_team: string
    home_score: number | null
    away_score: number | null
    match_id: string
    bet_id: string
    round: string
}

export interface Chat {
    message: string
    id: string
    created_at: string
    name: string
    picture: string
    user_id: string
}

export interface Match {
    game_start: string
    away_team: string
    home_team: string
    home_score: number | null
    away_score: number | null
    id: string
    round: string
}
