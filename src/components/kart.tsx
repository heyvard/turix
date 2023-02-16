import { Spinner } from '../components/loading/Spinner'
import { useRouter } from 'next/router'
import React from 'react'
import { UseUser } from '../queries/useUser'
import { UseActivities } from '../queries/useActivities'
import { MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { LatLng } from 'leaflet'
import dayjs from 'dayjs'

var polyline = require('@mapbox/polyline')

export function ChangeView({ coords }: any) {
    const map = useMap()
    map.setView(coords, 12)
    return null
}

const Kart = () => {
    const { data: megselv } = UseUser()
    const router = useRouter()

    const { user1, user2 } = router.query

    const { data: activities } = UseActivities(user1 as string)
    const { data: activitiesUser2 } = UseActivities(user2 as string)

    if (!megselv || !activities || !activitiesUser2) {
        return <Spinner></Spinner>
    }

    const position = new LatLng(59.99, 10.7)

    const langrennUser1 = activities
        .filter((a) => a.type1 == 'NordicSki')
        .filter((a) => {
            let date = dayjs(a.start_date)
            return date.isAfter(dayjs('2022-07-01'))
        })
        .map((a) => {
            const activity_polyline = a.map_summary_polyline
            const activity_name = a.name
            return { activityPositions: polyline.decode(activity_polyline), activityName: activity_name }
        })

    const langrennUser2 = activitiesUser2
        .filter((a) => a.type1 == 'NordicSki')
        .filter((a) => {
            let date = dayjs(a.start_date)
            return date.isAfter(dayjs('2022-07-01'))
        })
        .map((a) => {
            const activity_polyline = a.map_summary_polyline
            const activity_name = a.name
            return { activityPositions: polyline.decode(activity_polyline), activityName: activity_name }
        })

    return (
        <MapContainer center={position} zoom={10} style={{ height: '90vh' }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {langrennUser2.map((activity, i) => (
                <Polyline color={'blue'} opacity={99} key={i} positions={activity.activityPositions}>
                    <Popup>
                        <div>
                            <h2>{activity.activityName}</h2>
                        </div>
                    </Popup>
                </Polyline>
            ))}
            {langrennUser1.map((activity, i) => (
                <Polyline color={'orange'} opacity={99} key={i} positions={activity.activityPositions}>
                    <Popup>
                        <div>
                            <h2>{activity.activityName}</h2>
                        </div>
                    </Popup>
                </Polyline>
            ))}
        </MapContainer>
    )
}

export default Kart
