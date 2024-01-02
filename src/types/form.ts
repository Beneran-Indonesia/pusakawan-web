import { Control, FieldPath, FieldValues } from "react-hook-form";
import { SxProps, Theme } from "@mui/material";

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
    rules?: { [key: string]: { value: string | number; message: string; }}[]
}

interface PasswordInputProps<T extends FieldValues> extends FormProps<T> {
    showPassword: boolean;
    handleClickShowPassword: () => void;
    formSx?: SxProps<Theme>;
}

interface TelInputProps<T extends FieldValues> extends FormProps<T> {
    required: boolean;
}

type DropdownProps = {
    name: keyof DropdownProfileInput;
    control: Control<ProfileInput>
    label: string;
    pickedItem: string;
    // Dude. I fucking give up.
    onOpen?: () => Promise<{ status: number, message: ExpectedJSON[] }> | { status: number, message: { id: string, name: string; title: string; }[] };
}


enum UserCategory {
    MAHASISWA = 'MAHASISWA',
    SISWA = 'SISWA',
    PROFESSIONAL = 'PROFESSIONAL'
}

type DropdownProfileInput = {
    religion: string;
    province: string;
    city: string;
    island: string;
    ethnicity: string;
    user_category: 'MAHASISWA' | 'SISWA' | 'PROFESSIONAL';
    // 
    grade: string | null;

}

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
    full_name: string;
    username: string;
    phone_no: string;
    email: string;
    gender: 'FEMALE' | 'MALE';
    major: string;
    profile_picture: string;
    accessToken: string;
    is_profile_complete: boolean;
}

type ExpectedJSON = {
    id: string;
    name: string;
    country?: string;
    title?: string;
    province?: string;
}

export type {
    FormInputProps,
    ProfileInput,
    DropdownProps,
    DropdownProfileInput,
    PasswordInputProps,
    TelInputProps,
    DatepickerProps
};