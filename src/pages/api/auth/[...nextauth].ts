import type { NextApiRequest, NextApiResponse } from "next"
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/api";
import NextAuth from "next-auth";
import { createBearerHeader } from "@/lib/utils";
import { ProfileInput } from "@/types/form";
import { EnrolledProgram } from "@/types/components";
import { isAxiosError } from "axios";

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
                            const accessToken = res.data.tokens.access;
                            const profile = await getProfile(accessToken);
                            const enrolledPrograms = await getEnrolledPrograms(accessToken);
                            return { ...profile, enrolledPrograms, accessToken };
                        }

                    } catch (e) {
                        if (isAxiosError(e)) {
                            console.error("ERROR AXIOS FIREBASE NEXTAUTH", e);
                            throw Error(e?.response?.data.detail);
                        }
                        console.error("ERROR FIREBASE NEXTAUTH", e);
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
                            const accessToken = conn.data.tokens.access;
                            const profile = await getProfile(accessToken);
                            const enrolledPrograms = await getEnrolledPrograms(accessToken);

                            return { ...profile, enrolledPrograms, accessToken };
                        }
                    } catch (e) {
                        if (isAxiosError(e)) {
                            console.error("ERROR AXIOS EMAIL NEXTAUTH", e);
                            throw Error(e?.response?.data.detail);
                        }
                        console.error("ERROR EMAIL NEXTAUTH", e);
                    }
                    // Return null if can't retrieve user or any error.
                    return null;
                }
            })
        ],
        callbacks: {
            async jwt({ trigger, session, user, token }) {
                if (user?.accessToken) {
                    // If user is authenticated
                    return { ...user, ...token };
                }
                if (trigger === "update" && session) {
                    return { ...token, ...session?.user };
                }
                return token;
            },

            async session({ session, token }) {
                // Return a cookie value as part of the session
                // This is read when `req.query.nextauth.includes("session") && req.method === "GET"`
                session = { ...session, user: { ...token } as ProfileInput & EnrolledProgram };
                // expected: { user: email, ...token }, expires: string;
                return session;
            }
        }
    })
}

async function getProfile(accessToken: string) {
    try {
        const res = await api.get(process.env.NEXT_PUBLIC_API_URL + '/user/my-profile', {
            headers: createBearerHeader(accessToken)
        });
        // Only 1 country in database: {id: 1, name: 'Indonesia'}.
        if (res.status === 200) {
            return res.data;
        }
        return false;
    } catch (e) {
        console.error("GET PROFILE ERROR", e);
    }
}

async function getEnrolledPrograms(accessToken: string) {
    try {
        const res = await api.get(process.env.NEXT_PUBLIC_API_URL + '/program/my-programs', {
            headers: createBearerHeader(accessToken),
            params: {
                program_type: "STORYLINE",
                status: "ACTIVE"
            }
        });
        if (res.status === 200) {
            console.log('response get enrollment: ', res.data)

            return res.data;
        }
        return false;
    } catch (e) {
        console.error("GET ENROLLED PROGRAMS ERROR", e);
    }
}