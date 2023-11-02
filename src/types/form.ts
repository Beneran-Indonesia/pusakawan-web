import { Control } from "react-hook-form";
import { RegisterUserProps } from "./auth";

type FormInputProps = {
    name: keyof RegisterUserProps & keyof ProfileInput;
    label: string;
    control: Control<ProfileInput> // | Control<ProfileInput>; // | Control<LoginUserProps>;
    required: boolean;
    autoComplete?: string;
    type?: React.HTMLInputTypeAttribute;
}

type ProfileInput = {
    full_name: string;
    username: string;
    phone_no: string;
    email: string;
    gender: 'female' | 'male';
    province: string;
    hometown: string;
    island: string;
    ethnicity: string;
    profession: string;
    major: string;
}

export type {
    FormInputProps,
    ProfileInput
};