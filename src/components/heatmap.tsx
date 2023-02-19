import { Spinner } from '../components/loading/Spinner'
import { useRouter } from 'next/router'
import React from 'react'
import { UseUser } from '../queries/useUser'
import { UseActivities } from '../queries/useActivities'
import { MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet'
import { LatLng } from 'leaflet'
import dayjs from 'dayjs'

import polyline from '@mapbox/polyline'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Heatmap = () => {
    const { data: megselv } = UseUser()
    const router = useRouter()

    const { activity, fom, tom } = router.query

    const { data: activities } = UseActivities()

    if (!megselv || !activities) {
        return <Spinner></Spinner>
    }

    const aktiviteten = activity || 'NordicSki'
    const fomDato = (fom as string) || '2022-07-01'
    const tomDato = (tom as string) || '2023-07-01'

    const position = new LatLng(59.99, 10.7)

    const langrennUser1 = activities
        .filter((a) => a.type1 == aktiviteten)
        .filter((a) => {
            let date = dayjs(a.start_date)
            return date.isAfter(dayjs(fomDato).startOf('day'))
        })
        .filter((a) => {
            let date = dayjs(a.start_date)
            return date.isBefore(dayjs(tomDato).endOf('day'))
        })
        .map((a) => {
            const activity_polyline = a.map_summary_polyline
            const activity_name = a.name
            return { activityPositions: polyline.decode(activity_polyline!!), activityName: activity_name }
        })

    return (
        <>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{`${aktiviteten} i perioden  ${fomDato}-${tomDato}`}</Typography>
                </AccordionSummary>
                <AccordionDetails></AccordionDetails>
            </Accordion>
            <div style={{ height: '87vh' }}>
                <MapContainer center={position} zoom={10} style={{ height: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
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
            </div>
        </>
    )
}

export default Heatmap
