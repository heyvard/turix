import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { SyntheticEvent, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Loader } from '@navikt/ds-react'

import { Spinner } from '../components/loading/Spinner'
import { UseUser } from '../queries/useUser'
import { SignInScreen } from '../components/SignIn'
import { getFirebaseAuth } from '../auth/clientApp'
import { erMock } from '../utils/erMock'

import '../styles/global.css'

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

    /**
     * todo   <Menu
     *                     id="menu-appbar"
     *                     anchorEl={anchorEl}
     *                     anchorOrigin={{
     *                         vertical: 'top',
     *                         horizontal: 'right',
     *                     }}
     *                     keepMounted
     *                     transformOrigin={{
     *                         vertical: 'bottom',
     *                         horizontal: 'right',
     *                     }}
     *                     open={Boolean(anchorEl)}
     *                     onClose={handleClose}
     *                 >
     *                     <MenuItem
     *                         onClick={async () => {
     *                             handleClose()
     *                             router.push('/')
     *                         }}
     *                     >
     *                         <Person />
     *                         {user.displayName}
     *                     </MenuItem>
     *                     <MenuItem
     *                         onClick={async () => {
     *                             await getFirebaseAuth().signOut()
     *                             handleClose()
     *                         }}
     *                     >
     *                         <LogoutIcon />
     *                         Logout
     *                     </MenuItem>
     *                 </Menu>
     *
     */
    return (
        <>
            {props.children}
            <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                    >
                        <svg
                            className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                            Hjem
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/heatmap')}
                        className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                    >
                        <svg
                            className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M5 9a7 7 0 1 1 8 6.93V21a1 1 0 1 1-2 0v-5.07A7.001 7.001 0 0 1 5 9Zm5.94-1.06A1.5 1.5 0 0 1 12 7.5a1 1 0 1 0 0-2A3.5 3.5 0 0 0 8.5 9a1 1 0 0 0 2 0c0-.398.158-.78.44-1.06Z"
                                clip-rule="evenodd"
                            />
                        </svg>

                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                            Heatmap
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/tabell')}
                        className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                    >
                        <svg
                            className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-width="2"
                                d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                            />
                        </svg>

                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                            Aktiviteter
                        </span>
                    </button>
                </div>
            </div>
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
            <div className="flex justify-center items-center min-h-screen">
                <Loader size="3xlarge" title="Venter..." />
            </div>
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
                <title>Turix</title>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
                    integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
                    crossOrigin=""
                />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <link rel="apple-touch-icon" href="/logo-rund-180.png" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <UserInnlogging>
                    <Component {...pageProps} />
                </UserInnlogging>
            </QueryClientProvider>
        </>
    )
}

export default MyApp
