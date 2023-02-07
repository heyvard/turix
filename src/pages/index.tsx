import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { UseUser } from '../queries/useUser'
import { Spinner } from '../components/loading/Spinner'
import { Typography } from '@mui/material'
import React from 'react'
import { UseActivities } from '../queries/useActivities'
import dayjs from 'dayjs'
import { Syncing } from '../components/syncing'

const Home: NextPage = () => {
    const { data: megselv } = UseUser()
    const { data: activities } = UseActivities()

    if (!megselv || !activities) {
        return <Spinner></Spinner>
    }
    const medDato = activities
        .map((a) => ({
            ...a,
            dato: dayjs(a.start_date),
        }))
        .filter((a) => a.dato.isAfter(dayjs('10-01-2022')))
        .filter((a) => a.type1.includes('Ski'))

    let sum = 0
    medDato.forEach((a) => (sum = sum + a.distance))

    const antall = medDato.length

    let cbUrl = window.location.href + 'api/v1/authcb'
    let clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID

    let href = `http://www.strava.com/oauth/authorize?client_id=${clientId}&state=${megselv.id}&response_type=code&redirect_uri=${cbUrl}&approval_prompt=force&scope=activity:read_all,read`
    return (
        <>
            <Container maxWidth="md" sx={{ mt: 1 }}>
                <Typography variant="h4" component="h1" align={'center'}>
                    Hei {megselv.name} 👋
                </Typography>
                <Syncing></Syncing>
                {!megselv.athlete_id && <a href={href}>Koble til strava</a>}
                <br />

                {'antall skiturer i 22/23: ' + antall}
                <br />
                {'distanse i 22/23: ' + sum.toFixed(2)}
            </Container>
        </>
    )
}

export default Home
