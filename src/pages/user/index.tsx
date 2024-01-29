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
import { DropdownItems, ProfileInput } from '@/types/form';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Head from 'next/head';
import { getRandomCoursePicture } from "@/lib/constants";
import ProfileClassCard from '@/components/Card/Profile';
import { getEditProfileFields } from '@/lib/api';
import { ProgramData } from '@/types/components';
import ProfileNotCompleteNotice from '@/components/ProfileNotCompleteNotice';

export default function UserHome({ enrolledPrograms, dropdownItems, userData, tabNumber }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
            <ProfileNotCompleteNotice type="profile" />
            <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
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
                                        dropdownItems={dropdownItems!}
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
                                    {
                                        enrolledPrograms
                                            ? enrolledPrograms.map((dt) =>
                                                <ProfileClassCard key={dt.title + dt.id}
                                                    src={dt?.banners ? dt.banners[0].image : getRandomCoursePicture()}
                                                    status="ONGOING"
                                                    title={dt.title} />
                                            ) : <EmptyTab />
                                    }
                                </TabPanel>
                                <TabPanel value={currentClassTabNumber} index={1}>
                                    <EmptyTab />
                                </TabPanel>
                            </TabWrapper>
                        </TabPanel>
                    </Box>
                </TabWrapper>
            </Container>
            {/* <p>{JSON.stringify(userData)}</p> */}
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
    enrolledPrograms?: ProgramData[];
    dropdownItems?: DropdownItems;
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

    const defaultReturn = { messages: (await import(`../../locales/${ctx.locale}.json`)).default, tabNumber, dropdownItems: undefined };

    if (!session) return { props: { userData: "Cannot process your request at the moment. Session unavailable.", ...defaultReturn } };
    const accessToken = session.user.accessToken;
    const [ethnicity, island, stateProvince, cityDistrict] = await Promise.all([
        getEditProfileFields(`/user/ethnicity/`, accessToken),
        getEditProfileFields(`/address/island/`, accessToken),
        getEditProfileFields(`/address/state-province/`, accessToken),
        getEditProfileFields(`/address/city-district/`, accessToken)
    ]);
    const enrolledPrograms = session.user.enrolledPrograms;
    const dropdownItems = {
        ethnicity: ethnicity.message,
        island: island.message,
        province: stateProvince.message,
        city: cityDistrict.message,
    }
    return { props: { userData: { ...session.user }, ...defaultReturn, enrolledPrograms, dropdownItems } };
}
