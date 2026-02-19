import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event)
    const protectedRoutes = ['/api/seo']
    const path = getRequestURL(event).pathname
    const isProtected = protectedRoutes.some(route => path.startsWith(route))

    if (!isProtected) {
        return
    }

    if (!session || !session.user) {
      throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }
    // @ts-expect-error
    event.context.userId = session.user.id;
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: "Issues with authorization",
    });
  }
})