import { Link as MuiLink, MenuItem, Select, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import dayjs from 'dayjs'
import React from 'react'
import { Accordion } from '@navikt/ds-react'

import { meterTilKmVisning } from '../../utils/distanceUtils'
import { SimpleActivity } from '../../types/db'

type sortering = 'Distanse' | 'Tid' | 'Dato'

export const AktivitetListeContent = ({ aktiviteter }: { aktiviteter: SimpleActivity[] }) => {
    const [sortering, setSortering] = React.useState<sortering>('Dato')

    const aktivitetene = () => {
        if (sortering == 'Distanse') {
            return aktiviteter.sort((a, b) => b.distance - a.distance)
        }
        if (sortering == 'Tid') {
            return aktiviteter.sort((a, b) => {
                return Number(b.elapsed_time ?? 0) - Number(a.elapsed_time ?? 0)
            })
        }
        if (sortering == 'Dato') {
            return aktiviteter.sort((a, b) => dayjs(b.start_date).unix() - dayjs(a.start_date).unix())
        }
        return aktiviteter
    }
    return (
        <>
            <Select
                sx={{ mb: 2, height: '2rem' }}
                value={sortering}
                label="Sortering"
                onChange={(e) => setSortering(e.target.value as any)}
            >
                <MenuItem value="Distanse">Distanse</MenuItem>
                <MenuItem value="Tid">Tid</MenuItem>
                <MenuItem value="Dato">Dato</MenuItem>
            </Select>

            {aktivitetene().map((a, i) => {
                return (
                    <Typography key={i} variant="body1">
                        {`${dayjs(a.start_date).format('DD.MM.YYYY')} ${a.name} (${meterTilKmVisning(a.distance)})`}

                        <div style={{ marginBottom: '10px' }}>
                            <MuiLink
                                target="_blank"
                                underline="none"
                                style={{ color: '#FC4C02', fontSize: '14px' }}
                                href={'https://www.strava.com/activities/' + a.activity_id}
                            >
                                View on Strava
                            </MuiLink>
                        </div>
                    </Typography>
                )
            })}
        </>
    )
}

export const AktivitetListe = ({ aktiviteter }: { aktiviteter: SimpleActivity[] }) => {
    return (
        <Accordion.Item>
            <Accordion.Header>
                <Typography>Aktiviteter</Typography>
            </Accordion.Header>
            <Accordion.Content>
                <AktivitetListeContent aktiviteter={aktiviteter} />
            </Accordion.Content>
        </Accordion.Item>
    )
}
