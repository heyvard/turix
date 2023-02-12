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
        lengsteTur?: SimpleActivity
    }

    const aarene = [] as Aar[]
    do {
        const nesteAar = aarStart.add(1, 'year')

        const aktiviter = langrenn.filter((a) => {
            let date = dayjs(a.start_date)
            return date.isAfter(aarStart) && date.isBefore(nesteAar)
        })
        if (aktiviter.length == 0) {
            return {
                antall: 0,
                distance: 0,
                aarSlutt: nesteAar.year(),
                aarStart: aarStart.year(),
            }
        }

        const antall = aktiviter.length
        const sum = aktiviter.map((a) => a.distance).reduce((partialSum, a) => partialSum + a, 0)
        const sortert = aktiviter.sort((a, b) => a.distance - b.distance) // b - a for reverse sort
        const lengsteTur = sortert[aktiviter.length - 1]

        const aaret: Aar = {
            antall,
            distance: sum,
            aarSlutt: nesteAar.year(),
            aarStart: aarStart.year(),
            lengsteTur,
        }

        aarene.push(aaret)
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
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </Container>
        </>
    )
}
