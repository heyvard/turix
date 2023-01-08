import { MatchBet } from '../../queries/useAllBetsExtended'

export type Utfall = 'H' | 'U' | 'B'

export interface MatchPoeng {
    matchid: string
    riktigUtfall: number
    riktigResultat: number
    antallRiktigeSvar: number
    antallRiktigeUtfall: number
    utfall: Utfall | null
}

export function finnUtfall(home: String, away: String): Utfall {
    const tallHome = Number(home)
    const tallAway = Number(away)
    if (tallHome > tallAway) {
        return 'H'
    }
    if (tallHome < tallAway) {
        return 'B'
    }
    return 'U'
}

export function regnUtScoreForKamp(bets: MatchBet[]): Map<string, MatchPoeng> {
    const matchMap = new Map<string, MatchBet[]>()

    bets.forEach((bet) => matchMap.set(bet.match_id, []))
    bets.forEach((bet) => matchMap.get(bet.match_id)?.push(bet))

    const res = [] as MatchPoeng[]
    matchMap.forEach((bets, match) => {
        const homeResult = bets[0].home_result
        const awayResult = bets[0].away_result

        if (homeResult == null || awayResult == null) {
            res.push({
                matchid: match,
                riktigUtfall: 0,
                riktigResultat: 0,
                antallRiktigeSvar: 0,
                antallRiktigeUtfall: 0,
                utfall: null,
            })
        } else {
            let riktigeSvar = 0
            let riktigeUtfall = 0
            let utfall = finnUtfall(homeResult, awayResult)

            const round = Number(bets[0].round)

            const finnVekting = () => {
                switch (round) {
                    case 3:
                        return 1.5
                    case 4:
                        return 2
                    case 5:
                        return 2.5
                    case 6:
                        return 3
                    case 7:
                        return 3
                    case 8:
                        return 5
                }
                return 1
            }
            const vekting = finnVekting()
            let faktiskeBets = 0
            bets.forEach((b) => {
                const riktig = b.home_result == b.home_score && b.away_result == b.away_score
                if (riktig) {
                    riktigeSvar++
                }
                if (b.home_score && b.away_score) {
                    faktiskeBets++
                    const betUtfall = finnUtfall(b.home_score, b.away_score)
                    if (betUtfall == utfall) {
                        riktigeUtfall++
                    }
                }
            })

            const riktigResultat = () => {
                if (riktigeSvar <= 1) {
                    return 5
                }
                if (riktigeSvar <= 2) {
                    return 4
                }
                if (riktigeSvar <= 3) {
                    return 3
                }
                if (riktigeSvar <= 5) {
                    return 2
                }
                return 1
            }

            const _skalDobles = riktigeUtfall < faktiskeBets * 0.2 && round > 2

            res.push({
                matchid: match,
                riktigUtfall: vekting * (_skalDobles ? 2 : 1),
                riktigResultat: riktigResultat() * vekting,
                antallRiktigeSvar: riktigeSvar,
                antallRiktigeUtfall: riktigeUtfall,
                utfall: utfall,
            })
        }
    })

    const mappet = new Map<string, MatchPoeng>()
    res.forEach((a) => {
        mappet.set(a.matchid, a)
    })
    return mappet
}
