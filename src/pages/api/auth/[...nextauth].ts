import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // const { fullName, userName, email, password, passwordConfirmation, mobile } = req.body;
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
                async authorize(credentials, req) {
                    const { email, password } = credentials!;
                    const conn = await axios.post(process.env.API_URL! + "/auth/login/", {
                        email, password
                    })
                    if (conn.status === 200) {
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + conn.data.tokens.access;
                        return conn.data;
                    }
                    // Return null if can't retrieve user or any error.
                    return null;
                }
            })
        ],
        // TODO, make sure to put the access token here.
        // https://stackoverflow.com/questions/70117661/how-do-i-add-data-to-the-client-api-in-next-auth
        callbacks: {
            session({ session, token }) {
                // Return a cookie value as part of the session
                // This is read when `req.query.nextauth.includes("session") && req.method === "GET"`

                return session
            }
        }
    })
}