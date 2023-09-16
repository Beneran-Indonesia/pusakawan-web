import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/api";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Max age is 2 weeks
    const maxAge = 14 * 24 * 60 * 60;
    return await NextAuth(req, res, {
        session: {
            strategy: 'jwt',
            maxAge
        },
        secret: process.env.NEXTAUTH_SECRET,
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!
            }),
            CredentialsProvider({
                id: "email",
                name: 'email',
                credentials: {
                    email: { label: "Email", placeholder: "doe@example.com", type: "email" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials) {
                    const { email, password } = credentials!;
                    try {
                        const conn = await api.post("/auth/login/", {
                            email, password
                        })
                        if (conn.status === 200) {
                            api.defaults.headers.common['Authorization'] = 'Bearer ' + conn.data.tokens.access;
                            return conn.data;
                        }
                    } catch (e) {
                        throw Error(e.response.data.detail);
                        console.log("ERROR AUTH", e);
                    }
                    // Return null if can't retrieve user or any error.
                    return null;
                }
            })
        ],
        callbacks: {
            async jwt({ user, token, account }) {
                if (account?.provider === 'email') {
                    const accessToken = user.tokens.access;
                    api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                    console.log(accessToken)
                    return { ...token, accessToken };
                } else if (account?.provider === 'google') {
                    // Gotta use firebase auth ^w^ to get the token and post request.
                    const { id_token } = account;
                    try {
                        const res = await api.post('/google-auth/', {
                            auth_token: id_token
                        });
                        console.log('GOOGLEAUTH', res);
                        if (res.status === 201) {
                            const { auth_token } = res.data;
                            api.defaults.headers.common['Authorization'] = 'Bearer ' + auth_token;
                            return { ...token, accessToken: auth_token };
                        }
                        throw Error(res.data);
                    } catch (e) {
                        console.log("ERROR: GOOGLE AUTH.\n", e);
                    }
                }
                return { ...token }
            },
            async session({ session, token }) {
                // Return a cookie value as part of the session
                // This is read when `req.query.nextauth.includes("session") && req.method === "GET"`
                session = { ...session, ...token };
                return session;
            }
        }
    })
}