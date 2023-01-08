import { Box, Card, CardContent, MenuItem, Select } from '@mui/material'
import { Match } from '../../types/types'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { alleLagSortert } from '../../utils/lag'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from '../../auth/clientApp'
import { useQueryClient } from 'react-query'
import { rundeTilTekst } from '../../utils/rundeTilTekst'

export const SluttspillView = ({ match }: { match: Match }) => {
    const kampstart = dayjs(match.game_start)

    const [lagrer, setLagrer] = useState(false)
    const [user] = useAuthState(firebase.auth())
    const queryClient = useQueryClient()

    function endreHjemmelag(lag: 'home_team' | 'away_team') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Select
                    labelId="demo-simple-select-label"
                    disabled={lagrer}
                    id="demo-simple-select"
                    value={match[lag]}
                    label="Hvem winner VM?"
                    onChange={async (e) => {
                        try {
                            setLagrer(true)
                            const idtoken = await user?.getIdToken()
                            const value = {} as Record<string, string>
                            value[lag] = e.target.value
                            const responsePromise = await fetch(
                                `https://betpool-2022-backend.vercel.app/api/v1/matches/${match.id}`,
                                {
                                    method: 'PUT',
                                    body: JSON.stringify(value),
                                    headers: { Authorization: `Bearer ${idtoken}` },
                                },
                            )
                            if (!responsePromise.ok) {
                                window.alert('oops, feil ved lagring')
                            }
                            queryClient.invalidateQueries('matches').then()
                        } finally {
                            setLagrer(false)
                        }
                    }}
                >
                    <MenuItem value={'TBA'}>{'🤔 TBA'}</MenuItem>
                    {alleLagSortert.map((l) => {
                        return (
                            <MenuItem key={l.engelsk} value={l.engelsk}>
                                {l.flagg + ' ' + l.norsk}
                            </MenuItem>
                        )
                    })}
                </Select>
            </Box>
        )
    }

    return (
        <Card sx={{ mt: 1 }}>
            <CardContent>
                {kampstart.format('ddd, D MMM  HH:mm')}
                <br />
                {rundeTilTekst(match.round)}
                {endreHjemmelag('home_team')}
                {endreHjemmelag('away_team')}
            </CardContent>
        </Card>
    )
}
