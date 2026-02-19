import {NuxtAuthHandler} from '#auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from "next-auth/providers/credentials";

const config = useRuntimeConfig()

// async function getUser(id: string) {
//   const user = await userModel.findOne({ _id: id });
//   if (!user) {
//     throw createError({
//       statusCode: 404,
//       statusMessage: "User is not found",
//     });
//   }

//   return user.toJSON();
// }

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
                    // return {
                    //     _id: user._id,
                    // };
                } catch (e) {
                    throw createError({
                        statusCode: 400,
                        statusMessage: "Bad request",
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
        // async jwt({ token, user }) {
        //     if (user) {
        //         token = {
        //         ...user,
        //         ...token,
        //         };
        //     }
        //     return token;
        // },
        // async session({ session, token }) {
        //     const refreshedUser = await getUser(String(token._id));

        //     session.user = {
        //         ...token,
        //         ...session.user,
        //         ...refreshedUser,
        //     };

        //     return session;
        // }
    }
})