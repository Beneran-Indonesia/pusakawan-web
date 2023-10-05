import type { NextApiRequest, NextApiResponse } from "next"
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/api";
import NextAuth from "next-auth";

const getMaxAgeDay = (days: number) => days * 24 * 3600;

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Max age is 2 weeks
    let maxAge = getMaxAgeDay(1);
    if (req.body.remember) {
        maxAge = getMaxAgeDay(14);
    }
    return await NextAuth(req, res, {
        session: {
            strategy: 'jwt',
            maxAge
        },
        secret: process.env.NEXTAUTH_SECRET,
        providers: [
            CredentialsProvider({
                id: "firebase",
                name: "firebase",
                credentials: {
                    accessToken: { label: 'Access token', placeholder: 'e72id..', type: "text" },
                },
                async authorize(credentials) {
                    const { accessToken } = credentials!;
                    try {
                        const res = await api.post('/google-auth/', {
                            auth_token: accessToken
                        });
                        if (res.status === 200) {
                            return res.data.data;
                        }
                    } catch (e) {
                        console.log('firebase err', e)
                    }
                    return null;
                }
            }),
            CredentialsProvider({
                id: "email",
                name: 'email',
                credentials: {
                    email: { label: "Email", placeholder: "doe@example.com", type: "email" },
                    password: { label: "Password", type: "password" },
                },
                async authorize(credentials) {
                    const { email, password } = credentials!;
                    try {
                        const conn = await api.post("/auth/login/", {
                            email, password
                        })
                        if (conn.status === 200) {
                            return conn.data;
                        }
                    } catch (e: any) {
                        console.log("ERROR AUTH", e);
                        throw Error(e.response.data.detail);
                    }
                    // Return null if can't retrieve user or any error.
                    return null;
                }
            })
        ],
        callbacks: {
            async jwt({ user, token }) {
                // console.log(user, token, account, profile, session, trigger)
                const accessToken = user.tokens.access;
                return { ...token, accessToken };
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