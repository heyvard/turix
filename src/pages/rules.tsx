import type { NextPage } from 'next'
import Head from 'next/head'

import { Typography, Container } from '@mui/material'
import { UseStats } from '../queries/useStats'
import { Spinner } from '../components/loading/Spinner'
import React from 'react'

const Home: NextPage = () => {
    const { data: stats } = UseStats()
    if (!stats) {
        return <Spinner></Spinner>
    }
    return (
        <>
            <Head>
                <title>Regler</title>
            </Head>
            <Container maxWidth="md" sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h4" component="h2">
                    Regler!
                </Typography>
                <h3>Innskudd</h3>
                Det koster 300 kr å delta.
                <br />
                Pengene må være overført innen første kamp på vipps til 467 90 000 . Riktig donasjon til Amnesty vippses
                videre.
                <br />
                Donasjonen er på: {stats.charity} kr.
                <br />
                <h3>Premier</h3>
                Potten er på: {stats.pot} kr.
                <br />
                1. plass får 50% av potten: {stats.premier[0]} kr
                <br />
                2. plass får 30% av potten: {stats.premier[1]} kr
                <br />
                3. plass får 20% av potten: {stats.premier[2]} kr
                <br />
                <br />
                Hvis flere personer får like mange poeng så deles premiepottene for de aktuelle plassene.
                <br />
                <br />
                <i>Eksempel:</i>
                <br />
                To personer kommer på delt 2. plass.
                <br />
                Premien for 2. plass er 200 kr og 3. plass er 100 kr.
                <br />
                Begge får da 150 kr.
                <br />
                <br />
                <h3>Poengsystem</h3>
                Man får 1 poeng ganget med kampverdien for å gjette riktig utfall av kampen (hvem som vinner eller
                uavgjort). Dette ganges med kampverdien. Fra og med runde 3 dobles også denne verdien dersom antallet
                som har riktig utfall er under 20%.
                <br />
                <br />
                Treffer man riktig resultat får man 2-5 poeng avhengig av hvor mange andre som hadde riktig resultat.
                Dette ganges med kampverdien.
                <h3>Tidsfrister</h3>
                Du kan bette helt frem til kampstart. Bets sendt inn etter kampstart blir ikke lagret.
                <h3>Kampverdier</h3>
                <b>Gruppespill</b>
                <br />
                Kampverdien er 1 i runde 1 og 2. I runde 3 er kampverdien 1,5.
                <br />
                <br />
                <b>Sluttspill</b>
                <br />
                I sluttspillet tipper man på stillingen etter ordinær spilletid (90 min)
                <br />
                Kampverdier
                <ul>
                    <li>Åttenedelsfinaler: 2</li>
                    <li>Kvartfinaler: 2,5</li>
                    <li>Semifinaler: 3</li>
                    <li>Bronsefinale: 3</li>
                    <li>Finale: 5</li>
                </ul>
                <br />
                <h3>Vinner</h3>
                Du kan endre bet hele første runde av greuppespillet, deretter er det låst. Det deles ut totalt{' '}
                {stats.deltakere * 3} poeng. Disse splittes på alle som har riktig svar. Summen er antall deltagere
                ganger 3.
                <h3>Toppscorer</h3>
                Du kan endre bet hele første runde av greuppespillet, deretter er det låst. Det deles ut totalt{' '}
                {stats.deltakere * 3} poeng. Disse splittes på alle som har riktig svar. Summen er antall deltagere
                ganger 3.
            </Container>
        </>
    )
}

export default Home
