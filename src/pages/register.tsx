import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { RegisterUserProps } from '@/types/auth';
import { Input } from '@/components/Form/Input';

export default function SignUp() {
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterUserProps>({ defaultValues: { email: '', fullName: '', password: '', phoneNumber: '', role: 'Student' } });
    // TODO: Create error handler
    // console.log(errors);
    const onSubmit: SubmitHandler<RegisterUserProps> = data => console.log(data);

    // const onSubmit: SubmitHandler<RegisterUserProps> = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     const data = new FormData(event.currentTarget);
    //     console.log({
    //         email: data.get('email'),
    //         password: data.get('password'),
    //     });
    // };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
                    {/* noValidate onSubmit={handleSubmit} */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Input
                                label="Username"
                                name="userName"
                                autoComplete="username"
                                required
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                name="fullName"
                                label="Full Name"
                                autoComplete="name"
                                required
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                type="email"
                                required
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                name="password"
                                label="Password"
                                autoComplete="new-password"
                                type="password"
                                required
                                control={control}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}