import { JWTPayload } from 'jose'
import { PoolClient } from 'pg'
import { NextApiRequest, NextApiResponse } from 'next'

import { User } from './db'

export interface ApiHandlerOpts<T = any> {
    req: NextApiRequest
    res: NextApiResponse<T>
    jwtPayload: JWTPayload
    client: PoolClient
    user?: User
}
