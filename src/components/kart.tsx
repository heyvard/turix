import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { Spinner } from '../components/loading/Spinner'
import { useRouter } from 'next/router'
import React from 'react'
import { UseUser } from "../queries/useUser";
import { UseActivities } from "../queries/useActivities";
import { MapContainer, SVGOverlay, TileLayer } from "react-leaflet";

 const Kart = () => {
    const { data: megselv } = UseUser()
    const { data: activities } = UseActivities()

    if (!megselv || !activities) {
        return <Spinner></Spinner>
    }

    const router = useRouter()
    const { id } = router.query
    const position = [51.505, -0.09]
    const bounds = [
        [51.49, -0.08],
        [51.5, -0.06],
    ]

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 1 }}>
                <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />


                </MapContainer>,
            </Container>
        </>
    )
}

export default Kart
