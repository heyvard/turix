import React, { useEffect, useState } from 'react'
import { Accordion, BodyShort, Link, Select } from '@navikt/ds-react'

import { UseActivities } from '../../queries/useActivities'
import { kmhToPace, meterTilKmVisning, nordicSkiEmoji } from '../../utils/distanceUtils'
import { aktiviteter } from '../../utils/aktivitetstyper'

import { Aar, splittTilAar } from './splittTilAar'
import { AktivitetListe, AktivitetListeContent } from './aktivitetListe'
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
        return <BodyShort>Har ikke hentet noen aktiviteter enda</BodyShort>
    }
    const aarene = splittTilAar(activities, aktivitet)

    return (
        <>
            <Select
                className="m-2 md:w-2/5"
                value={aktivitet}
                label="Aktivitet"
                onChange={(e) => setAktivitet(e.target.value)}
            >
                {aktiviteter.map((a) => {
                    return (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    )
                })}
            </Select>
            <Accordion>
                {aarene.aar.reverse().map((row, i) => (
                    <Year key={i} row={row} aktivitet={aktivitet} />
                ))}
                {aarene.total && <Year row={aarene.total} aktivitet={aktivitet} />}
            </Accordion>
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
        <Accordion.Item>
            <Accordion.Header>
                <div className="flex justify-between w-full">
                    <BodyShort>{tittel()}</BodyShort>
                    <BodyShort>
                        {aktivitet.includes('NordicSki') && !row.total && nordicSkiEmoji(row.distance)}
                    </BodyShort>
                    <BodyShort>
                        {aktivitet != 'WeightTraining' && meterTilKmVisning(row.distance)}
                        {aktivitet == 'WeightTraining' && `${row.elapsedTime.valueOf() / BigInt(3600)} timer`}
                    </BodyShort>
                </div>
            </Accordion.Header>
            <Accordion.Content className="p-0">
                <div className="px-4 pb-2">
                    <BodyShort>{row.antall} aktiviter</BodyShort>
                    {row.lengsteTur && (
                        <BodyShort>
                            {`Lengste tur: ${row.lengsteTur.name} (${meterTilKmVisning(row.lengsteTur.distance)})`}

                            <Link
                                target="_blank"
                                underline={false}
                                className="text-strava block mb-2 text-sm"
                                href={'https://www.strava.com/activities/' + row.lengsteTur.activity_id}
                            >
                                View on Strava
                            </Link>
                        </BodyShort>
                    )}

                    <BodyShort>{`Total tid: ${row.elapsedTime.valueOf() / BigInt(3600)} timer`}</BodyShort>
                    <BodyShort>{`Total effektiv tid: ${row.movingTime.valueOf() / BigInt(3600)} timer`}</BodyShort>
                    {!minutterPerKm && (
                        <>
                            <BodyShort>{`Snitt moving speed: ${averageSpeedKmPerHour.toFixed(2)} km/t`}</BodyShort>
                            <BodyShort>
                                {`Snitt elapsed speed: ${averageElapseSpeedKmPerHour.toFixed(2)} km/t`}
                            </BodyShort>
                        </>
                    )}
                    {minutterPerKm && (
                        <>
                            <BodyShort>{`Snitt moving pace: ${kmhToPace(averageSpeedKmPerHour)}`}</BodyShort>
                            <BodyShort>{`Snitt elapsed pace: ${kmhToPace(averageElapseSpeedKmPerHour)} `}</BodyShort>
                        </>
                    )}
                </div>
                <AktivitetListe aktiviteter={row.aktiviteter} />
                <LocationGruppert aktiviteter={row.aktiviteter} />
                {row.lengsteUke && (
                    <Accordion.Item>
                        <Accordion.Header>
                            <BodyShort>
                                {`Lengste uke: Ukenummer ${row.lengsteUke.week} (${meterTilKmVisning(
                                    row.lengsteUke.totalDistance,
                                )})`}
                            </BodyShort>
                        </Accordion.Header>
                        <Accordion.Content>
                            <AktivitetListeContent aktiviteter={row.lengsteUke.activities} />
                        </Accordion.Content>
                    </Accordion.Item>
                )}
            </Accordion.Content>
        </Accordion.Item>
    )
}
