import {
    type DefaultSession,
    type DefaultUser,
} from "next-auth";

type APISuccessReturn = {
    email: string;
    tokens: {
        access: string;
        refresh: string;
    }
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & APISuccessReturn;
    }
    // TODO: Search how to integrate APISuccessReturn to here.
    interface User extends DefaultUser {
        email: string;
        tokens: {
            access: string;
            refresh: string;
        }
    }
}