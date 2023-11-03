import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Control, Controller } from 'react-hook-form';
import { ProfileInput } from '@/types/form';

type RowRadioProps = {
    name: keyof ProfileInput,
    control: Control<ProfileInput>
    title?: string;
    data: { value: string; label: string; }[];
}

export default function RowRadio({ name, control, title, data }: RowRadioProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value },
            }) => (
                <FormControl fullWidth>
                    {
                        title
                            ? <FormLabel id={`row-radio-label-${title}`}>{title}</FormLabel>
                            : null
                    }
                    <RadioGroup
                        row
                        aria-labelledby={`row-radio-${title}`}
                        name={`row-radio-group-${title}`}
                        value={value}
                        onChange={onChange}
                        sx={{ justifyContent: 'space-between' }}
                    >
                        {
                            data.map((dt) =>
                                <FormControlLabel value={dt.value} key={`control-label-${dt.value}`} control={<Radio />} label={dt.label} />
                            )
                        }
                    </RadioGroup>
                </FormControl>
            )} />
    );
}