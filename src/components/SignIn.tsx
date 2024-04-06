import React from 'react'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import { Alert } from '@navikt/ds-react'

import StyledFirebaseAuth from '../auth/StyledFirebaseAuth'

// Configure FirebaseUI.
const uiConfig = {
    // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    signInFlow: 'popup',
    signInOptions: [GoogleAuthProvider.PROVIDER_ID, EmailAuthProvider.PROVIDER_ID],
}

export function SignInScreen() {
    const isFacebookInAppBrowser =
        /FB_IAB/.test(navigator.userAgent) || /FBAN/.test(navigator.userAgent) || /FBAV/.test(navigator.userAgent)
    return (
        <>
            <div className="container mx-auto mt-10 w-full">
                {isFacebookInAppBrowser && (
                    <Alert variant="warning">
                        For å logge på må du åpne denne siden utenfor facebook messenger, i vanlig browser.
                    </Alert>
                )}
                {!isFacebookInAppBrowser && <StyledFirebaseAuth uiConfig={uiConfig} />}
            </div>
        </>
    )
}
