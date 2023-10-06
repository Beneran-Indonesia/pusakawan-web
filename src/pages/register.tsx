import * as React from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
import LogoWrapper from '@/components/ImageWrapper';
import GoogleSVG from '@tplogos/google.svg';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm, SubmitHandler } from "react-hook-form";
import { RegisterUserProps } from '@/types/auth';
import { Input } from '@/components/Form/Input';
import HomeButton from '@/components/HomeButton';
import { useTranslations } from 'next-intl';
import PasswordInput from '@/components/Form/PasswordInput';
import Waves from "@svgs/waves.svg";
import api from '@/lib/api';
import UnderlinedLink from '@/components/UnderlinedLink';

const BoxBackground: React.CSSProperties = {
    background: "linear-gradient(180deg, #EFD0D3 0%, rgba(239, 208, 211, 0.20) 100%)",
    backdropFilter: 'blur(5px)',
};

export default function SignUp() {
    const t = useTranslations('register');
    const [snackbarOpen, setSnackbarOpen] = useState<false | string>(false);
    return (
        <>
            <Head>
                <title>Register to Pusakawan</title>
            </Head>
            <Box
                sx={{
                    backgroundImage: `url(${Waves.src})`,
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'bottom',
                    pb: 5
                }}
            >
                <HomeButton sx={{ position: 'absolute', top: '3%', left: '15%' }} />
                <Container component="main" maxWidth="xs" sx={{ mt: 7 }}>
                    <Typography component="h1" variant="h4" fontWeight={500} textTransform="capitalize">
                        {t('title')}
                    </Typography>
                    <Typography component="h4" variant="h6" mb={2}>
                        {t.rich('description', {
                            strong: (chunks) => <UnderlinedLink href="/login" title={t('to_login')}><strong>{chunks}</strong></UnderlinedLink>
                        })}
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
                        <SignupForm setSnackbarOpen={setSnackbarOpen} />
                    </Box>
                </Container>
            </Box>
            <Snackbar
                open={typeof snackbarOpen === 'string'}
                // autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={t(snackbarOpen)} />
        </>
    );
}

type showDoublePassword = {
    main: boolean;
    confirmation: boolean;
}

type SignupFormProps = {
    setSnackbarOpen: React.Dispatch<React.SetStateAction<string | false>>;
};

