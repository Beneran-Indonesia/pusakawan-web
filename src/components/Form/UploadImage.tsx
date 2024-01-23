import { Controller, FieldValues } from "react-hook-form";
import { styled } from '@mui/material/styles';
import { FormProps } from "@/types/form";
import { Dispatch, SetStateAction } from "react";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface UploadImageProps<T extends FieldValues> extends FormProps<T> {
    setProfilePicture: Dispatch<SetStateAction<File | null>>;
};

export default function UploadImage<T extends FieldValues>({ name, control, setProfilePicture }: UploadImageProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange },
            }) => (
                <VisuallyHiddenInput
                    type="file"
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={(e) => {
                        const files = e.target?.files
                        if (files) {
                            const image = files[0];
                            const urlImage = URL.createObjectURL(image);
                            // Have to use 2 setState because onChange is for preview. urlImage is a blob
                            // while image is a File. So setProfilePicture is used to send the data to API
                            onChange(urlImage);
                            setProfilePicture(image);
                        }
                    }}
                />
            )}
        />
    );
}