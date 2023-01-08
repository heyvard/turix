import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { Spinner } from '../components/loading/Spinner'
import dayjs from 'dayjs'
import { UseMatches } from '../queries/useMatches'
import { Typography } from '@mui/material'
import React from 'react'
import { SluttspillView } from '../components/resultatservice/SluttspillView'

const Home: NextPage = () => {
    const { data: matches } = UseMatches()
    if (!matches) {
        return <Spinner />
    }
    matches.sort((b, a) => dayjs(b.game_start).unix() - dayjs(a.game_start).unix())

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Typography variant="h4" component="h1" align={'center'}>
                    Rediger sluttspill
                </Typography>
                {matches
                    .filter((b) => dayjs(b.game_start).isAfter(dayjs()))
                    .filter((b) => Number(b.round) > 3)
                    .map((a) => (
                        <SluttspillView key={a.id} match={a} />
                    ))}
            </Container>
        </>
    )
}

export default Home
