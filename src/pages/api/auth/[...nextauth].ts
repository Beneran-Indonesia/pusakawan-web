import type { NextApiRequest, NextApiResponse } from "next"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/api";
import NextAuth from "next-auth"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app";
import { firebaseAuth, app } from "@/lib/firebase";
// import { } from "firebase/app";
import { signInWithCustomToken, signInWithPopup } from "firebase/auth";


import * as admin from 'firebase-admin'
const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY!);

// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert({
//             projectId: process.env.FIREBASE_PROJECT_ID,
//             clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//             privateKey,
//         }),
//     })
// }

// const config = {
//     apiKey: process.env.FIRESTORE_API_KEY,
//     authDomain: process.env.FIRESTORE_AUTH_DOMAIN,
//     databaseURL: process.env.FIRESTORE_DATABASE_URL,
//     projectId: process.env.FIRESTORE_PROJECT_ID,
//     storageBucket: process.env.FIRESTORE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIRESTORE_MESSAGING_SENDER_ID
// };

// firebaseAdmin.initializeApp(config).auth().id


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
        // adapter: FirestoreAdapter({

        //     name: "firebase",
        //     credential: cert({
        //         projectId: process.env.FIREBASE_PROJECT_ID,
        //         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        //         privateKey,
        //     },)
        // }),
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!
            }),
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
                        if (res.status === 201) {
                            return res.data;
                        }
                    } catch (e) {
                        console.log('err')
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
            async jwt({ user, token, account, profile, session, trigger }) {
                // console.log(user, token, account, profile, session, trigger)
                if (account?.provider === 'email') {
                    const accessToken = user.tokens.access;
                    return { ...token, accessToken };
                } else if (account?.provider === 'google') {
                    try {
                        if (token && token.email) {
                            // Gotta use firebase auth ^w^ to get the token and post request.
                            const uid = (await admin.auth().getUserByEmail(token.email)).uid;
                            const customToken = await admin.auth().createCustomToken(uid);
                            const user = await signInWithCustomToken(firebaseAuth, customToken);
                            console.log('sign in user', user);
                            // const firebaseToken = await admin.auth()
                            // firebaseAuth.
                            const firebaseToken = ''
                            // return null


                            // console.log(firebaseToken);
                            const res = await api.post('/google-auth/', {
                                auth_token: firebaseToken
                            });
                            console.log('GOOGLEAUTH', res);
                            if (res.status === 201) {
                                const { auth_token } = res.data;
                                return { ...token, accessToken: auth_token };
                            }
                            throw Error(res.data);
                        }
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