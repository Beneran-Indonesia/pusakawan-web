import api from '@/lib/api';
import { createBearerHeader } from '@/lib/utils';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { getSession, signOut } from 'next-auth/react';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import VerticalTabs from '@/components/ProfileVerticalTab';

export default function UserHome({ userData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const t = useTranslations('account');
    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography component="h4" variant='h4' fontWeight={500}>{t('account_information')}</Typography>
            <VerticalTabs />
            <p>{JSON.stringify(userData)}</p>
            <button onClick={() => signOut()}>Sign out</button>
        </Container>
    )
}

type UserDatas = {
    userData: string;
}

export const getServerSideProps: GetServerSideProps<UserDatas> = async (ctx) => {
    const session = await getSession(ctx);
    if (!session) return { props: { userData: "Cannot process your request at the moment. Session unavailable." } };
    try {
        const res = await api.get(process.env.API_URL + '/user/my-profile', {
            headers: createBearerHeader(session.accessToken)
        });
        if (res.status === 200) {
            return { props: { userData: res.data, messages: require(`../../locales/${ctx.locale}.json`), } };
        }
    } catch (e) {
        console.error("GET PROFILE ERROR", e)
    }
    return { props: { userData: "Cannot process your request at the moment." } };
}
