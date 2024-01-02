import TextField from "@mui/material/TextField";
import { Controller, FieldValues } from "react-hook-form";
import { useTranslations } from 'next-intl';
import { FormInputProps } from "@/types/form";
import { formControlRoot } from "@/lib/constants";

function Input<T extends FieldValues>({ name, control, label, required = true, autoComplete, type, rules }: FormInputProps<T>) {
    const t = useTranslations('form.text_field.error');
    return (
        <Controller
            name={name}
            // Fucking work around
            control={control}
            rules={{
                ...rules,
                required: { value: required, message: t('required') },
                // Enforce this pattern if type is email.
                pattern: type === 'email' ? { value: /^\S+@\S+\.\S+$/, message: t('email') } : undefined,
                // min: type === 'number' ? { value: 1900, message: t('number.min')} : undefined  
            }}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <TextField
                    multiline={name === 'bio' ? true : false}
                    rows={name === 'bio' ? 4 : undefined}
                    id={name}
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    label={label}
                    variant="outlined"
                    autoComplete={autoComplete}
                    type={type}
                    fullWidth
                    InputProps={{ sx: formControlRoot }}
                />
            )}
        />
    );
};

export { Input };