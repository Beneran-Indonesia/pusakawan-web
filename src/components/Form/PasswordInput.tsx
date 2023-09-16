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
import { Control, Controller } from "react-hook-form";
import { RegisterUserProps } from "@/types/auth";

type PasswordInputProps = {
    showPassword: boolean;
    handleClickShowPassword: () => void;
    control: Control<RegisterUserProps>; // | Control<LoginUserProps>;

}

export default function PasswordInput({ control, showPassword, handleClickShowPassword }: PasswordInputProps) {
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const t = useTranslations('form.text_field.error');
    return (
        <Controller
            name="password"
            control={control}
            // If password, make min length to be 8.
            rules={{
                required: { value: true, message: t('required') },
                minLength: { value: 8, message: t('min_length_password') },
            }}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <FormControl variant="outlined" sx={{ mt: 3 }}>
                    <InputLabel htmlFor="password-input">Password</InputLabel>
                    <OutlinedInput
                        id="password-input"
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
                        label="Password"
                        onChange={onChange}
                        value={value}
                    />
                    {
                        !!error && (<FormHelperText error id="password-input-error">
                            {error?.message}
                        </FormHelperText>)
                    }
                </FormControl>
            )}
        />
    )
}