import TextField from "@mui/material/TextField";
import { Controller, FieldValues } from "react-hook-form";
import { useTranslations } from 'next-intl';
import { FormInputProps } from "@/types/form";
import { formControlRoot } from "@/lib/constants";

type Pattern = {
    value: RegExp;
    message: string;
};

function Input<T extends FieldValues>({ name, control, label, required = true, autoComplete, type, rules }: FormInputProps<T>) {
    const t = useTranslations('form.text_field.error');

    let pattern: Pattern | undefined;

    if (type === "email") {
        // Enforce pattern to be a@b.c if type is email.
        pattern = { value: /^\S+@\S+\.\S+$/, message: t('email') };
    } else if (name === "full_name") {
        // enforce full name to only have alphabets + spaces
        pattern = { value: /^[a-zA-Z]+([\s][a-zA-Z]+)*$/, message: t("fullname") };
    } else if (name === "username") {
        // enforce username to start with an alphanumeric character. Special characters (_, , -) have to be followed by an alphanumeric character. The last character has to be an alphanumeric character.
        pattern = { value: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/, message: t("username") };
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                pattern,
                required: { value: required, message: t('required') },
                maxLength: name === "username" || name === "full_name" ? { value: 50, message: t("max") } : undefined,
                minLength: name === "username" || name === "full_name" ? { value: 3, message: t("min") } : undefined,
                ...rules,
            }}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <TextField
                required={required}
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
}

export { Input };