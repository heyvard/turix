import React from 'react'
import { createTheme, responsiveFontSizes, ThemeProvider, CssBaseline } from '@mui/material'
import { blue, teal } from '@mui/material/colors'

export const Theme = (props: { children: React.ReactNode }) => {
    const customTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: blue[800],
            },
            secondary: {
                main: teal[500],
            },
            background: {
                default: '#f4f6f8',
                paper: '#ffffff',
            },
            text: {
                primary: '#333333',
                secondary: '#777777',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
            fontWeightBold: 700,
        },
        shape: {
            borderRadius: 8,
        },
    })

    return (
        <ThemeProvider theme={responsiveFontSizes(customTheme)}>
            <CssBaseline />
            {props.children}
        </ThemeProvider>
    )
}
