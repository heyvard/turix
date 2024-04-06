import type { NextPage } from 'next'
import React from 'react'
import { Alert } from '@navikt/ds-react'

const Tabell: NextPage = () => {
    return (
        <div className="container mx-auto mt-10">
            <Alert variant="info" title="Under utvikling">
                Denne siden er under utvikling
            </Alert>
        </div>
    )

    /*
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
                <Grid container justifyContent="center">
                    <Grid item xs={12}>
                        <MUIDataTable
                            title="Aktiviteter"
                            data={data}
                            options={{
                                selectableRows: 'none',
                                print: false,
                            }}
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
                            ]}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
    */
}

export default Tabell
