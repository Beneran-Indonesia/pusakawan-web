import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Controller } from 'react-hook-form';
import { DropdownProps } from '@/types/form';
import { useTranslations } from 'next-intl';

export default function Dropdown({ name, control, items, label }: DropdownProps) {
    const t = useTranslations('form.text_field.error');
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: { value: true, message: t('required') } }}
            render={({
                field: { onChange, value },
            }) => (
                <FormControl sx={{ m: 1, width: 380 }} required>
                    <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
                    <Select
                        labelId={`select-label-${label}`}
                        id={`select-item-${label}`}
                        value={value}
                        label={label}
                        onChange={onChange}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    boxShadow: 1,
                                    '& .MuiMenuItem-root': {
                                        py: 1,
                                        px: 2,
                                    },
                                },
                            },
                        }}
                    >
                        {
                            items.map((item) => {
                                const val = name === 'ethnicity' ? item.title : item.name;
                                return (
                                    <MenuItem key={`dropdown-${val}`} value={name === 'user_category' ? item.id : val}>
                                        {val}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
            )}
        />
    );
}
