import { Control, FieldPath, FieldValues } from "react-hook-form";
import type { SxProps, Theme } from "@mui/material";

interface FormProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>; //  Control<ProfileInput> | Control<RegisterUserProps> // | Control<ProfileInput>; // | Control<LoginUserProps>;
}

interface DatepickerProps<T extends FieldValues> extends FormProps<T> {
    label: string;
    required: boolean;
}

interface FormInputProps<T extends FieldValues> extends FormProps<T> {
    autoComplete?: string;
    type?: React.HTMLInputTypeAttribute;
    required: boolean;
    label: string;
    rules?: { [key: string]: { value: string | number; message: string; } }[]
}

interface PasswordInputProps<T extends FieldValues> extends FormProps<T> {
    showPassword: boolean;
    handleClickShowPassword: () => void;
    formSx?: SxProps<Theme>;
}

interface TelInputProps<T extends FieldValues> extends FormProps<T> {
    required: boolean;
}

type DropdownItemsData = {
    id: number | string;
    name: string;
    title?: string;
    state_province?: string;
};

type DropdownItems = {
    ethnicity: DropdownItemsData[];
    island: DropdownItemsData[];
    province: DropdownItemsData[];
    city: DropdownItemsData[];
};

type DropdownProps = {
    name: keyof DropdownProfileInput;
    control: Control<ProfileInput>
    label: string;
    items: DropdownItemsData[];
}

type DropdownProfileInput = {
    [K in keyof DropdownItems]: string;
} & {
    user_category: 'MAHASISWA' | 'SISWA' | 'PROFESSIONAL';
    grade: string | null;
    religion: string;
};

type InputProfileInput = {
    bio: string | null;
    institution: string | null;
    year: number | null;
    major: string | null;
    graduated: string | null;
    work: string | null;
    date_of_birth: string | null;
}

type ProfileInput = InputProfileInput & DropdownProfileInput & {
    id: number;
    full_name: string;
    username: string;
    phone_no: string;
    email: string;
    gender: 'FEMALE' | 'MALE';
    major: string;
    profile_picture: string;
    accessToken: string;
    is_profile_complete: boolean;
    pusaka_points: number;
}

export type {
    FormProps,
    FormInputProps,
    ProfileInput,
    DropdownProps,
    DropdownProfileInput,
    PasswordInputProps,
    TelInputProps,
    DatepickerProps,
    DropdownItems,
    DropdownItemsData
};