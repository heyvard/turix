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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { MenuItem, Select, Link as MuiLink, TextField } from '@mui/material'
import { aktiviteter } from '../utils/aktivitetstyper'

const Heatmap = () => {
    const { data: megselv } = UseUser()
    const router = useRouter()

    const { activity, fom, tom } = router.query

    const { data: activities } = UseActivities()

    const [aktiviteten, setAktiviteten] = React.useState(activity || 'NordicSki')
    const [tomDato, setTomDato] = React.useState(dayjs((tom as string) || '2023-07-01'))
    const [fomDato, setFomDato] = React.useState(dayjs((fom as string) || '2022-07-01'))

    if (!megselv || !activities) {
        return <Spinner></Spinner>
    }
    const position = new LatLng(59.99, 10.7)

    const langrennUser1 = activities
        .filter((a) => a.type1 == aktiviteten)
        .filter((a) => {
            let date = dayjs(a.start_date)
            return date.isAfter(dayjs(fomDato).startOf('day'))
        })
        .filter((a) => {
            let date = dayjs(a.start_date)
            return date.isBefore(tomDato.endOf('day'))
        })
        .map((a) => {
            const activity_polyline = a.map_summary_polyline
            const activity_name = a.name
            return {
                activityPositions: polyline.decode(activity_polyline!!),
                activityName: activity_name,
                id: a.activity_id,
            }
        })

    return (
        <>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{`${aktiviteten} i perioden ${fomDato.format('YYYY-MM-DD')} - ${tomDato.format(
                        'YYYY-MM-DD',
                    )}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Select
                            sx={{ mb: 2 }}
                            value={aktiviteten}
                            label="Aktivitet"
                            onChange={(e) => setAktiviteten(e.target.value)}
                        >
                            {aktiviteter.map((a) => {
                                return (
                                    <MenuItem key={a} value={a}>
                                        {a}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                        <DatePicker
                            label="Fra og med dato"
                            value={fomDato}
                            onChange={(newValue) => newValue && setFomDato(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                            label="Til og med dato"
                            value={tomDato}
                            onChange={(newValue) => newValue && setTomDato(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </AccordionDetails>
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
                                <MuiLink
                                    target="_blank"
                                    underline="none"
                                    href={`https://www.strava.com/activities/${activity.id}`}
                                >
                                    {activity.activityName}
                                </MuiLink>
                            </Popup>
                        </Polyline>
                    ))}
                </MapContainer>
            </div>
        </>
    )
}

export default Heatmap
