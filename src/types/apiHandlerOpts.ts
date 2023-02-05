import { JWTPayload } from 'jose'
import { PoolClient } from 'pg'

import { User } from './db'
import { NextApiRequest, NextApiResponse } from 'next'

export interface ApiHandlerOpts {
    req: NextApiRequest
    res: NextApiResponse
    jwtPayload: JWTPayload
    client: PoolClient
    user?: User
}
