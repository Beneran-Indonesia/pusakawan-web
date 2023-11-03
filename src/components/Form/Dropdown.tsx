import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { DropdownProps } from '@/types/form';

export default function Dropdown({ name, control, pickedItem, label, onOpen }: DropdownProps) {
    // Placeholder with id 999 because no way they have an id of 999 lmao and by theory if nothing changes then it won't be submitted.
    const [items, setItems] = useState<{id: number; value: string;}[]>([{ id: pickedItem as unknown as number, value: pickedItem }]);
    return (
        <Controller
            name={name}
            control={control}
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
                        onOpen={onOpen ? async () => {
                            if (items.length !== 1) return
                            // Assuming datas is an array of string
                            const datas = await onOpen();
                            if (name === 'ethnicity') {
                                setItems(datas.message.map((dt) => ({ id: dt.id, value: dt.title })));
                                return;
                            }
                            setItems(datas.message.map((dt) => ({ id: dt.id, value: dt.name })));
                            // const cities = datas.message.map((dt) => )
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
