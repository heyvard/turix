import { useRouter } from 'next/router'
import React from 'react'
import { MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet'
import { LatLng } from 'leaflet'
import polyline from '@mapbox/polyline'
import { BodyShort, Link, Select } from '@navikt/ds-react'

import { UseActivities } from '../queries/useActivities'
import { UseUser } from '../queries/useUser'
import { aktiviteter } from '../utils/aktivitetstyper'
import { meterTilKmVisning } from '../utils/distanceUtils'

import { Spinner } from './loading/Spinner'

const Heatmap = () => {
    const { data: megselv } = UseUser()
    const router = useRouter()

    const { activity, fom, tom } = router.query

    const { data: activities } = UseActivities()

    const [aktiviteten, setAktiviteten] = React.useState(activity || 'NordicSki')

    if (!megselv || !activities) {
        return <Spinner></Spinner>
    }
    const position = new LatLng(59.99, 10.7)

    const langrennUser1 = activities
        .filter((a) => a.type1 == aktiviteten)
        .map((a) => {
            const activity_polyline = a.map_summary_polyline
            const activity_name = a.name
            return {
                activityPositions: polyline.decode(activity_polyline!),
                activityName: activity_name,
                id: a.activity_id,
                distance: a.distance,
            }
        })

    return (
        <>
            <div className="flex">
                <Select
                    className="p-2 md:w-2/5"
                    value={aktiviteten}
                    label="Aktivitet"
                    onChange={(e) => setAktiviteten(e.target.value)}
                >
                    {aktiviteter.map((a) => {
                        return (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        )
                    })}
                </Select>
            </div>
            <div style={{ height: '74vh' }}>
                <MapContainer center={position} zoom={10} style={{ height: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {langrennUser1.map((activity, i) => (
                        <Polyline
                            color="red"
                            smoothFactor={0.3}
                            weight={5}
                            fillOpacity={0.1}
                            opacity={0.7}
                            key={i}
                            positions={activity.activityPositions}
                        >
                            <Popup>
                                <Link
                                    target="_blank"
                                    underline={false}
                                    href={`https://www.strava.com/activities/${activity.id}`}
                                >
                                    {activity.activityName}
                                </Link>
                                <BodyShort>{meterTilKmVisning(activity.distance)}</BodyShort>
                            </Popup>
                        </Polyline>
                    ))}
                </MapContainer>
            </div>
        </>
    )
}

export default Heatmap
