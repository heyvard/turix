import type { NextPage } from 'next'

import { UseMyBets } from '../queries/useMyBets'
import { Container } from '@mui/system'
import { BetView } from '../components/bet/BetView'
import { Spinner } from '../components/loading/Spinner'
import dayjs from 'dayjs'
import { Card, CardContent, Typography } from '@mui/material'
import Link from 'next/link'
import { default as MUILink } from '@mui/material/Link/Link'
import React from 'react'
import { UseUser } from '../queries/useUser'

const Home: NextPage = () => {
    const { data: myBets } = UseMyBets()
    const { data: megselv } = UseUser()

    if (!myBets || !megselv) {
        return <Spinner />
    }

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Typography variant="h4" component="h1" align={'center'}>
                    Mine bets
                </Typography>
                <Card sx={{ mt: 1 }}>
                    <CardContent>
                        <Link href={'/user/' + megselv.id}>
                            <MUILink underline={'hover'} sx={{ cursor: 'pointer' }}>
                                Mine tidligere bets
                            </MUILink>
                        </Link>
                    </CardContent>
                </Card>
                {myBets
                    .filter((b) => dayjs(b.game_start).isAfter(dayjs()))
                    .map((a) => (
                        <BetView key={a.bet_id} bet={a} matchside={false} />
                    ))}
            </Container>
        </>
    )
}

export default Home
