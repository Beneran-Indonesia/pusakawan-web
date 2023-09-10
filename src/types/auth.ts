
type LoginUserProps = {
    email: string;
    password: string;
};

type RegisterUserProps = LoginUserProps & {
    fullName: string;
    userName: string;
    phoneNumber: string;
    role: 'Student';
};

export type {
    LoginUserProps,
    RegisterUserProps
};