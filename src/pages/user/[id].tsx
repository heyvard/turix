import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { Spinner } from '../../components/loading/Spinner'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { UseAllBets } from '../../queries/useAllBetsExtended'
import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { PastBetView } from '../../components/bet/PastBetView'
import { fixLand } from '../../components/bet/BetView'
import Link from 'next/link'
import { default as MUILink } from '@mui/material/Link/Link'

const Home: NextPage = () => {
    const { data, isLoading } = UseAllBets()

    const router = useRouter()
    const { id } = router.query
    if (!data || isLoading) {
        return <Spinner />
    }
    const user = data.users.find((a) => a.id == id)!

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 1 }}>
                <Typography variant="h4" component="h1" align={'center'}>
                    {user.name} sine bets
                </Typography>
                {user.winner && (
                    <Card sx={{ mt: 1 }}>
                        <CardContent>
                            <Link href={'/winnerbets'}>
                                <MUILink underline={'hover'} sx={{ cursor: 'pointer' }}>
                                    Vinner: {fixLand(user.winner || '')} ({user.winnerPoints} poeng)
                                </MUILink>
                            </Link>
                            <br />
                            <Link href={'/toppscorer'}>
                                <MUILink underline={'hover'} sx={{ cursor: 'pointer' }}>
                                    Toppscorer: {user.topscorer} ({user.topscorerPoints} poeng)
                                </MUILink>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {data.bets
                    .filter((a) => a.user_id == id)
                    .sort((b, a) => dayjs(a.game_start).unix() - dayjs(b.game_start).unix())
                    .map((a) => ({
                        ...a,
                        bet_id: a.match_id + a.user_id,
                        user: data.users.find((u) => u.id == a.user_id)!,
                    }))
                    .map((a) => (
                        <PastBetView key={a.bet_id} bet={a} matchside={false} />
                    ))}
            </Container>
        </>
    )
}

export default Home
