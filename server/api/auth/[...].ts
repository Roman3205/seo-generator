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
            async authorize(credentials: { email?: string; password?: string }) {
                const validator = loginSchema.safeParse(credentials)
                if(!validator.success) {
                    throw createError({
                        statusCode: 400,
                        message: 'Validation error'
                    })
                }
                    
                const { email, password } = validator.data
                    
                const user = await prisma.user.findUnique({
                    where: {email}, 
                    include: {accounts: true}
                })

                if (!user) {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    const newUser = await prisma.user.create({
                        data: {
                            email,
                            accounts: {
                                create: {
                                    provider: 'credentials',
                                    providerAccountId: email,
                                    password: hashedPassword
                                }
                            }
                        }
                    });

                    return {
                        id: newUser.id,
                        email: newUser.email,
                    };
                }

                const hasGithubAccount = user?.accounts.some(account => account.provider === 'github')
                const credentialsAccount = user?.accounts.find(acc => acc.provider === 'credentials');

                if (hasGithubAccount && !credentialsAccount) {
                    throw createError({
                        statusCode: 403,
                        message: "User registered with GitHub. Please use GitHub login.",
                    });
                }

                if (!credentialsAccount || !credentialsAccount.password) {
                    console.warn(`User with email ${email} exists but does not have credentials account.`);
                    throw createError({ statusCode: 401, message: "Invalid credentials configuration" });
                }
                    
                const isPasswordMatches = await bcrypt.compare(password, credentialsAccount.password)
                if (!isPasswordMatches) {
                    throw createError({
                        statusCode: 400,
                        message: "Invalid email or password",
                    });
                }
                
                return {
                    id: user.id,
                    email: user.email,
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
        error: '/auth/login'
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            if (account?.provider === 'github') {
                const email = user.email || profile?.email
                if (!email) return false

                const existingUser = await prisma.user.findUnique({
                    where: { email },
                    include: { accounts: true }
                });

                if (existingUser) {
                    const hasCredentialsAccount = existingUser.accounts.some(acc => acc.provider === 'credentials');
                    const hasGithubAccount = existingUser.accounts.some(acc => acc.provider === 'github');

                    if (hasCredentialsAccount && !hasGithubAccount) {
                        throw createError({
                            statusCode: 403,
                            message: "OAuthAccountNotLinked",
                        });
                    }

                    if (!hasGithubAccount) {
                        console.warn(`User with email ${email} exists but does not have a GitHub account linked.`);
                        throw createError({ statusCode: 401, message: "Configuration" });
                    }

                    user.id = existingUser.id
                    account.userId = existingUser.id

                } else {
                    const newUser = await prisma.user.create({
                        data: { 
                            email,
                            accounts: {
                                create: {
                                    provider: 'github',
                                    providerAccountId: account.providerAccountId
                                }
                            }
                        },
                    });

                    user.id = newUser.id;
                    account.userId = newUser.id;
                }
            }

            return true
        },
        
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            const refreshedUser = await getUser(String(token.id));

            session.user = {
                ...session.user,
                ...refreshedUser,
            };

            return session;
        }
    }
})