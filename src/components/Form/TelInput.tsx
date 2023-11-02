import { RegisterUserProps } from "@/types/auth";
import { Control, Controller } from "react-hook-form";
import { MuiTelInput } from 'mui-tel-input'
import { formControlRoot } from "@/lib/constants";
import { useTranslations } from 'next-intl';
import { ProfileInput } from "@/types/form";

type TelInputProps = {
    control: Control<RegisterUserProps> | Control<ProfileInput>; // | Control<LoginUserProps>;
}

export default function TelInput({ control }: TelInputProps) {
    const t = useTranslations('form.text_field.error');
    const t2 = useTranslations('form.phone');
    return (
        <Controller
            name="phone_no"
            control={control}
            rules={{
                required: { value: true, message: t('required') },
                minLength: { value: 4, message: t('min_length_phone') },
                maxLength: { value: 19, message: t('max_length_phone')}
            }}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <MuiTelInput
                    helperText={error ? error.message : null}
                    error={!!error}
                    value={value}
                    onChange={onChange}
                    InputProps={{ sx: formControlRoot }}
                    defaultCountry="ID"
                    forceCallingCode
                    title={t2('title')}
                    placeholder="8xx xxxx xxxx"
                    flagSize="small"
                    style={{ width: '100%'}}
                />
            )}
        />
    )
}