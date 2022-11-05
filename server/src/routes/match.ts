import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function matchRoutes(fastify: FastifyInstance) {

    //LIST MATCHES
   fastify.get('/pools/:id/matches', {
    onRequest: [authenticate]
}, async (request) => {
    const getPoolParams = z.object({
        id: z.string()
    })

    const { id } = getPoolParams.parse(request.params)

    const matches = await prisma.match.findMany({
        orderBy: {
            date: 'desc',
        },
        include: {
            bets: {
                where: {
                    player: {
                        userId: request.user.sub,
                        poolId: id
                    }
                }
            }
        }
    })

    return { 
        matches: matches.map(match => {
            return {
                ...match,
                bet: match.bets.length > 0 ? match.bets[0] : null,
                bets: undefined
            }
        })
    }
})
}