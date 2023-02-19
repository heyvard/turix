import type { NextPage } from 'next'
import React from 'react'
import dynamic from 'next/dynamic'

const Home: NextPage = () => {
    const DynamicComponentWithNoSSR = dynamic(() => import('../components/heatmap'), {
        ssr: false,
    })

    return <DynamicComponentWithNoSSR />
}

export default Home
