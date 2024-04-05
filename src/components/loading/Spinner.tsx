import { Loader } from '@navikt/ds-react'

export const Spinner = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader size="3xlarge" title="Venter..." />
        </div>
    )
}
