import api from '@/lib/api';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { getSession, signOut } from 'next-auth/react';

export default function UserHome({ userData }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <>
            <p>{JSON.stringify(userData)}</p>
            <button onClick={() => signOut()}>Sign out</button>
        </>
    )
}

type UserDatas = {
    userData: string;
}

export const getServerSideProps: GetServerSideProps<UserDatas> = async (ctx) => {
    // TODO: Make this prettier :)
    const session = await getSession(ctx);
    try {
        const res = await api.get(process.env.API_URL + '/user/my-profile', {
            headers: {
                "Authorization": "Bearer " + session.accessToken,
            }
        });
        if (res.status === 200) {
            return { props: { userData: res.data } };
        }
    } catch (e) {
        // console.log(e)
    }
    return { props: { userData: "Cannot process your request at the moment." } };
}