function SignupForm({ setSnackbarOpen }: SignupFormProps) {
    const t = useTranslations('register');
    const router = useRouter();
    const { control, handleSubmit, setError } = useForm<RegisterUserProps>({ defaultValues: { email: '', fullName: '', password: '', phoneNumber: '', userName: '', confirmation: '', role: 'Student' } });
    // States
    const [loading, setLoading] = useState(false);
    const [tcChecked, setTcChecked] = useState(false);
    const [showDoublePassword, setShowDoublePassword] = useState<showDoublePassword>({ main: false, confirmation: false });
    // Fns
    const handleshowDoublePasswordMain = () => setShowDoublePassword({ ...showDoublePassword, main: !showDoublePassword.main });
    const handleshowDoublePasswordConfirmation = () => setShowDoublePassword({ ...showDoublePassword, confirmation: !showDoublePassword.confirmation });
    const handleTcChecked = () => setTcChecked(!tcChecked);
    const onSubmit: SubmitHandler<RegisterUserProps> = async (data) => {
        setLoading(true);
        const { email, password, confirmation, fullName, userName, phoneNumber } = data;
        // if password confirmation isn't like password
        if (password !== confirmation) {
            setError("password", { type: "custom", message: t('error.password_not_same_confirmation') })
            setError("confirmation", { type: "custom", message: t('error.password_not_same_confirmation') })
            setLoading(false);
            return;
        }
        try {
            const res = await api.post('/auth/register/', {
                email, password, username: userName, full_name: fullName, phone_no: phoneNumber, role: 'Student',
            })
            if (res.status === 201) {
                setSnackbarOpen('snackbar.succeed');
                router.push('/login');
                return;
            }
        } catch (e) {
            const err = e as AxiosError;
            console.error('REGISTER CLIENT ERROR:', err);
            if (err.response?.data) {
                const message = err.response.data;
                const errorField = Object.keys(message)
                if (errorField.includes('email')) {
                    setError('email', { type: 'custom', message: t('error.email') })
                }
                if (errorField.includes('username')) {
                    setError('userName', { type: 'custom', message: t('error.username') })
                }
            }
            setSnackbarOpen('snackbar.failed');
        }
        setLoading(false);
    };

    const registerWithGoogle = async () => {
        setLoading(true);
        const accessToken = await signUpWithGoogle();
        if (!accessToken) {
            setSnackbarOpen('snackbar.failed');
            return;
        }
        signIn('firebase', { redirect: false, accessToken })
            .then((dt) => {
                setLoading(false);
                if (dt === undefined) {
                    setError("email", { type: "custom", message: "" })
                    setError("password", { type: "custom", message: "" })
                    setSnackbarOpen('snackbar.failed');
                    return;
                }
                if (dt.error) {
                    setError("email", { type: "custom", message: "" });
                    setError("password", { type: "custom", message: "" });
                    const error = dt.error;
                    if (error.charAt(0) === 'P') {
                        setSnackbarOpen('snackbar.credentials_exists');
                        return;
                    }
                    setSnackbarOpen('snackbar.failed');
                    return;
                }
                router.push('/user')
            })
            .catch((e) => console.error("FIREBASE REGISTER CLIENT ERROR:", e));
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}
            display="flex" gap={3} flexDirection="column" width="100%"
        >
            <Input
                name="fullName"
                label={t('form_labels.full_name')}
                autoComplete="name"
                required
                control={control}
            />
            <Input
                label="Username"
                name="userName"
                autoComplete="username"
                required
                control={control}
            />
            <Input
                label="Email"
                name="email"
                autoComplete="email"
                type="email"
                required
                control={control}
            />
            <PasswordInput
                control={control}
                handleClickShowPassword={handleshowDoublePasswordMain}
                showPassword={showDoublePassword.main}
            />
            <PasswordInput
                control={control}
                handleClickShowPassword={handleshowDoublePasswordConfirmation}
                showPassword={showDoublePassword.confirmation}
                confirmation={true}
            />
            <TelInput control={control} />
            <TermsAndCondition checked={tcChecked} handleChecked={handleTcChecked} />
            <LoadingButton
                // size="large"
                loading={loading}
                aria-label={t('google') + ' email and password'}
                type="submit"
                fullWidth
                variant="contained"
                disabled={!tcChecked}
            >
                {t('title')}
            </LoadingButton>
            <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                {t('or')}
            </Typography>
            <LoadingButton
                loading={loading}
                aria-label={t('google') + ' google'}
                type="button"
                fullWidth
                variant="contained"
                color="monochrome"
                sx={{ textTransform: 'none', color: 'black' }}
                onClick={registerWithGoogle}
                disabled={!tcChecked}
            >
                <span style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                    {t('google')}
                    <LogoWrapper src={GoogleSVG} alt="Google Logo" style={loading ? { display: 'none' } : undefined} />
                </span>
            </LoadingButton>
        </Box>
    )
}

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Modal from '@mui/material/Modal';
import TelInput from '@/components/Form/TelInput';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import Head from 'next/head';
import { signUpWithGoogle } from '@/lib/firebase';
import { signIn } from 'next-auth/react';

type TermsAndConditionProps = {
    checked: boolean;
    handleChecked: () => void;
};

function TermsAndCondition({ checked, handleChecked }: TermsAndConditionProps) {
    const t = useTranslations('register');
    const [modalOpen, setModalOpen] = useState(false);
    const handleClose = () => setModalOpen(false);
    const handleOpen = () => setModalOpen(true);
    return (
        <Box>
            <FormGroup title={t('approve')}>
                <FormControlLabel required
                    control={
                        <Checkbox checked={checked}
                            onChange={handleChecked}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    }
                    label={
                        <Typography fontWeight={500}>{t('terms_and_condition')}</Typography>
                    } />
            </FormGroup>
            <Box title={t('see') + t('terms_and_condition_link')} aria-label='terms and conditions modal action' onClick={handleOpen}
                ml="30px" display="flex" flexDirection="row" color="primary.main" alignItems="center" gap={0.5} sx={{ cursor: 'pointer' }}
            >
                <Typography sx={{ textDecoration: 'underline' }}
                    fontWeight={500}
                >
                    {t('terms_and_condition_link')}
                </Typography>
                <OpenInNewIcon fontSize='small' />
            </Box>
            <TermsAndConditionModal open={modalOpen} handleClose={handleClose} />
        </Box>
    )
}

type TermsAndConditionModalProps = {
    open: boolean;
    handleClose: () => void;
};

// Modal to show the T&C
function TermsAndConditionModal({ open, handleClose }: TermsAndConditionModalProps) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="terms and condition modal"
            aria-describedby="read terms and condition"
        >
            <Box >
                <iframe src="./assets/terms-and-condition.html"
                    style={{
                        width: '50%', height: "80vh",
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: 14
                    }}
                />
            </Box>
        </Modal>
    )
}

export function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
        props: {
            messages: require(`../locales/${locale}.json`),
        },
    };
}