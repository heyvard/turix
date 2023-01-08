import type { NextPage } from 'next'
import Head from 'next/head'

import {
    Avatar,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { Container } from '@mui/system'
import { Spinner } from '../components/loading/Spinner'
import { UseAllBets } from '../queries/useAllBetsExtended'
import Link from 'next/link'
import { calculateLeaderboard } from '../components/results/calculateAllScores'
import { default as MUILink } from '@mui/material/Link'

function plassVisning(plass: number) {
    switch (plass) {
        case 1:
            return '🥇'
        case 2:
            return '🥈'
        case 3:
            return '🥉'
    }
    return plass
}

const Leaderboard: NextPage = () => {
    const { data, isLoading } = UseAllBets()
    if (!data || isLoading) {
        return <Spinner />
    }
    const lista = calculateLeaderboard(data.bets, data.users)
    lista.sort((a, b) => b.poeng - a.poeng)

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
                                    <TableCell align="center">Plass</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>Navn</TableCell>
                                    <TableCell align="right">Poeng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lista.map((row, i) => {
                                    const user = data.users.find((a) => a.id == row.userid)
                                    if (!user) {
                                        return null
                                    }
                                    return (
                                        <TableRow
                                            key={row.userid}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                            }}
                                        >
                                            <TableCell align="center" sx={{ pt: 1, pb: 2 }}>
                                                <Typography variant="h2" sx={{ p: 0 }}>
                                                    {plassVisning(i + 1)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left" sx={{ p: 0 }}>
                                                {user?.picture && (
                                                    <Link href={'/user/' + user?.id}>
                                                        <Avatar
                                                            alt={user?.name}
                                                            src={user?.picture}
                                                            sx={{ width: '50px', height: '50px' }}
                                                        />
                                                    </Link>
                                                )}
                                                {!user?.picture && (
                                                    <Link href={'/user/' + user?.id}>
                                                        <Avatar
                                                            alt={user?.name}
                                                            sx={{
                                                                width: '50px',
                                                                height: '50px',
                                                            }}
                                                        >
                                                            {user?.name?.substring(0, 1)}
                                                        </Avatar>
                                                    </Link>
                                                )}
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ p: 0, pl: 1 }}>
                                                <Link href={'/user/' + user?.id}>
                                                    <MUILink underline={'hover'} sx={{ cursor: 'pointer' }}>
                                                        {user?.name}
                                                    </MUILink>
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right" sx={{ p: 0, pr: 3 }}>
                                                {row.poeng.toFixed(1)}
                                            </TableCell>
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
