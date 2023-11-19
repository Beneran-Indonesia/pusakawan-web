import api from '@/lib/api';
import { createBearerHeader } from '@/lib/utils';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TabPanel from '@/components/Tabs/TabPanel';
import TabWrapper from '@/components/Tabs/Wrapper';
import EditProfile from '@/components/ProfileForm';
import { ProfileInput } from '@/types/form';
import { Alert, Snackbar } from '@mui/material';
import Head from 'next/head';
import { mockUserClass } from "@/lib/constants";
import ProfileClassCard from '@/components/Card/Profile';

export default function UserHome({ userData, tabNumber }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const t = useTranslations('account');

    const [currentTabNumber, setCurrentTabNumber] = useState(tabNumber ? tabNumber[0] : 0);
    const [currentClassTabNumber, setCurrentClassTabNumber] = useState(tabNumber ? tabNumber[1] ?? 0 : 0);
    const [snackbarOpen, setSnackbarOpen] = useState({ open: false, success: false, message: "" });

    const error = typeof userData === 'string';

    const handleChangeVerticalTab = (e: React.SyntheticEvent, newValue: number) => {
        setCurrentTabNumber(newValue);
    };

    const handleChangeHorizontalTab = (e: React.SyntheticEvent, newValue: number) => {
        setCurrentClassTabNumber(newValue);
    };

    const handleSnackbar = (open: boolean, success: boolean, message: string) => setSnackbarOpen({ open, success, message });
    const handleSnackbarClose = () => setSnackbarOpen({ ...snackbarOpen, open: false })

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <Container maxWidth="lg" sx={{ mt: 5, overflow: 'hidden' }}>
                <Snackbar open={snackbarOpen.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarOpen.success ? "success" : "error"} sx={{ width: '100%' }}>
                        {snackbarOpen.message}
                    </Alert>
                </Snackbar>
                <Typography component="h4" variant='h4' fontWeight={500} mb={5}>
                    {
                        currentTabNumber === 0
                            ? t('account_information')
                            : t('class_information')
                    }
                </Typography>
                {/* Content */}
                <TabWrapper vertical
                    currentTabNumber={currentTabNumber}
                    handleChange={handleChangeVerticalTab}
                    labels={[t('vertical_tab.profile'), t('vertical_tab.class')]}
                >
                    <Box ml={5} width="100%">
                        {/* Profile panel */}
                        <TabPanel value={currentTabNumber} index={0}>
                            {
                                error
                                    ? null
                                    : <EditProfile userData={userData}
                                        accessToken={userData.accessToken}
                                        setSnackbar={handleSnackbar}
                                    />
                            }
                        </TabPanel>
                        {/* Class panel */}
                        <TabPanel value={currentTabNumber} index={1}>
                            <TabWrapper vertical={false}
                                currentTabNumber={currentClassTabNumber}
                                handleChange={handleChangeHorizontalTab}
                                labels={[t('horizontal_tab.on_going'), t('horizontal_tab.finished')]}
                            >
                                <TabPanel value={currentClassTabNumber} index={0}>
                                    {/* <EmptyTab /> */}
                                    <ProfileClassCard src={mockUserClass[0].img}
                                        status={mockUserClass[0].status}
                                        title={mockUserClass[0].title} />
                                </TabPanel>
                                <TabPanel value={currentClassTabNumber} index={1}>
                                    <EmptyTab />
                                </TabPanel>
                            </TabWrapper>
                        </TabPanel>
                    </Box>
                </TabWrapper>
                <p>{JSON.stringify(userData)}</p>
            </Container>
        </>
    )
}

const EmptyTab = () => {
    const t = useTranslations('account.horizontal_tab');
    return (
        <Box maxHeight={250} p={10} textAlign="center">
            <Typography>{t('empty')}</Typography>
        </Box>
    )
}

type UserDatas = {
    userData: string | ProfileInput;
    tabNumber?: number[];
}

export const getServerSideProps: GetServerSideProps<UserDatas> = async (ctx) => {
    // Basically: 0 index of array in which 0 is 'profile' tab.
    let tabNumber = [0];
    const session = await getSession(ctx);
    const { query } = ctx;
    // Expected data: '/user?class=finished' or '/user?class=on-going' or '/user'.
    const classTab = query?.class;
    // 1 is 'class' tab. In which second index is finished: 1, on-going: 0.
    if (classTab) {
        if (classTab === 'finished') {
            tabNumber = [1, 1];
        } else {
            tabNumber = [1, 0];
        }
    }
    if (!session) return { props: { userData: "Cannot process your request at the moment. Session unavailable." } };
    try {
        const res = await api.get(process.env.API_URL + '/user/my-profile', {
            headers: createBearerHeader(session.accessToken)
        });
        // Only 1 country in database: {id: 1, name: 'Indonesia'}.
        if (res.status === 200) {
            return { props: { userData: { ...res.data, accessToken: session.accessToken }, messages: (await import(`../../locales/${ctx.locale}.json`)).default, tabNumber, } };
        }
    } catch (e) {
        console.error("GET PROFILE ERROR", e)
    }
    return { props: { userData: "Cannot process your request at the moment." } };
}
