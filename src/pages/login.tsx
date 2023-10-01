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
import { LoginUserProps, RegisterUserProps } from '@/types/auth';
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

const LoginContainer = styled(Container)({
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: 7.5,
    padding: "5.625rem 6.25rem",
    alignItems: 'center',
    width: '75%',
    height: '730px',
    background: "linear-gradient(111deg, #EFD0D3 1.03%, rgba(239, 208, 211, 0.00) 100%)",
    backdropFilter: "blur(8px)",
    margin: 'auto',
    borderRadius: '1rem'
})

export default function SignIn() {
    return (
        <>
            <Head>
                <title>Login to Pusakawan</title>
            </Head>
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
                <LoginContainer>
                    <LogoWrapper
                        alt="Unsplash image"
                        src={UnsplashLogin}
                        style={{ borderRadius: '1rem' }}
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
    const { control, handleSubmit, setError } = useForm<RegisterUserProps>({ defaultValues: { email: '', password: '', remember: false } });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<APIErrorMessageTypes>({ error: false, type: '', message: '' });
    const t = useTranslations('login');
    const router = useRouter();
    const onSubmit: SubmitHandler<LoginUserProps> = async (data) => {
        setLoading(true);
        const { email, password, remember } = data;
        signIn('email', {
            redirect: false,
            email,
            password,
            remember,
        })
            .then((dt) => {
                setLoading(false);
                if (dt === undefined) {
                    setError("email", { type: "custom", message: "" })
                    setError("password", { type: "custom", message: "" })
                    setErrorMessage({ error: true, type: 'server', message: t('error.server') })
                    return;
                }
                if (dt.error) {
                    console.log(dt.error)
                    setError("email", { type: "custom", message: "" });
                    setError("password", { type: "custom", message: "" });
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
                    setErrorMessage({ error: true, type: 'server', message: t('error.server') })
                    return;
                }
                router.push('/user')
            })
            .catch((e) => console.log(e));
    };
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                maxWidth: '21rem'
            }}
        >
            <div aria-label='title'>
                <Typography component="h1" variant="h4" fontWeight="600" mb={1.5}>
                    {t('title')}
                </Typography>
                <Typography component="h2" variant="h5">
                    {t.rich('description', {
                        strong: (chunks) => <UnderlinedLink href="/register" title={t('to_register')}><strong>{chunks}</strong></UnderlinedLink>
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
                    control={control}
                    handleClickShowPassword={handleClickShowPassword}
                    showPassword={showPassword}
                    formSx={{ mt: 3 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 1 }}>
                    <CheckboxRememberMe control={control} />
                    <Typography variant='caption' sx={{ textDecoration: 'underline' }}>
                        {t('forgot_password')}
                    </Typography>
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
                        sx={{ textTransform: 'none', color: 'black' }}
                        // TODO: GOOGLE LOGIN ERROR
                        onClick={() => signIn('google')}
                        disabled={true}
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
    control: Control<RegisterUserProps>;
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

export function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
        props: {
            messages: require(`../locales/${locale}.json`),
        },
    };
}
