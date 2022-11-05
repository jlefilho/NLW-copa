import { FastifyInstance } from "fastify"
import { machine } from "os"
import { number, z } from "zod"
import { prisma } from "../../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function betRoutes(fastify: FastifyInstance) {
    //BETS COUNT
    fastify.get('/bets/count', async () => {
        const count = await prisma.bet.count()

        return { count }
    })

    //CREATING BET
    fastify.post('/pools/:poolId/matches/:matchId/bets', {
        onRequest: [authenticate]
    }, async (request, reply) => {
        const createBetParams = z.object({
            poolId: z.string(),
            matchId: z.string()
        })

        const createBetBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number(),
        })

        const { poolId, matchId } = createBetParams.parse(request.params)
        const { firstTeamPoints, secondTeamPoints } = createBetBody.parse(request.body)


        //BET VALIDATIONS
        const player = await prisma.player.findUnique({
            where: {
                userId_poolId: {
                    poolId,
                    userId: request.user.sub
                }
            }
        })

        if (!player) {
            return reply.status(400).send({
                message: "You're not allowed to create a bet inside this pool."
            })
        }

        const bet = await prisma.bet.findUnique({
            where: {
                playerId_matchId: {
                    playerId: player.id,
                    matchId
                }
            }
        })

        if (bet) {
            return reply.status(400).send({
                message: "You've already sent a bet to this match on this pool."
            })
        }

        const match = await prisma.match.findUnique({
            where: {
                id: matchId
            }
        })

        if (!match) {
            return reply.status(400).send({
                message: "Game not found."
            })
        }

        if (match.date < new Date()) {
            return reply.status(400).send({
                message: "You cannot send bets after the match started."
            })
        }

        await prisma.bet.create({
            data: {
                matchId,
                playerId: player.id,
                firstTeamPoints,
                secondTeamPoints
            }
        })

        return reply.status(201).send()
    })
}