import { Controller, FieldValues } from "react-hook-form";
import { MuiTelInput } from 'mui-tel-input'
import { formControlRoot } from "@/lib/constants";
import { useTranslations } from 'next-intl';
import { TelInputProps } from "@/types/form";

export default function TelInput<T extends FieldValues>({ name, control, required }: TelInputProps<T>) {
    const t = useTranslations('form');
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: { value: required, message: t('text_field.error.required') },
                minLength: { value: 6, message: t('text_field.error.min_length_phone') },
                maxLength: { value: 19, message: t('text_field.error.max_length_phone')}
            }}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <MuiTelInput
                required={required}
                    helperText={error ? error.message : null}
                    error={!!error}
                    value={value}
                    onChange={onChange}
                    InputProps={{ sx: formControlRoot }}
                    defaultCountry="ID"
                    forceCallingCode
                    title={t('phone.title')}
                    placeholder="8xx xxxx xxxx"
                    flagSize="small"
                    style={{ width: '100%'}}
                />
            )}
        />
    )
}