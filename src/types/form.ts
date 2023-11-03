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

type DropdownProfileInput = {
    religion: string;
    province: string;
    city: string;
    island: string;
    ethnicity: string;
    profession: string;
}

type ProfileInput = DropdownProfileInput & {
    full_name: string;
    username: string;
    phone_no: string;
    email: string;
    gender: 'FEMALE' | 'MALE';
    major: string;
}

type ExpectedJSON = {
    id: number;
    name: string;
    country: string;
    province?: string;
}

type DropdownProps = {
    name: keyof DropdownProfileInput;
    control: Control<ProfileInput>
    label: string;
    pickedItem: string;
    onOpen?: () => Promise<{ status: number, message: ExpectedJSON[] }>;
}

export type {
    FormInputProps,
    ProfileInput,
    DropdownProps,
    DropdownProfileInput
};