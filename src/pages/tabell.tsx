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

const Home: NextPage = () => {
    const { data: megselv } = UseUser()
    const { data: activities } = UseActivities()

    if (!megselv || !activities) {
        return <Spinner></Spinner>
    }

    const data = activities.map((a) => {
        return [
            dayjs(a.start_date).format('YYYY.MM.DD'),

            a.name,
            a.type1,
            meterTilKmVisning(a.distance),
            a.name,
            a.activity_id,
        ]
    })

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 1 }}>
                <MUIDataTable
                    title={'Aktiviteter'}
                    data={data}
                    columns={[
                        {
                            name: 'Dato',
                        },
                        {
                            name: 'Tittel',
                            options: {
                                customBodyRenderLite: (dataIndex: number) => {
                                    return (
                                        <MuiLink
                                            target="_blank"
                                            underline="none"
                                            href={'https://www.strava.com/activities/' + data[dataIndex][5]}
                                        >
                                            {data[dataIndex][1]}
                                        </MuiLink>
                                    )
                                },
                            },
                        },
                        { name: 'Aktivitet' },
                        { name: 'Distanse' },
                        {
                            name: 'tittelsok',
                            options: {
                                display: false,
                            },
                        },
                    ]}
                />
            </Container>
        </>
    )
}

export default Home
