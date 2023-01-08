import type { NextPage } from 'next'
import Head from 'next/head'

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Container } from '@mui/system'
import { Spinner } from '../components/loading/Spinner'
import { UseAllBets } from '../queries/useAllBetsExtended'
import Link from 'next/link'
import { default as MUILink } from '@mui/material/Link'

const Leaderboard: NextPage = () => {
    const { data, isLoading } = UseAllBets()
    if (!data || isLoading) {
        return <Spinner />
    }

    data.users.sort((a, b) => a.topscorer?.localeCompare(b.topscorer || '') || 0)

    return (
        <>
            <Head>
                <title>Leaderboard</title>
            </Head>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Container maxWidth="md" sx={{ p: 0 }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Navn</TableCell>
                                    <TableCell>Toppscorer</TableCell>
                                    <TableCell>Poeng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.users.map((user, i) => {
                                    return (
                                        <TableRow
                                            key={i}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                            }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ p: 0, pl: 1 }}>
                                                <Link href={'/user/' + user?.id}>
                                                    <MUILink underline={'hover'} sx={{ cursor: 'pointer' }}>
                                                        {user?.name}
                                                    </MUILink>
                                                </Link>
                                            </TableCell>
                                            <TableCell sx={{ p: 0, pr: 3 }}>{user.topscorer}</TableCell>
                                            <TableCell sx={{ p: 0, pr: 3 }}>{user.topscorerPoints}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
        </>
    )
}

export default Leaderboard
