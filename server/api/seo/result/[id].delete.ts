export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const seoResult = await prisma.seoResult.findUnique({where: {
            id,
            userId: event.context.userId
        }, select: {id: true}})

        if (!seoResult) {
            throw createError({
                statusCode: 404,
                message: 'Result not found'
            })
        }

        await prisma.seoResult.delete({where: {id: seoResult.id}})

        return 200
    } catch (e) {
        throw createError({
            statusCode: 400,
            message: e || 'Bad request'
        })
    }
})