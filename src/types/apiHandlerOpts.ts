import { JWTPayload } from 'jose'
import { PoolClient } from 'pg'

import { User } from './db'
import { NextApiRequest, NextApiResponse } from 'next'

export interface ApiHandlerOpts<T = any> {
    req: NextApiRequest
    res: NextApiResponse<T>
    jwtPayload: JWTPayload
    client: PoolClient
    user?: User
}
