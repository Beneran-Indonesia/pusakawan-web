import { DatepickerProps } from '@/types/form';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslations } from 'next-intl';
import { Controller, FieldValues } from "react-hook-form";
import dayjs from 'dayjs';


export default function DatePicker<T extends FieldValues>({ name, control, label, required }: DatepickerProps<T>) {
    const t = useTranslations('form.text_field.error');
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: { value: required, message: t('required') }
            }}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <MUIDatePicker
                    label={label}
                    views={name === 'year' ? ['year'] : ['year', 'month', 'day']}
                    value={dayjs(value)}
                    onChange={onChange}
                    sx={{ width: '100%', mt: 1 }}
                    slotProps={{
                        textField: {
                            variant: 'outlined',
                            error: !!error,
                            helperText: error?.message,
                            required
                        },
                        desktopPaper: {
                            sx: {
                                boxShadow: 1
                            }
                        },
                        mobilePaper: {
                            sx: {
                                boxShadow: 1
                            }
                        }
                    }}
                />

            )}
        />
    )
}