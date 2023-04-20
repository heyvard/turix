import React, { useEffect, useState } from 'react'
import { UseActivities } from '../queries/useActivities'
import dayjs, { Dayjs } from 'dayjs'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Container,
    Link as MuiLink,
    MenuItem,
    Select,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Link from 'next/link'

import { Typography } from '@mui/material'
import { SimpleActivity } from '../types/db'
import { kmhToPace, meterTilKmVisning } from '../utils/distanceUtils'
import { aktiviteter } from '../utils/aktivitetstyper'

interface Aar {
    distance: number
    antall: number
    aarStart: Dayjs
    aarSlutt: Dayjs
    movingTime: BigInt
    elapsedTime: BigInt
    lengsteTur: SimpleActivity
    aktiviteter: SimpleActivity[]
}

type sortering = 'Distanse' | 'Tid' | 'Dato'
export const YearStats = () => {
    const { data: activities } = UseActivities()

    const initialAktivitet = () => {
        const savedAktivitet = localStorage.getItem('aktivitet')
        return savedAktivitet ? JSON.parse(savedAktivitet) : 'NordicSki'
    }

    const [aktivitet, setAktivitet] = useState(initialAktivitet)

    useEffect(() => {
        localStorage.setItem('aktivitet', JSON.stringify(aktivitet))
    }, [aktivitet])
    const [sortering, setSortering] = React.useState<sortering>('Dato')

    if (!activities) {
        return null
    }

    const langrenn = activities.filter((a) => aktivitet.includes(a.type1))

    const baseAarStart = aktivitet.includes('NordicSki') ? dayjs('1998-07-01') : dayjs('1998-01-01')

    const aarene = [] as Aar[]
    var aarStart = baseAarStart
    do {
        const nesteAar = aarStart.add(1, 'year')

        const aktiviter = langrenn.filter((a) => {
            let date = dayjs(a.start_date)
            return date.isAfter(aarStart) && date.isBefore(nesteAar)
        })
        if (aktiviter.length > 0) {
            const antall = aktiviter.length
            const totalDistanse = aktiviter.map((a) => a.distance).reduce((partialSum, a) => partialSum + a, 0)

            const totalElapsedTid = aktiviter
                .map((a) => BigInt(a.elapsed_time ?? 0))
                .reduce((partialSum, a) => partialSum + a, BigInt(0))

            const totalMovingTid = aktiviter
                .map((a) => BigInt(a.moving_time ?? 0))
                .reduce((partialSum, a) => partialSum + a, BigInt(0))

            const sortert = aktiviter.sort((a, b) => a.distance - b.distance) // b - a for reverse sort
            const lengsteTur = sortert[aktiviter.length - 1]

            const aaret: Aar = {
                antall,
                distance: totalDistanse,
                aarSlutt: nesteAar,
                aarStart: aarStart,
                elapsedTime: totalElapsedTid,
                movingTime: totalMovingTid,
                lengsteTur,
                aktiviteter: aktiviter.reverse(),
            }

            aarene.push(aaret)
        }
        aarStart = nesteAar
    } while (aarStart.year() <= dayjs().year())

    return (
        <>
            <Container maxWidth="md" sx={{ p: 0 }}>
                <Select
                    sx={{ mb: 2 }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
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
                {aarene.reverse().map((row, i) => {
                    const aar =
                        aktivitet == 'NordicSki' ? `${row.aarStart.year()}-${row.aarSlutt.year()}` : row.aarStart.year()

                    const averageSpeedKmPerHour = (row.distance / 1000 / Number(row.movingTime.valueOf())) * 3600
                    const averageElapseSpeedKmPerHour = (row.distance / 1000 / Number(row.elapsedTime.valueOf())) * 3600

                    const aktivitetene = () => {
                        if (sortering == 'Distanse') {
                            return row.aktiviteter.sort((a, b) => b.distance - a.distance)
                        }
                        if (sortering == 'Tid') {
                            return row.aktiviteter.sort((a, b) => (b.elapsed_time ?? 0) - (a.elapsed_time ?? 0))
                        }
                        if (sortering == 'Dato') {
                            return row.aktiviteter.sort(
                                (a, b) => dayjs(b.start_date).unix() - dayjs(a.start_date).unix(),
                            )
                        }
                        return row.aktiviteter
                    }

                    let minutterPerKm = ['NordicSki', 'Run'].includes(aktivitet)
                    return (
                        <Accordion key={i}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ pr: 1 }}>{aar}</Typography>
                                <Typography
                                    sx={{
                                        textAlign: 'right',
                                        width: '6em',
                                    }}
                                >
                                    {meterTilKmVisning(row.distance)}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Link
                                    href={{
                                        pathname: 'heatmap',
                                        query: {
                                            activity: aktivitet,
                                            fom: row.aarStart.format('YYYY-MM-DD'),
                                            tom: row.aarSlutt.format('YYYY-MM-DD'),
                                        },
                                    }}
                                >
                                    <MuiLink underline={'none'}>Heatmap</MuiLink>
                                </Link>
                                <Typography variant={'body1'}>{row.antall} aktiviter</Typography>
                                {row.lengsteTur && (
                                    <Typography variant={'body1'}>
                                        <MuiLink
                                            target="_blank"
                                            underline="none"
                                            href={'https://www.strava.com/activities/' + row.lengsteTur.activity_id}
                                        >
                                            {`Lengste tur: ${row.lengsteTur.name} (${meterTilKmVisning(
                                                row.lengsteTur.distance,
                                            )})`}
                                        </MuiLink>
                                    </Typography>
                                )}

                                <Typography variant={'body1'}>
                                    {`Total tid: ${row.elapsedTime.valueOf() / BigInt(3600)} timer`}
                                </Typography>
                                <Typography variant={'body1'}>
                                    {`Total effektiv tid: ${row.movingTime.valueOf() / BigInt(3600)} timer`}
                                </Typography>
                                {!minutterPerKm && (
                                    <>
                                        <Typography variant={'body1'}>
                                            {`Snitt moving speed: ${averageSpeedKmPerHour.toFixed(2)} km/t`}
                                        </Typography>
                                        <Typography variant={'body1'}>
                                            {`Snitt elapsed speed: ${averageElapseSpeedKmPerHour.toFixed(2)} km/t`}
                                        </Typography>
                                    </>
                                )}
                                {minutterPerKm && (
                                    <>
                                        <Typography variant={'body1'}>
                                            {`Snitt moving speed: ${kmhToPace(averageSpeedKmPerHour)}`}
                                        </Typography>
                                        <Typography variant={'body1'}>
                                            {`Snitt elapsed speed: ${kmhToPace(averageElapseSpeedKmPerHour)} `}
                                        </Typography>
                                    </>
                                )}

                                <Accordion sx={{ pt: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Aktiviteter</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Select
                                            sx={{ mb: 2 }}
                                            value={sortering}
                                            label="Sortering"
                                            onChange={(e) => setSortering(e.target.value as any)}
                                        >
                                            <MenuItem value={'Distanse'}>Distanse</MenuItem>
                                            <MenuItem value={'Tid'}>Tid</MenuItem>
                                            <MenuItem value={'Dato'}>Dato</MenuItem>
                                        </Select>

                                        {aktivitetene().map((a, i) => {
                                            return (
                                                <Typography key={i} variant={'body1'}>
                                                    <MuiLink
                                                        target="_blank"
                                                        underline="none"
                                                        href={'https://www.strava.com/activities/' + a.activity_id}
                                                    >
                                                        {`${dayjs(a.start_date).format('DD.MM.YYYY')} ${
                                                            a.name
                                                        } (${meterTilKmVisning(a.distance)})`}
                                                    </MuiLink>
                                                </Typography>
                                            )
                                        })}
                                    </AccordionDetails>
                                </Accordion>
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </Container>
        </>
    )
}
