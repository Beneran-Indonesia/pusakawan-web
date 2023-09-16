import { Control } from "react-hook-form";
import { LoginUserProps, RegisterUserProps } from "./auth";

type FormInputProps = {
    name: keyof RegisterUserProps;
    label: string;
    control: Control<RegisterUserProps>; // | Control<LoginUserProps>;
    required: boolean;
    autoComplete?: string;
    type?: React.HTMLInputTypeAttribute;
}

export type {
    FormInputProps,
};