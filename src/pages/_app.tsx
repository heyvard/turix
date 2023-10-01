import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import LogoutIcon from '@mui/icons-material/Logout'
import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map'
import { BottomNavigation, BottomNavigationAction, Box, CircularProgress, Menu, MenuItem, Paper } from '@mui/material'
import React, { SyntheticEvent, useState } from 'react'
import { Person } from '@mui/icons-material'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useRouter } from 'next/router'
import Head from 'next/head'
import TableChartIcon from '@mui/icons-material/TableChart'

import { Spinner } from '../components/loading/Spinner'
import { UseUser } from '../queries/useUser'
import { Theme } from '../components/theme/Theme'
import { SignInScreen } from '../components/SignIn'
import { getFirebaseAuth } from '../auth/clientApp'
import { erMock } from '../utils/erMock'

import '../styles/globals.css'

function UserFetchInnlogging(props: { children: React.ReactNode }) {
    const { data: me, isLoading } = UseUser()
    const [user] = useAuthState(getFirebaseAuth())

    const router = useRouter()

    const [anchorEl, setAnchorEl] = useState<null | Element>(null)

    const handleMenu = (event: SyntheticEvent<Element, Event>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    if (isLoading || !user || !me) {
        return <Spinner />
    }
    return (
        <>
            {props.children}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={router.pathname}
                    onChange={(event, newValue) => {
                        if (newValue == 'meny') {
                            handleMenu(event)
                            return
                        }
                        router.push(newValue)
                    }}
                >
                    <BottomNavigationAction value="/" icon={<HomeIcon />} />
                    <BottomNavigationAction value="/heatmap" icon={<MapIcon />} />
                    <BottomNavigationAction value="/tabell" icon={<TableChartIcon />} />

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem
                            onClick={async () => {
                                handleClose()
                                router.push('/')
                            }}
                        >
                            <Person />
                            {user.displayName}
                        </MenuItem>
                        <MenuItem
                            onClick={async () => {
                                await getFirebaseAuth().signOut()
                                handleClose()
                            }}
                        >
                            <LogoutIcon />
                            Logout
                        </MenuItem>
                    </Menu>
                </BottomNavigation>
            </Paper>
        </>
    )
}

function UserInnlogging(props: { children: React.ReactNode }) {
    if (erMock()) {
        return <>{props.children}</>
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [user, loading, error] = useAuthState(getFirebaseAuth())
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        )
    }
    if (!user) {
        return (
            <>
                <SignInScreen />
                {error && <h1>Opps, noe gikk feil {error?.message}</h1>}
            </>
        )
    }

    return <UserFetchInnlogging>{props.children}</UserFetchInnlogging>
}

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        /* Setting this to true causes the request to be immediately executed after initial
                           mount Even if the query had data hydrated from the server side render */
                        refetchOnMount: false,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    )

    return (
        <>
            <Head>
                <title>Strava stats</title>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
                    integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
                    crossOrigin=""
                />
            </Head>
            <Theme>
                <QueryClientProvider client={queryClient}>
                    <Box sx={{ pb: 7, width: 1 }}>
                        <UserInnlogging>
                            <Component {...pageProps} />
                        </UserInnlogging>
                    </Box>
                </QueryClientProvider>
            </Theme>
        </>
    )
}

export default MyApp
