import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { Spinner } from '../components/loading/Spinner'
import dayjs from 'dayjs'
import { UseMatches } from '../queries/useMatches'
import { MatchView } from '../components/resultatservice/MatchView'
import { Typography } from '@mui/material'
import React from 'react'

const Home: NextPage = () => {
    const { data: matches } = UseMatches()
    if (!matches) {
        return <Spinner />
    }

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Typography variant="h4" component="h1" align={'center'}>
                    Rediger resultater
                </Typography>
                {matches
                    .filter((b) => dayjs(b.game_start).isBefore(dayjs()))
                    .map((a) => (
                        <MatchView key={a.id} match={a} />
                    ))}
            </Container>
        </>
    )
}

export default Home
