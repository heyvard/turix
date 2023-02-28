import React from 'react'
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
import { meterTilKmVisning } from '../utils/distanceUtils'
import { aktiviteter } from '../utils/aktivitetstyper'

type sortering = 'Distanse' | 'Tid' | 'Dato'
export const YearStats = () => {
    const { data: activities } = UseActivities()
    const [aktivitet, setAktivitet] = React.useState('NordicSki')
    const [sortering, setSortering] = React.useState<sortering>('Dato')

    if (!activities) {
        return null
    }

    const langrenn = activities.filter((a) => a.type1 == aktivitet)

    const baseAarStart = aktivitet == 'NordicSki' ? dayjs('1998-07-01') : dayjs('1998-01-01')

    interface Aar {
        distance: number
        antall: number
        aarStart: Dayjs
        aarSlutt: Dayjs
        movingTime: number
        elapsedTime: number
        lengsteTur: SimpleActivity
        aktiviteter: SimpleActivity[]
    }

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
                .map((a) => a.elapsed_time)
                .reduce((partialSum, a) => (partialSum ?? 0) + (a ?? 0) / 3600, 0)
            const totalMovingTid = aktiviter
                .map((a) => a.moving_time)
                .reduce((partialSum, a) => (partialSum ?? 0) + (a ?? 0) / 3600, 0)
            const sortert = aktiviter.sort((a, b) => a.distance - b.distance) // b - a for reverse sort
            const lengsteTur = sortert[aktiviter.length - 1]

            const aaret: Aar = {
                antall,
                distance: totalDistanse,
                aarSlutt: nesteAar,
                aarStart: aarStart,
                elapsedTime: totalElapsedTid ?? 0,
                movingTime: totalMovingTid ?? 0,
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
                    const _snittfart = () => {
                        //TODO: Fiks snittfart
                        const base = (row.movingTime * 50) / (row.distance / 1000)
                        const sekunder = (base - Math.floor(base)) * 60
                        return `${Math.floor(base)}:${sekunder.toFixed(0)}` + '  ' + base.toFixed(2)
                    }

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
                                    {`Total tid: ${Math.round(row.elapsedTime)} timer`}
                                </Typography>
                                <Typography variant={'body1'}>
                                    {`Total effektiv tid: ${Math.round(row.movingTime)} timer`}
                                </Typography>
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
