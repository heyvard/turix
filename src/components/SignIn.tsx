import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from '../auth/clientApp'
import { Container } from '@mui/system'
import { BottomNavigation, BottomNavigationAction, Card, CardContent, Paper, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'

// Configure FirebaseUI.
const uiConfig = {
    // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID],
}

export function SignInScreen() {
    const isFacebookInAppBrowser =
        /FB_IAB/.test(navigator.userAgent) || /FBAN/.test(navigator.userAgent) || /FBAV/.test(navigator.userAgent)
    return (
        <>
            <Container maxWidth="md">
                {isFacebookInAppBrowser && (
                    <Card sx={{ mt: 1 }}>
                        <CardContent>
                            <Typography variant="subtitle2" align={'center'}>
                                For å logge på må du åpne denne siden utenfor facebook messenger, i vanlig browser.
                            </Typography>
                        </CardContent>
                    </Card>
                )}
                {!isFacebookInAppBrowser && <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />}
            </Container>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation showLabels>
                    <BottomNavigationAction disabled icon={<HomeIcon />} />
                </BottomNavigation>
            </Paper>
        </>
    )
}
