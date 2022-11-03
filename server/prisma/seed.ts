import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Fulano de Tal',
            email: 'fulanodetal@gmail.com',
            avatarUrl: 'http://github.com/jlefilho.png',
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Exemplo de Bolão',
            code: 'BOL123',
            ownerId: user.id,

            players: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.match.create({
        data: {
            date: '2022-11-03T12:32:15.709Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'DE'
        }
    })

    await prisma.match.create({
        data: {
            date: '2022-11-04T12:32:15.709Z',
            firstTeamCountryCode: 'AR',
            secondTeamCountryCode: 'BR',

            bets: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    player: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })
}

main()