import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { FC, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { InternalHeader, Loader } from '@navikt/ds-react'
import { BulletListIcon, EarthIcon, HouseIcon } from '@navikt/aksel-icons'

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

    if (isLoading || !user || !me) {
        return <Spinner />
    }

    const InternalHeaderButton: FC<{
        icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>
        text: string
        url: string
        borderRight?: boolean
    }> = ({ icon: Icon, text, url, borderRight }) => {
        const router = useRouter()
        const isActive = router.pathname === url

        return (
            <InternalHeader.Button
                className={`flex flex-col items-center w-full p-2 ${borderRight ? 'border-r' : ''} ${isActive ? 'bg-gray-600 text-white' : ''}`}
                type="button"
                onClick={() => router.push(url)}
            >
                <Icon className="w-8 h-8" />
                <span className="text-sm">{text}</span>
            </InternalHeader.Button>
        )
    }

    return (
        <>
            {props.children}
            <InternalHeader className="fixed bottom-0 left-0 z-50 w-full h-16 flex justify-center">
                <div className="flex w-full max-w-md justify-between">
                    <InternalHeaderButton icon={HouseIcon} text="Hjem" url="/" borderRight={false} />
                    <InternalHeaderButton icon={EarthIcon} text="Heatmap" url="/heatmap" borderRight={false} />
                    <InternalHeaderButton icon={BulletListIcon} text="Aktiviteter" url="/tabell" borderRight={true} />
                </div>
            </InternalHeader>
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
