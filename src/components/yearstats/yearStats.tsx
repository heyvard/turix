import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Container,
    Link as MuiLink,
    MenuItem,
    Select,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Link from 'next/link'
import { Typography } from '@mui/material'

import { UseActivities } from '../../queries/useActivities'
import { kmhToPace, meterTilKmVisning, nordicSkiEmoji } from '../../utils/distanceUtils'
import { aktiviteter } from '../../utils/aktivitetstyper'

import { Aar, splittTilAar } from './splittTilAar'
import { AktivitetListe } from './aktivitetListe'
import { LocationGruppert } from './locationGruppert'

export const YearStats = () => {
    const { data: activities } = UseActivities()

    const initialAktivitet = () => {
        const savedAktivitet = localStorage.getItem('aktivitet')
        return savedAktivitet ? JSON.parse(savedAktivitet) : 'NordicSki'
    }

    const [aktivitet, setAktivitet] = useState<string>(initialAktivitet)

    useEffect(() => {
        localStorage.setItem('aktivitet', JSON.stringify(aktivitet))
    }, [aktivitet])

    if (!activities) {
        return null
    }
    if (activities.length == 0) {
        return <Typography>Har ikke hentet noen aktiviteter enda</Typography>
    }
    const aarene = splittTilAar(activities, aktivitet)

    return (
        <>
            <Container maxWidth="md" sx={{ p: 0 }}>
                <Select
                    sx={{ mb: 2 }}
                    value={aktivitet}
                    label="Aktivitet"
                    onChange={(e) => setAktivitet(e.target.value)}
                >
                    {aktiviteter.map((a) => {
                        return (
                            <MenuItem key={a} value={a}>
                                {a}
                            </MenuItem>
                        )
                    })}
                </Select>
                {aarene.aar.reverse().map((row, i) => (
                    <Year key={i} row={row} aktivitet={aktivitet} />
                ))}
                {aarene.total && <Year row={aarene.total} aktivitet={aktivitet} />}
            </Container>
        </>
    )
}

const Year = ({ row, aktivitet }: { row: Aar; aktivitet: string }) => {
    const tittel = () => {
        if (row.total) {
            return 'Totalt'
        }
        return aktivitet == 'NordicSki' ? `${row.start.year()}-${row.slutt.year()}` : row.start.year()
    }

    const averageSpeedKmPerHour = (row.distance / 1000 / Number(row.movingTime.valueOf())) * 3600
    const averageElapseSpeedKmPerHour = (row.distance / 1000 / Number(row.elapsedTime.valueOf())) * 3600

    const minutterPerKm = ['NordicSki', 'Run'].includes(aktivitet)
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ justifyContent: 'space-between', display: 'flex', width: 1 }}>
                    <Typography>{tittel()}</Typography>
                    <Typography>
                        {' '}
                        {aktivitet.includes('NordicSki') && !row.total && nordicSkiEmoji(row.distance)}
                    </Typography>
                    <Typography>
                        {aktivitet != 'WeightTraining' && meterTilKmVisning(row.distance)}
                        {aktivitet == 'WeightTraining' && `${row.elapsedTime.valueOf() / BigInt(3600)} timer`}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
                <Box sx={{ px: 2, pb: 1 }}>
                    <Link
                        href={{
                            pathname: 'heatmap',
                            query: {
                                activity: aktivitet,
                                fom: row.start.format('YYYY-MM-DD'),
                                tom: row.slutt.format('YYYY-MM-DD'),
                            },
                        }}
                    >
                        <MuiLink underline="none">Heatmap</MuiLink>
                    </Link>
                    <Typography variant="body1">{row.antall} aktiviter</Typography>
                    {row.lengsteTur && (
                        <Typography variant="body1">
                            <MuiLink
                                target="_blank"
                                underline="none"
                                href={'https://www.strava.com/activities/' + row.lengsteTur.activity_id}
                            >
                                {`Lengste tur: ${row.lengsteTur.name} (${meterTilKmVisning(row.lengsteTur.distance)})`}
                            </MuiLink>
                        </Typography>
                    )}

                    <Typography variant="body1">
                        {`Total tid: ${row.elapsedTime.valueOf() / BigInt(3600)} timer`}
                    </Typography>
                    <Typography variant="body1">
                        {`Total effektiv tid: ${row.movingTime.valueOf() / BigInt(3600)} timer`}
                    </Typography>
                    {!minutterPerKm && (
                        <>
                            <Typography variant="body1">
                                {`Snitt moving speed: ${averageSpeedKmPerHour.toFixed(2)} km/t`}
                            </Typography>
                            <Typography variant="body1">
                                {`Snitt elapsed speed: ${averageElapseSpeedKmPerHour.toFixed(2)} km/t`}
                            </Typography>
                        </>
                    )}
                    {minutterPerKm && (
                        <>
                            <Typography variant="body1">
                                {`Snitt moving speed: ${kmhToPace(averageSpeedKmPerHour)}`}
                            </Typography>
                            <Typography variant="body1">
                                {`Snitt elapsed speed: ${kmhToPace(averageElapseSpeedKmPerHour)} `}
                            </Typography>
                        </>
                    )}
                </Box>
                <AktivitetListe aktiviteter={row.aktiviteter} />
                <LocationGruppert aktiviteter={row.aktiviteter} />
            </AccordionDetails>
        </Accordion>
    )
}
