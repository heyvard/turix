import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React from 'react'
import { SimpleActivity } from '../../types/db'
import polyline from '@mapbox/polyline'
import { point, distance } from '@turf/turf'
import { AktivitetListeContent } from './aktivitetListe'
import { meterTilKmVisning } from '../../utils/distanceUtils'

interface Lokasjon {
    sted: string
    koordinater: [number, number]
}

const locations: Lokasjon[] = [
    { sted: 'Frognerseteren', koordinater: [59.977226, 10.679983] },
    { sted: 'Sandås', koordinater: [59.954729, 10.846364] },
    { sted: 'Venabygdsfjellet', koordinater: [61.633161, 10.052135] },
    { sted: 'Trollvann', koordinater: [59.962437, 10.804558] },
    { sted: 'Solemskogen', koordinater: [59.979281, 10.818086] },
    { sted: 'Sognsvann', koordinater: [59.969086, 10.728309] },
    { sted: 'Movatn', koordinater: [60.038769, 10.815361] },
]

export const LocationGruppert = ({ aktiviteter }: { aktiviteter: SimpleActivity[] }) => {
    const grupperte = groupActivitiesByLocation(aktiviteter)
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Aktivteter per område</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
                {Object.keys(grupperte).map((sted) => {
                    const totalDistanse = grupperte[sted]
                        .map((a) => a.distance)
                        .reduce((partialSum, a) => partialSum + a, 0)
                    return (
                        <Accordion key={sted}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ justifyContent: 'space-between', display: 'flex', width: 1 }}>
                                    <Typography>{sted}</Typography>
                                    <Typography>{meterTilKmVisning(totalDistanse)}</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <AktivitetListeContent aktiviteter={grupperte[sted]} />
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </AccordionDetails>
        </Accordion>
    )
}

interface GroupedActivities {
    [location: string]: SimpleActivity[]
}

function groupActivitiesByLocation(activities: SimpleActivity[], threshold = 0.5): GroupedActivities {
    const groupedActivities: GroupedActivities = {}

    activities.forEach((activity) => {
        if (activity.map_summary_polyline) {
            const coordinates = decodePolyline(activity.map_summary_polyline)
            const startCoord = coordinates[0]

            let foundLocation = false

            for (const loc of locations) {
                if (isNear(startCoord, loc.koordinater, threshold)) {
                    if (!groupedActivities[loc.sted]) {
                        groupedActivities[loc.sted] = []
                    }
                    groupedActivities[loc.sted].push(activity)
                    foundLocation = true
                    break
                }
            }

            if (!foundLocation) {
                const unknownLocationName = `Ukjent`
                if (!groupedActivities[unknownLocationName]) {
                    groupedActivities[unknownLocationName] = []
                }
                groupedActivities[unknownLocationName].push(activity)
            }
        }
    })

    return groupedActivities
}

function decodePolyline(polylineString: string): [number, number][] {
    return polyline.decode(polylineString)
}

function isNear(coord1: [number, number], coord2: [number, number], threshold = 0.5): boolean {
    const point1 = point(coord1)
    const point2 = point(coord2)
    const distanceInKm = distance(point1, point2)
    return distanceInKm <= threshold
}
