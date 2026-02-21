import {NuxtAuthHandler} from '#auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import { loginSchema } from '~~/types/seo-prompt';

const config = useRuntimeConfig()

async function getUser(id: string) {
  const user = await prisma.user.findUnique({where: {id}});
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User is not found",
    });
  }

  return user;
}

export default NuxtAuthHandler({
    secret: config.auth.secret,
    providers: [
        // @ts-expect-error
        GithubProvider.default({
            clientId: config.githubClientId,
            clientSecret: config.githubClientSecret,
        }),
        // @ts-expect-error
        CredentialsProvider.default({
            name: "credentials",
            origin: config.auth.origin,
            async authorize (credentials: { email: string; password: string }) {
                try {
                    const validator = loginSchema.safeParse(credentials)
                    if(!validator.success) {
                        throw createError({
                            statusCode: 400,
                            message: 'Validation error'
                        })
                    }
                    return await prisma.$transaction(async (tx) => {
                        const user = await tx.user.findUnique({where: {
                            email: credentials.email
                        }, include: {accounts: {where: {provider: 'credentials'}}}})
                        if (!user) {
                            const hashedPassword = await bcrypt.hash(credentials.password, 10)
                            const user = await tx.user.create({data: {
                                email: credentials.email,
                            }})
                            await tx.account.create({data: {
                                userId: user.id,
                                password: hashedPassword,
                                provider: 'credentials'
                            }})

                            return {
                                id: user.id
                            }
                        }
                        const credentialsAccount = user.accounts[0]
                        if (!credentialsAccount || !credentialsAccount.password) {
                            const hashedPassword = await bcrypt.hash(credentials.password, 10)
        
                            await tx.account.create({data: {
                                userId: user.id,
                                password: hashedPassword,
                                provider: 'credentials'
                            }})

                            return {
                                id: user.id
                            }
                        }
                        const isPasswordMatches = await bcrypt.compare(credentials.password, credentialsAccount.password)

                        if (!isPasswordMatches) {
                            throw createError({
                                statusCode: 400,
                                message: "Incorrect password",
                            });
                        }
                        return {
                            id: user.id
                        }
                    })
                } catch (e) {
                    throw createError({
                        statusCode: 400,
                        message: e || 'Bad request',
                    });
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login'
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            const emailFromGithub = user.email || profile?.email
            if (account?.provider === 'github' && emailFromGithub) {
                return await prisma.$transaction(async (tx) => {
                    const existingUser = await tx.user.findUnique({where: {
                        email: emailFromGithub
                    }, include: {accounts: {where: {provider: 'github', providerAccountId: user.id}}}})

                    if (!existingUser) {
                        const newUser = await tx.user.create({data: {
                            email: emailFromGithub,
                        }})
                        await tx.account.create({data: {
                            userId: newUser.id,
                            provider: 'github',
                            providerAccountId: user.id
                        }})

                        user.id = newUser.id
                        account.userId = newUser.id
                        return true
                    }

                    const githubAccount = existingUser.accounts[0]
                    if (!githubAccount) {
                        await tx.account.create({data: {
                            userId: existingUser.id,
                            provider: 'github',
                            providerAccountId: user.id
                        }})
                    }

                    user.id = existingUser.id
                    account.userId = existingUser.id

                    return true
                })
            }


            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token = {
                ...user,
                ...token,
                };
            }
            return token;
        },
        async session({ session, token }) {
            const refreshedUser = await getUser(String(token.id));

            session.user = {
                ...token,
                ...session.user,
                ...refreshedUser,
            };

            return session;
        }
    }
})