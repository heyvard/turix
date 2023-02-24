import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { UseUser } from '../queries/useUser'
import { Spinner } from '../components/loading/Spinner'
import React from 'react'
import { UseActivities } from '../queries/useActivities'
import MUIDataTable from 'mui-datatables'
import { meterTilKmVisning } from '../utils/distanceUtils'
import dayjs from 'dayjs'
import { Link as MuiLink } from '@mui/material'

const columns = ['Dato', 'Tittel', 'Aktivitet', 'Distanse']

const Home: NextPage = () => {
    const { data: megselv } = UseUser()
    const { data: activities } = UseActivities()

    if (!megselv || !activities) {
        return <Spinner></Spinner>
    }

    const data = activities.map((a) => {
        return [
            dayjs(a.start_date).format('YYYY.MM.DD'),
            <MuiLink
                key={a.activity_id}
                target="_blank"
                underline="none"
                href={`https://www.strava.com/activities/${a.activity_id}`}
            >
                {a.name}
            </MuiLink>,
            a.type1,
            meterTilKmVisning(a.distance),
        ]
    })

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 1 }}>
                <MUIDataTable title={'Aktiviteter'} data={data} columns={columns} />
            </Container>
        </>
    )
}

export default Home
