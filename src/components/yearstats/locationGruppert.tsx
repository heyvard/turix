import { Typography } from '@mui/material'
import React from 'react'
import polyline from '@mapbox/polyline'
import { point, distance } from '@turf/turf'
import { Accordion, BodyShort } from '@navikt/ds-react'

import { SimpleActivity } from '../../types/db'
import { meterTilKmVisning } from '../../utils/distanceUtils'

import { AktivitetListeContent } from './aktivitetListe'

interface Lokasjon {
    sted: string
    koordinater: [number, number]
    kmTerskel: number
}

const locations: Lokasjon[] = [
    { sted: 'Frognerseteren', koordinater: [59.977226, 10.679983], kmTerskel: 0.5 },
    { sted: 'Sandås', koordinater: [59.954729, 10.846364], kmTerskel: 0.5 },
    { sted: 'Venabygdsfjellet', koordinater: [61.633161, 10.052135], kmTerskel: 20 },
    { sted: 'Trollvann', koordinater: [59.962437, 10.804558], kmTerskel: 0.5 },
    { sted: 'Solemskogen', koordinater: [59.979281, 10.818086], kmTerskel: 0.5 },
    { sted: 'Sognsvann', koordinater: [59.969086, 10.728309], kmTerskel: 0.5 },
    { sted: 'Movatn', koordinater: [60.038769, 10.815361], kmTerskel: 0.8 },
    { sted: 'Mobekken', koordinater: [60.022917, 10.800007], kmTerskel: 1 },
    { sted: 'Sandermosen', koordinater: [60.008321, 10.803962], kmTerskel: 1 },
    { sted: 'Mylla', koordinater: [60.241642, 10.601408], kmTerskel: 1 },
    { sted: 'Linderudkollen', koordinater: [59.9715, 10.812906], kmTerskel: 1 },
    { sted: 'Tingstadjordet', koordinater: [61.146104, 11.329203], kmTerskel: 1 },
    { sted: 'Pellestova', koordinater: [61.22435, 10.539962], kmTerskel: 3 },
    { sted: 'Girona', koordinater: [41.97533, 2.81695], kmTerskel: 10 },
    { sted: 'Gran Canaria', koordinater: [27.808816, -15.705759], kmTerskel: 20 },
    { sted: 'Tenerife', koordinater: [28.085547, -16.709235], kmTerskel: 20 },
    { sted: "Côte d'Azur", koordinater: [43.657138, 7.167585], kmTerskel: 20 },
]

export const LocationGruppert = ({ aktiviteter }: { aktiviteter: SimpleActivity[] }) => {
    const grupperte = groupActivitiesByLocation(aktiviteter)
    return (
        <Accordion>
            <Accordion.Item>
                <Accordion.Header>
                    <Typography>Aktiviteter per område</Typography>
                </Accordion.Header>
                <Accordion.Content className="p-0">
                    {Object.keys(grupperte).map((sted) => {
                        const totalDistanse = grupperte[sted]
                            .map((a) => a.distance)
                            .reduce((partialSum, a) => partialSum + a, 0)
                        return (
                            <Accordion key={sted}>
                                <Accordion.Item>
                                    <Accordion.Header>
                                        <BodyShort>{sted + ' ' + meterTilKmVisning(totalDistanse)}</BodyShort>
                                    </Accordion.Header>
                                    <Accordion.Content>
                                        <AktivitetListeContent aktiviteter={grupperte[sted]} />
                                    </Accordion.Content>
                                </Accordion.Item>
                            </Accordion>
                        )
                    })}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    )
}

interface GroupedActivities {
    [location: string]: SimpleActivity[]
}

function groupActivitiesByLocation(activities: SimpleActivity[]): GroupedActivities {
    const groupedActivities: GroupedActivities = {}

    activities.forEach((activity) => {
        if (activity.map_summary_polyline) {
            const coordinates = decodePolyline(activity.map_summary_polyline)
            const startCoord = coordinates[0]

            let foundLocation = false

            for (const loc of locations) {
                if (isNear(startCoord, loc.koordinater, loc.kmTerskel)) {
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
