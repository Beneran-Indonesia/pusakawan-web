
type LoginUserProps = {
email: string;
    password: string;
    remember: boolean,
    role: 'Student';
};

type RegisterUserProps = LoginUserProps & {
    fullName: string;
    userName: string;
    phoneNumber: string;
    confirmation: string;
};

export type {
    LoginUserProps,
    RegisterUserProps
};