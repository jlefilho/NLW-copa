import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { poolRoutes } from './routes/pool'
import { userRoutes } from './routes/user'
import { matchRoutes } from './routes/match'
import { betRoutes } from './routes/bet'
import { authRoutes } from './routes/auth'

async function start() {
    const fastify = Fastify({
        logger: true,        
    })

    await fastify.register(cors, {
        origin: true
    })

    await fastify.register(jwt, {
        secret: 'nlwcopa'
    })

    await fastify.register(poolRoutes)
    await fastify.register(userRoutes)
    await fastify.register(matchRoutes)
    await fastify.register(betRoutes)
    await fastify.register(authRoutes)

    await fastify.listen({ port:3333 })
}

start()