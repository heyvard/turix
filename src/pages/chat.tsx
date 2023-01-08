import type { NextPage } from 'next'

import { Button, Paper, TextField } from '@mui/material'
import { Spinner } from '../components/loading/Spinner'
import { UseChat } from '../queries/useChat'
import SendIcon from '@mui/icons-material/Send'
import { useEffect, useRef, useState } from 'react'
import { UseMutateChat } from '../queries/mutateChat'
import { MessageLeft, MessageRight } from '../components/chat/bubbles'
import { UseUser } from '../queries/useUser'
import SportsBarIcon from '@mui/icons-material/SportsBar'

const TextInput = () => {
    const [input, setInput] = useState<string>('')
    const { mutate, isLoading } = UseMutateChat(input, () => {
        setInput('')
    })
    const { data: megselv } = UseUser()
    const [beer, setBeer] = useState<boolean>(false)

    const { mutate: mutateBeer } = UseMutateChat(megselv?.name + ' is drinking beer 🍻', () => {})
    return (
        <>
            <form
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '95%',
                    margin: `auto`,
                }}
                noValidate
                autoComplete="off"
            >
                <TextField style={{ width: '100%' }} value={input} onChange={(e) => setInput(e.currentTarget.value)} />
                <Button
                    variant="contained"
                    disabled={isLoading || input == ''}
                    type={'submit'}
                    onClick={(e) => {
                        e.preventDefault()

                        mutate()
                    }}
                    color="primary"
                >
                    <SendIcon />
                </Button>
                <Button
                    variant="contained"
                    disabled={beer}
                    type={'submit'}
                    onClick={(e) => {
                        e.preventDefault()
                        setBeer(true)
                        mutateBeer()
                    }}
                    color="primary"
                >
                    <SportsBarIcon />
                </Button>
            </form>
        </>
    )
}

const Home: NextPage = () => {
    const { data: chat } = UseChat()

    const { data: megselv } = UseUser()
    const bottom = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottom.current?.scrollIntoView({ behavior: 'auto' })
    }, [chat])
    if (!chat) {
        return <Spinner />
    }
    if (!megselv) {
        return <Spinner />
    }

    return (
        <>
            <Paper
                sx={{ position: 'fixed', bottom: 120, left: 0, right: 0 }}
                elevation={3}
                style={{ maxHeight: '100%', overflow: 'auto' }}
            >
                {chat.map((c) => {
                    if (megselv.id !== c.user_id) {
                        return <MessageLeft message={c.message} key={c.id} photoURL={c.picture} displayName={c.name} />
                    }
                    return <MessageRight key={c.id} message={c.message} />
                })}
                <div ref={bottom}></div>
            </Paper>
            <Paper sx={{ position: 'fixed', bottom: 60, left: 0, right: 0 }} elevation={3}>
                <TextInput></TextInput>
            </Paper>
        </>
    )
}

export default Home
