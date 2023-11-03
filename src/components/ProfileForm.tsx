import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { Input } from "./Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProfileInput } from "@/types/form";
import TelInput from "./Form/TelInput";
import EditIcon from '@mui/icons-material/EditOutlined';
import Dropdown from "./Form/Dropdown";
import api, { getEditProfileFields } from "@/lib/api";
import { useTranslations } from "next-intl";
import { religions } from "@/lib/constants";
import RowRadio from "./Form/RowRadio";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from 'react';
import { createBearerHeader } from '@/lib/utils';

type EditProfileProps = {
    accessToken: string;
    userData: ProfileInput & { profile_picture: string; };
}

export default function EditProfile({ userData, accessToken }: EditProfileProps) {
    const t = useTranslations('account.edit_profile');
    const [editLoading, setEditLoading] = useState(false);
    const { control, handleSubmit, getValues, formState: { isDirty, dirtyFields } } = useForm<ProfileInput>({ defaultValues: { ...userData, profession: '', major: '' } });
    const onSubmit: SubmitHandler<ProfileInput> = async (data) => {
        setEditLoading(true);
        // If wanna be faster can put as a constant (below)
        const dirtyKeys = Object.keys(dirtyFields) as (keyof ProfileInput)[];
        const dirtyData = {} as {[key: string]: string};
        dirtyKeys.forEach((dt, idx) => dirtyData[dirtyKeys[idx]] = data[dirtyKeys[idx]]);
        
        // const dirtyData = [...Array(dirtyKeys.length)].map((_, idx) => ( { [dirtyKeys[idx]] :data[dirtyKeys[idx]]} ));
        const res = await api.patch('/user/edit-profile/', {
            ...dirtyData,
            // data,
        }, { headers: { ...createBearerHeader(accessToken)} })
        setEditLoading(false);
        console.log(res.data)
    };
    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}
            px={20} py={6} alignItems="center" mx="auto" maxWidth={700}
            display="flex" gap={3} flexDirection="column" width="100%"
            borderRadius={8} boxShadow="2px 2px 16px 0px rgba(0, 0, 0, 0.08)"
        >
            <EditAvatar src={userData.profile_picture} />
            <Input name="full_name" control={control} label="Nama" required />
            <Input name="username" control={control} label="Username" required />
            <TelInput control={control} />
            <Input name="email" control={control} label="Email" required />
            {/* Jurusan Kuliah */}

            <RowRadio name="gender" control={control}
                data={[{ value: 'FEMALE', label: t('gender.female') }, { value: "MALE", label: t('gender.male') }]}
            />
            {/* Religion */}
            <Dropdown
                name="religion"
                label={t('religion')}
                control={control}
                pickedItem={getValues('religion')}
                onOpen={() => ({ status: 200, message: religions.map((dt) => ({ id: dt, name: dt })) })}
            />
            {/* Profesi */}

            {/* Ethnicity */}
            <Dropdown
                name="ethnicity"
                label={t('ethnicity')}
                control={control}
                pickedItem={getValues("ethnicity")}
                onOpen={getEditProfileFields(`/user/ethnicity/`, accessToken)}
            />

            {/* Island */}
            <Dropdown
                name="island"
                label={t('island')}
                control={control}
                pickedItem={getValues("island")}
                onOpen={getEditProfileFields(`/address/island/`, accessToken)}
            />

            {/* Province */}
            <Dropdown
                name="province"
                label={t('province')}
                control={control}
                pickedItem={getValues("province")}
                onOpen={getEditProfileFields(`/address/state-province/`, accessToken)}
            />

            {/* City */}
            <Dropdown
                name="city"
                label={t('city')}
                control={control}
                pickedItem={getValues("city")}
                onOpen={async () => {
                    const userProvince = getValues("province");
                    // Have to filter data according to user's province.
                    const res = await getEditProfileFields(`/address/city-district/`, accessToken)();
                    if (res.status !== 200 || !userProvince) return res;
                    const provinces = res.message.filter((dt) => dt.state_province === userProvince);
                    return { status: 200, message: provinces };
                }}
            />
            <LoadingButton variant="contained" size="large" type="submit" disabled={!isDirty} loading={editLoading}>
                {t('button')}
            </LoadingButton>
        </Box>
    )
}

function EditAvatar({ src }: { src: string }) {
    return (
        <Box position="relative" width="fit-content" mb={3}>
            <Avatar src={src} alt="user avatar" sx={{ height: 100, width: 100 }} />
            <span style={{ position: 'absolute', right: -5, top: -5 }}><EditIcon fontSize="large" /></span>
        </Box>
    )
}