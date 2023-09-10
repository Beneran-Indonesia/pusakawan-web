import { Control, Controller, FieldValues } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { RegisterUserProps } from "@/types/auth";

type FormInputProps = {
    name: keyof RegisterUserProps;
    label: string;
    control: Control<RegisterUserProps>;
    required: boolean;
    autoComplete?: string;
    type?: React.HTMLInputTypeAttribute;
}

export const Input = ({ name, control, label, required, autoComplete, type }: FormInputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            // If password, make min length to be 8.
            rules={{
                required: required,
                minLength: name === "password" ? 8 : undefined,
                pattern: name === 'email' ? new RegExp("^[A-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Z0-9.-]+$") : undefined
            }}
            render={({
                field: { onChange, value },
                fieldState: { error },
                formState,
            }) => (
                <TextField
                    id={name}
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    label={label}
                    variant="outlined"
                    required={required}
                    autoComplete={autoComplete}
                    type={type}
                    fullWidth
                />
            )}
        />
    );
};