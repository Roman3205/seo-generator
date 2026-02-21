export default defineEventHandler(async (event) => {
    try {
        const seoResult = await prisma.seoResult.findMany({where: {
            userId: event.context.userId
        }, select: {title: true, createdAt: true, id: true}, orderBy: {
            createdAt: 'desc'
        }})

        return seoResult || []
    } catch (e) {
        throw createError({
            statusCode: 400,
            message: e || 'Bad request'
        })
    }
})