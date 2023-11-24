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
import { grade, religions } from "@/lib/constants";
import RowRadio from "./Form/RowRadio";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from 'react';
import { createBearerHeader } from '@/lib/utils';

type EditProfileProps = {
    accessToken: string;
    userData: ProfileInput & { profile_picture: string; };
    setSnackbar: (open: boolean, success: boolean, message: string) => void;
}

export default function EditProfile({ setSnackbar, userData, accessToken }: EditProfileProps) {
    const t = useTranslations('account.edit_profile');
    const [editLoading, setEditLoading] = useState(false);
    // TODO:
    const { control, handleSubmit, watch, getValues, formState: { isDirty, dirtyFields } } = useForm<ProfileInput>({ defaultValues: {...userData, user_category: userData !== undefined ? userData.user_category === 'MAHASISWA' ? t('status.scholar') as "MAHASISWA" : userData.user_category === 'SISWA' ? t('status.student') as "SISWA" : t('status.professional') as "PROFESSIONAL" : undefined } });
    const userCategory = watch('user_category');
    const onSubmit: SubmitHandler<ProfileInput> = async (data) => {
        setEditLoading(true);
        // If wanna be faster can put as a constant (below)
        const dirtyKeys = Object.keys(dirtyFields) as (keyof ProfileInput)[];
        const dirtyData = new FormData();
        // I'm sorry for any but really i would rather not be dealing with this!
        dirtyKeys.forEach((_, idx) => dirtyData.append(dirtyKeys[idx], data[dirtyKeys[idx]] as any));
        try {
            const res = await api.patch('/user/edit-profile/', {
                dirtyData,
                // This was a fucking nightmare.. form data was used instead of fucking JSON........
                //  should've known cuz we can patch headers and profile pictures
            }, { headers: { ...createBearerHeader(accessToken), "Content-Type": "multipart/form-data" } })
            setEditLoading(false);
            if (res.status === 200) {
                setSnackbar(true, true, t("edit_succeed"))
                return;
            }
        } catch (e) {
            console.error("PROFILE FORM ERROR: ", e)
        }
        setSnackbar(true, false, t("edit_failed"))
    };
    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}
            px={20} py={6} alignItems="center" mx="auto" maxWidth={700}
            display="flex" gap={3} flexDirection="column" width="100%"
            borderRadius={8} boxShadow={1}
        >
            <EditAvatar src={userData.profile_picture} />
            <Input name="full_name" control={control} label="Nama" required />
            <Input name="username" control={control} label="Username" required />
            <Input name="email" control={control} label="Email" required />
            <TelInput name="phone_no" control={control} required={false} />
            {/* Bio */}
            {/* DoB */}
            <RowRadio name="gender" control={control}
                data={[{ value: 'FEMALE', label: t('gender.female') }, { value: "MALE", label: t('gender.male') }]}
            />
            {/* Religion */}
            <Dropdown
                name="religion"
                label={t('religion')}
                control={control}
                pickedItem={getValues('religion')}
                onOpen={() => ({ status: 200, message: religions.map((dt) => ({ id: dt, name: dt, title: '' })) })}
            />
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
                    const provinces = res.message.filter((dt: { state_province: string; }) => dt.state_province === userProvince);
                    return { status: 200, message: provinces };
                }}
            />
            {/* Status */}
            <Dropdown
                name="user_category"
                label={t('user_category')}
                control={control}
                pickedItem={getValues('user_category')}  //
                onOpen={async () => ({ status: 200, message: [{ id: "PROFESSIONAL", name: t('status.professional') }, { id: "SISWA", name: t('status.student') }, { id: "MAHASISWA", name: t('status.scholar') }] })}
            />
            {
                userCategory === "PROFESSIONAL"
                    ? <>
                        {/* Workplace, institution, year */}
                        <Input
                            label={t('work')}
                            name='work'
                            control={control}
                            required
                        />
                        <Input
                            label={t('alumni')}
                            name='institution'
                            control={control}
                            required
                        />
                        <Input
                            label={t('graduation_year')}
                            name='year'
                            control={control}
                            type="number"
                            required
                        />
                    </>
                    : userCategory === "MAHASISWA"
                        ? <>
                            {/* major, institution, year */}
                            <Input
                                label={t('major')}
                                name='major'
                                control={control}
                                required
                            />
                            <Input
                                label={t('university')}
                                name='institution'
                                control={control}
                                required
                            />
                            <Input
                                label={t('entry_year')}
                                name='year'
                                control={control}
                                type="number"
                                required
                            />
                        </>
                        : <>
                            {/* class, institution, year */}
                            <Dropdown
                                label={t('class')}
                                name='grade'
                                control={control}
                                pickedItem={getValues("grade")!}
                                onOpen={async () => ({ status: 200, message: grade.map((dt) => ({ id: dt, name: dt, title: '' })) })}
                            />

                            <Input
                                label={t('school')}
                                name='institution'
                                control={control}
                                required
                            />
                            <Input
                                label={t('entry_year')}
                                name='year'
                                control={control}
                                type="number"
                                required
                            />
                        </>
            }
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