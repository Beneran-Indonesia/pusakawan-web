import * as React from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm, SubmitHandler } from "react-hook-form";
import { RegisterUserProps } from '@/types/auth';
import { Input } from '@/components/Form/Input';
import HomeButton from '@/components/HomeButton';
import { useTranslations } from 'next-intl';
import Waves from "@svgs/waves.svg";
import api from '@/lib/api';
import Head from 'next/head';

const BoxBackground: React.CSSProperties = {
    background: "linear-gradient(180deg, #EFD0D3 0%, rgba(239, 208, 211, 0.20) 100%)",
    backdropFilter: 'blur(5px)',
};

export default function ForgotPassword() {
    const t = useTranslations('reset-password');
    const [snackbarOpen, setSnackbarOpen] = useState<false | string>(false);
    return (
        <>
            <Head>
                <title>Reset Password</title>
            </Head>
            <Box
                sx={{
                    backgroundImage: `url(${Waves.src})`,
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'bottom',
                    pb: 5,
                    // MT is 7. 7 * 8 = 56
                    height: 'calc(100vh - 56px)'
                }}
            >
                <HomeButton sx={{ position: 'absolute', top: '3%', left: '15%' }} />
                <Container component="main" maxWidth="xs" sx={{ mt: 7 }}>
                    <Typography component="h1" variant="h4" fontWeight={500} textTransform="capitalize" mb={3}>
                        {t('title')}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            py: '40px',
                            px: '20px',
                            borderRadius: 2,
                            ...BoxBackground
                        }}
                    >
                        <ForgotPasswordForm setSnackbarOpen={setSnackbarOpen} />
                    </Box>
                </Container>
            </Box>
            <Snackbar
                open={typeof snackbarOpen === 'string'}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
                message={t(snackbarOpen)} />
        </>
    );
}

type ForgotPasswordFormProps = {
    setSnackbarOpen: React.Dispatch<React.SetStateAction<string | false>>;
};

function ForgotPasswordForm({ setSnackbarOpen }: ForgotPasswordFormProps) {
    const t = useTranslations('reset-password');
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit } = useForm<RegisterUserProps>({ defaultValues: { email: '', full_name: '', password: '', phone_no: '', username: '', confirmation: '', role: 'Student' } });
    const onSubmit: SubmitHandler<RegisterUserProps> = async (data) => {
        setLoading(true);
        const { email } = data;
        try {
            // Just realised that if the email doesn't exist, it wont trigger the SMPT...
            // but the data says 'email sent' even if email is not a registered user...
            const res = await api.post('/auth/forget-password', { email })
            if (res.status === 200) {
                setSnackbarOpen('snackbar.succeed');
            }
        } catch (e) {
            console.error("FORGOT PASSWORD CLIENT ERROR:", e)
            setSnackbarOpen('snackbar.failed');
        }
        setLoading(false);
    }
    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}
            width="100%" display="flex" gap={3} flexDirection="column"
        >
            <Input
                name="email"
                label="Email"
                autoComplete="email"
                required
                control={control}
            />
            <LoadingButton
                // size="large"
                loading={loading}
                aria-label="forgot password button"
                type="submit"
                fullWidth
                variant="contained"
            >
                {t('button')}
            </LoadingButton>
        </Box>
    )
}

export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
      props: {
        messages: (await import(`../locales/${locale}.json`)).default,
      },
    };
  }