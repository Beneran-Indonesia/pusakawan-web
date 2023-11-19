import { formControlRoot } from "@/lib/constants";
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslations } from 'next-intl';
import { Controller, FieldValues } from "react-hook-form";
import { PasswordInputProps } from "@/types/form";

export default function PasswordInput<T extends FieldValues>({ name, control, showPassword, handleClickShowPassword, formSx }: PasswordInputProps<T>) {
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const t = useTranslations('form.text_field');
    const confirmation = name === 'confirmation';
    return (
        <Controller
            name={name}
            control={control}
            // If password, make min length to be 8.
            rules={{
                required: { value: true, message: t('error.required') },
                minLength: { value: 8, message: t('error.min_length_password') },
            }}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <FormControl variant="outlined" sx={formSx}>
                    <InputLabel htmlFor={confirmation ? "password-input-confirmation" : "password-input"}>{confirmation ? t('label.confirmation') : "Password"}</InputLabel>
                    <OutlinedInput
                        id={confirmation ? "password-input-confirmation" : "password-input"}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        error={!!error}
                        sx={formControlRoot}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    sx={{ pr: '0.75rem' }}
                                >
                                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label={confirmation ? t('label.confirmation') : "Password"}
                        onChange={onChange}
                        value={value}
                    />
                    {
                        !!error && (<FormHelperText error>
                            {error?.message}
                        </FormHelperText>)
                    }
                </FormControl>
            )}
        />
    )
}