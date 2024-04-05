import type { NextPage } from 'next'
import React from 'react'
import { Heading } from '@navikt/ds-react'

import { UseUser } from '../queries/useUser'
import { Spinner } from '../components/loading/Spinner'
import { UseActivities } from '../queries/useActivities'
import { Syncing } from '../components/syncing'
import { YearStats } from '../components/yearstats/yearStats'
import { connectWithStrva } from '../components/stravaknapp'

const Home: NextPage = () => {
    const { data: megselv } = UseUser()
    const { data: activities } = UseActivities()

    if (!megselv || !activities) {
        return <Spinner></Spinner>
    }

    const cbUrl = window.location.href + 'api/v1/authcb'
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID

    const href = `http://www.strava.com/oauth/authorize?client_id=${clientId}&state=${megselv.id}&response_type=code&redirect_uri=${cbUrl}&approval_prompt=force&scope=activity:read`
    return (
        <div className="container mx-auto mt-24 w-full">
            <div className="flex flex-col items-center w-full">
                <Heading size="medium">Hei {megselv.name} 👋</Heading>
                <Syncing />
                {!megselv.athlete_id && <a href={href}>{connectWithStrva}</a>}
                <div className="mt-16 w-full">
                    <YearStats />
                </div>
            </div>
        </div>
    )
}

export default Home
