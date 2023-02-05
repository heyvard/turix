import { VercelRequest, VercelResponse } from '@vercel/node'
import { JWTPayload } from 'jose'
import { PoolClient } from 'pg'

import { User } from './db'

export interface ApiHandlerOpts {
    req: VercelRequest
    res: VercelResponse
    jwtPayload: JWTPayload
    client: PoolClient
    user?: User
}
