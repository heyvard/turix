import { Box, CircularProgress } from '@mui/material'

export const Spinner = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    )
}
