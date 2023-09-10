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
                name: 'email',
                credentials: {
                    email: { label: "Email", placeholder: "doe@example.com", type: "email" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials) {
                    const { email, password } = credentials!;
                    const conn = await api.post( "/auth/login/", {
                        email, password
                    })
                    if (conn.status === 200) {
                        api.defaults.headers.common['Authorization'] = 'Bearer ' + conn.data.tokens.access;
                        return conn.data;
                    }
                    // Return null if can't retrieve user or any error.
                    return null;
                }
            })
        ],
        callbacks: {
            async jwt({ user, token, account }) {
                if (account?.provider === 'credentials') {
                    const accessToken = user.tokens.access;
                    return { ...token, email: user.email, accessToken };
                }
                return { ...token, email: user.email }
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