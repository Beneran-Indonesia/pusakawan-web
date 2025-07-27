
type LoginUserProps = {
    email: string;
    password: string;
    remember: boolean,
    role: 'Student';
};

type RegisterUserProps = LoginUserProps & {
    full_name: string;
    username: string;
    phone_no: string;
    confirmation: string;
};

export type {
    LoginUserProps,
    RegisterUserProps
};