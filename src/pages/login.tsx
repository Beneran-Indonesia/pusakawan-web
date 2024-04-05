import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { signIn } from 'next-auth/react';
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/Form/Input';
import { LoginUserProps } from '@/types/auth';
import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form';
import PasswordInput from '@/components/Form/PasswordInput';
import { useState } from 'react';
import LogoWrapper from '@/components/ImageWrapper';
import GoogleSVG from '@tplogos/google.svg';
import UnsplashLogin from '@images/unsplash_login.png';
import Waves from "@svgs/waves.svg";
import Head from 'next/head';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import UnderlinedLink from '@/components/UnderlinedLink';
import { signUpWithGoogle } from '@/lib/firebase';
import Link from 'next/link';
import HomeButton from '@/components/HomeButton';
import { useDesktopRatio } from '@/lib/hooks';
// import { getCookies } from "cookies-next";

const LoginContainer = styled(Container)(
    ({ theme }) => ({
        display: 'flex',
        justifyContent: 'space-evenly',
        gap: 7.5,
        padding: theme.breakpoints.up("md") ? "2rem" : "5.625rem 6.25rem",
        alignItems: 'center',
        width: theme.breakpoints.up("md") ? '100%' : "75%",
        height: '730px',
        background: theme.breakpoints.up("md") ? "linear-gradient(111deg, #EFD0D3 1.03%, rgba(239, 208, 211, 0.00) 100%)" : "transparent",
        backdropFilter: theme.breakpoints.up("md") ? "none" : "blur(8px)",
        margin: 'auto',
        borderRadius: '1rem'
    }))

export default function SignIn() {
    const isDesktopRatio = useDesktopRatio();
    return (
        <>
            <Head>
                <title>Login to Pusakawan</title>
            </Head>
            {/* Background div with waves and such */}
            <Grid
                container
                component="main"
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    minHeight: '100vh',
                    backgroundImage: `url(${Waves.src})`,
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'bottom'
                }}
            >
                <HomeButton sx={{ position: 'absolute', left: '15%', top: '8%', zIndex: 1 }} />
                {/* Flex: Unsplash image & LoginForm */}
                <LoginContainer>
                    <LogoWrapper
                        alt="Unsplash image"
                        src={UnsplashLogin}
                        style={{ borderRadius: '1rem', display: isDesktopRatio ? "block" : "none" }}
                        priority={true}
                    />
                    <LoginBox />
                </LoginContainer>
            </Grid>
        </>
    );
}

type APIErrorMessageTypes = {
    error: boolean;
    type: string;
    message: string;
}

