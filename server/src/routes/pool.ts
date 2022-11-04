import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function poolRoutes(fastify: FastifyInstance) {
    //POOLS COUNT
    fastify.get('/pools/count', async () => {
        const count = await prisma.pool.count()

        return { count }
    })

    //CREATE POOL
    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string()
        })

        const { title } = createPoolBody.parse(request.body)

        const generate = new ShortUniqueId({ length: 6 })
        const code = String(generate()).toUpperCase()

        try {
            await request.jwtVerify()

            await prisma.pool.create({
                data: {
                    title,
                    code,
                    ownerId: request.user.sub,

                    players: {
                        create: {
                            userId: request.user.sub
                        }
                    }
                }
            })
        } catch {
            await prisma.pool.create({
                data: {
                    title,
                    code
                }
            })
        }


        return reply.status(201).send({ code })
    })

    //JOIN POOL
    fastify.post('/pools/join', {
        onRequest: [authenticate]
    },async (request, reply) => {
        const joinPoolBody = z.object({
            code: z.string()
        })

        const { code } = joinPoolBody.parse(request.body)

        const pool = await prisma.pool.findUnique({
            where: {
                code
            },
            include: {
                players: {
                    where: {
                        userId: request.user.sub
                    }
                }
            }
        })

        if (!pool) {
            return reply.status(400).send({
                message: 'Pool not found.'
            })
        }

        if (pool.players.length > 0) {
            return reply.status(400).send({
                message: 'You already joined this pool.'
            })
        }

        if (!pool.ownerId) {
            await prisma.pool.update({
                where: {
                  id: pool.id                  
                },
                data: {
                    ownerId: request.user.sub
                }
            })
        }

        await prisma.player.create({
            data: {
                poolId: pool.id,
                userId: request.user.sub
            }
        })

        return reply.status(201).send()
    })

    //LIST JOINED POOLS
    fastify.get('/pools', {
        onRequest: [authenticate]
    }, async (request) => {
        const pools = await prisma.pool.findMany({
            where: {
                players: {
                    some: {
                        userId: request.user.sub
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        players: true
                    }
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                players: {
                    select: {
                        id: true,

                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 4
                }
            }
        })

        return { pools }
    })

    //SHOW POOL DETAILS
    fastify.get('/pool/:id',{
        onRequest: [authenticate]
    }, async (request) => {
        const getPoolParams = z.object({
            id: z.string()
        })

        const { id } = getPoolParams.parse(request.params)

        const pool = await prisma.pool.findUnique({
            where: {
                id
            },
            include: {
                _count: {
                    select: {
                        players: true
                    }
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                players: {
                    select: {
                        id: true,

                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 4
                }
            }
        })

        return { pool }
    })
}