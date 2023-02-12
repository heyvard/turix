import React from 'react'
import { UseActivities } from '../queries/useActivities'
import dayjs from 'dayjs'
import { Accordion, AccordionDetails, AccordionSummary, Container } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { Typography } from '@mui/material'
import { SimpleActivity } from '../types/db'
import { meterTilKmVisning } from '../utils/distanceUtils'

export const Langrennsaar = () => {
    const { data: activities } = UseActivities()

    if (!activities) {
        return null
    }

    const langrenn = activities.filter((a) => a.type1 == 'NordicSki' || a.type1 == 'BackcountrySki')
    var aarStart = dayjs('2010-07-01')

    interface Aar {
        distance: number
        antall: number
        aarStart: number
        aarSlutt: number
        movingTime: number
        elapsedTime: number
        lengsteTur?: SimpleActivity
    }

    const aarene = [] as Aar[]
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
                aarSlutt: nesteAar.year(),
                aarStart: aarStart.year(),
                elapsedTime: totalElapsedTid ?? 0,
                movingTime: totalMovingTid ?? 0,
                lengsteTur,
            }

            aarene.push(aaret)
        }
        aarStart = nesteAar
    } while (aarStart.year() < dayjs().year())

    return (
        <>
            <Container maxWidth="md" sx={{ p: 0 }}>
                {aarene.reverse().map((row, i) => {
                    return (
                        <Accordion key={i}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ pr: 1 }}>{`${row.aarStart}-${row.aarSlutt}`}</Typography>
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
                                <Typography variant={'body1'}>{row.antall} skiturer</Typography>
                                {row.lengsteTur && (
                                    <Typography variant={'body1'}>
                                        {`Lengste tur: ${row.lengsteTur.name} (${meterTilKmVisning(
                                            row.lengsteTur.distance,
                                        )})`}
                                    </Typography>
                                )}

                                <Typography variant={'body1'}>
                                    {`Total tid: ${Math.round(row.elapsedTime)} timer`}
                                </Typography>
                                <Typography variant={'body1'}>
                                    {`Total effektiv tid: ${Math.round(row.movingTime)} timer`}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </Container>
        </>
    )
}