function LoginBox() {
    // This is supposed to be login but i am not good in typescript yet to know how to change this.
    const { control, handleSubmit, setError } = useForm<LoginUserProps>({ defaultValues: { email: '', password: '', remember: false } });
    // States
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<APIErrorMessageTypes>({ error: false, type: '', message: '' });
    // Others
    const t = useTranslations('login');
    const router = useRouter();
    // Submit
    const onSubmit: SubmitHandler<LoginUserProps> = async (data) => {
        setLoading(true);
        const { email, password, remember } = data;
        signIn('email', {
            redirect: true,
            callbackUrl: "/",
            email,
            password,
            remember,
        })
            .then((dt) => {
                setLoading(false);
                // If for some reason it fails send server error
                if (dt === undefined) {
                    setError("email", { type: "custom", message: "" })
                    setError("password", { type: "custom", message: "" })
                    setErrorMessage({ error: true, type: 'server', message: t('error.server') })
                    return;
                }
                if (dt.error) {
                    setError("email", { type: "custom", message: "" });
                    setError("password", { type: "custom", message: "" });
                    // Create custom messages according to return error message
                    const error = dt.error;
                    if (error.charAt(0) === 'I') {
                        setErrorMessage({ error: true, type: "invalid_credentials", message: t('error.invalid_credentials') })
                        return;
                    } else if (error.charAt(0) === 'A') {
                        setErrorMessage({ error: true, type: "account_disabled", message: t('error.account_disabled') })
                        return;
                    } else if (error.charAt(0) === 'E') {
                        setErrorMessage({ error: true, type: "email_not_verified", message: t('error.email_not_verified') })
                        return;
                    }
                    // Else it's server error
                    setErrorMessage({ error: true, type: 'server', message: t('error.server') })
                    return;
                }
                // If no error then go to main page
                router.push('/')
            })
            .catch((e) => {
                setLoading(false);
                console.error("EMAIL CREDENTIAL CLIENT ERROR:", e)
            });
    };

    const firebaseAuth = async () => {
        setLoading(true);
        // Get accessToken
        const accessToken = await signUpWithGoogle();
        // If no accessToken return error
        if (!accessToken) {
            setLoading(false);
            setErrorMessage({ error: true, type: 'server', message: t('error.server') });
            return;
        }
        signIn('firebase', { redirect: false, accessToken })
            .then((dt) => {
                setLoading(false);
                if (dt === undefined) {
                    setError("email", { type: "custom", message: "" })
                    setError("password", { type: "custom", message: "" })
                    setErrorMessage({ error: true, type: 'server', message: t('error.server') })
                    return;
                }
                if (dt.error) {
                    setError("email", { type: "custom", message: "" });
                    setError("password", { type: "custom", message: "" });
                    // Should only have 1 result: Credentials exist with email so i have to login using email
                    const error = dt.error;
                    if (error.charAt(0) === 'P') {
                        setErrorMessage({ error: true, type: "credentials_exists", message: t('error.credentials_exists') })
                        return;
                    }
                    setErrorMessage({ error: true, type: 'server', message: t('error.server') })
                    return;
                }
                // If succeeds go to /user
                router.
                    push('/user')
            })
            .catch((e) => {
                setLoading(false);
                console.error("FIREBASE AUTH CREDENTIAL CLIENT ERROR:", e)
            });
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                maxWidth: '21rem',
            }}
        >
            <div aria-label='title'>
                <Typography component="h1" variant="h4" fontWeight="600" mb={1.5}>
                    {t('title')}
                </Typography>
                <Typography component="h2" variant="h5">
                    {t.rich('description', {
                        strong: (chunks) => <UnderlinedLink href="/register" sx={{ color: "primary.main", fontWeight: 600 }} title={t('to_register')}>{chunks}</UnderlinedLink>
                    })}
                </Typography>
            </div>
            <Box component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column' }}>
                <Input
                    control={control}
                    required
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                />
                <PasswordInput
                    name="password"
                    control={control}
                    handleClickShowPassword={handleClickShowPassword}
                    showPassword={showPassword}
                    formSx={{ mt: 3 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 1 }}>
                    <CheckboxRememberMe control={control} />
                    <Link href="/reset-password" title={t('change_password')}>
                        <Typography variant='caption' sx={{ textDecoration: 'underline', color: "primary.main" }}>
                            {t('forgot_password')}
                        </Typography>
                    </Link>
                </Box>
                {/* The buttons have 1rem gap in each */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} aria-label='action buttons'>
                    {errorMessage.error && (<Typography variant="caption" color="error">
                        {errorMessage.message}
                    </Typography>)}
                    <LoadingButton
                        // size="large"
                        loading={loading}
                        aria-label={t('google') + ' email and password'}
                        type="submit"
                        fullWidth
                        variant="contained"
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
                        sx={{ textTransform: 'none', color: 'black', boxShadow: 1 }}
                        onClick={firebaseAuth}
                    // disabled={true}
                    >
                        <span style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                            {t('google')}
                            <LogoWrapper src={GoogleSVG} alt="Google Logo" style={loading ? { display: 'none' } : undefined} />
                        </span>
                    </LoadingButton>
                </Box>
            </Box>
        </Box>
    )
}

type CheckboxRememberMeProps = {
    control: Control<LoginUserProps>;
}

function CheckboxRememberMe({ control }: CheckboxRememberMeProps) {
    const t = useTranslations('login');
    return (
        <Controller
            name="remember"
            control={control}
            render={({
                field: { onChange, value },
            }) => (
                <FormControlLabel
                    control={<Checkbox value={value} onChange={(e) => onChange(e.target.checked)} color="primary" />}
                    label={<Typography variant='caption'>{t('remember_me')}</Typography>}
                />
            )}
        />
    )
}


export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
        props: {
            messages: (await import(`../locales/${locale}.json`)).default,
        },
    };
}