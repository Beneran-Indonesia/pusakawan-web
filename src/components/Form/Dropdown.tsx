import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { DropdownProps } from '@/types/form';
import { useTranslations } from 'next-intl';

export default function
    Dropdown({ name, control, pickedItem, label, onOpen }: DropdownProps) {
    const t = useTranslations('form.text_field.error');
    const [items, setItems] = useState<{ id: number | string; value: string; }[]>([{ id: pickedItem, value: pickedItem }]);
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: { value: true, message: t('required') } }}
            render={({
                field: { onChange, value },
            }) => (
                <FormControl sx={{ m: 1, width: 380 }}>
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
                        onOpen={onOpen ? async () => {
                            if (items.length !== 1) return
                            // Assuming datas is an array of string
                            const datas = await onOpen();
                            if (name === 'ethnicity') {
                                setItems(datas.message.map((dt) => ({ id: dt.id, value: dt.title! })));
                                return;
                            }
                            setItems(datas.message.map((dt) => ({ id: dt.id, value: dt.name })));
                        } : undefined}
                    >
                        {
                            items.map((item) => <MenuItem key={`dropdown-${item.value}`} value={item.id}>{item.value}</MenuItem>)
                        }
                    </Select>
                </FormControl>
            )}
        />
    );
}
