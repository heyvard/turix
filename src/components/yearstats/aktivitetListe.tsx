import dayjs from 'dayjs'
import React from 'react'
import { Accordion, BodyShort, Link, Select } from '@navikt/ds-react'

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
            <Select value={sortering} label="Sortering" onChange={(e) => setSortering(e.target.value as any)}>
                <option value="Distanse">Distanse</option>
                <option value="Tid">Tid</option>
                <option value="Dato">Dato</option>
            </Select>

            {aktivitetene().map((a, i) => {
                return (
                    <BodyShort key={i}>
                        {`${dayjs(a.start_date).format('DD.MM.YYYY')} ${a.name} (${meterTilKmVisning(a.distance)})`}

                        <div style={{ marginBottom: '10px' }}>
                            <Link
                                target="_blank"
                                underline={false}
                                className="text-strava block mb-2 text-sm"
                                href={'https://www.strava.com/activities/' + a.activity_id}
                            >
                                View on Strava
                            </Link>
                        </div>
                    </BodyShort>
                )
            })}
        </>
    )
}

export const AktivitetListe = ({ aktiviteter }: { aktiviteter: SimpleActivity[] }) => {
    return (
        <Accordion.Item>
            <Accordion.Header>
                <BodyShort>Aktiviteter</BodyShort>
            </Accordion.Header>
            <Accordion.Content>
                <AktivitetListeContent aktiviteter={aktiviteter} />
            </Accordion.Content>
        </Accordion.Item>
    )
}
