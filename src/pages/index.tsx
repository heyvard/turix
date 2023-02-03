import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { UseUser } from '../queries/useUser'
import { Spinner } from '../components/loading/Spinner'
import { Typography } from '@mui/material'
import React from 'react'

const Home: NextPage = () => {
    const { data: megselv } = UseUser()

    if (!megselv) {
        return <Spinner></Spinner>
    }

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 1 }}>
                <Typography variant="h4" component="h1" align={'center'}>
                    Hei {megselv.name} 👋
                </Typography>
            </Container>
        </>
    )
}

export default Home
