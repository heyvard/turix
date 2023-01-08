import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { fixLand } from '../../components/bet/BetView'
import { Spinner } from '../../components/loading/Spinner'
import { useRouter } from 'next/router'
import { UseAllBets } from '../../queries/useAllBetsExtended'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { PastBetView } from '../../components/bet/PastBetView'
import { rundeTilTekst } from '../../utils/rundeTilTekst'

const Home: NextPage = () => {
    const { data, isLoading } = UseAllBets()

    const router = useRouter()
    const { id } = router.query
    if (!data || isLoading) {
        return <Spinner />
    }

    const match = data.bets.find((a) => a.match_id == id)!

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 1 }}>
                <Typography variant="h4" component="h1" align={'center'}>
                    {fixLand(match.home_team)} vs {fixLand(match.away_team)}
                </Typography>
                <Typography variant="h6" component="h2" align={'center'}>
                    {rundeTilTekst(match.round)}
                </Typography>{' '}
                <Typography variant="h6" component="h2" align={'center'}>
                    {match.home_result} - {match.away_result}
                </Typography>
                <List dense={true}>
                    <ListItem>
                        <ListItemText primary={match.matchpoeng.antallRiktigeSvar + ' hadde helt rett'} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={match.matchpoeng.antallRiktigeUtfall + ' hadde riktig utfall'} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={match.matchpoeng.riktigResultat + ' poeng for riktig resultat'} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={match.matchpoeng.riktigUtfall + ' poeng for riktig utfall'} />
                    </ListItem>
                </List>
                {data.bets
                    .filter((a) => a.match_id == id)
                    .map((a) => ({
                        ...a,
                        bet_id: a.match_id + a.user_id,
                        user: data.users.find((u) => u.id == a.user_id)!,
                    }))
                    .filter((a) => a.user)
                    .sort((b, a) => b.user.name.localeCompare(a.user.name))
                    .sort((b, a) => a.poeng - b.poeng)
                    .map((a) => (
                        <>
                            <h4>{a.user.name}</h4>
                            <PastBetView key={a.bet_id} bet={a} matchside={true} />
                        </>
                    ))}
            </Container>
        </>
    )
}

export default Home
