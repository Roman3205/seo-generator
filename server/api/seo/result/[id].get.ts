export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const seoResult = await prisma.seoResult.findUnique({where: {
            id,
            userId: event.context.userId
        }})

        if (!seoResult) {
            throw createError({
                statusCode: 404,
                message: 'Result not found'
            })
        }

        return seoResult
    } catch (e) {
        throw createError({
            statusCode: 400,
            message: e || 'Bad request'
        })
    }
})