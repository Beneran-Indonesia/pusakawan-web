import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { Input } from "./Form/Input";
import { Control, SubmitHandler, useForm } from "react-hook-form";
import { DropdownItems, ProfileInput } from "@/types/form";
import TelInput from "./Form/TelInput";
import EditIcon from '@mui/icons-material/EditOutlined';
import Dropdown from "./Form/Dropdown";
import api from "@/lib/api";
import { useTranslations } from "next-intl";
import { grade, religions } from "@/lib/constants";
import RowRadio from "./Form/RowRadio";
import LoadingButton from "@mui/lab/LoadingButton";
import { Dispatch, SetStateAction, useState } from 'react';
import { createBearerHeader } from '@/lib/utils';
import DatePicker from './Form/Datepicker';
import { useSession } from 'next-auth/react';
import UploadImage from './Form/UploadImage';

type UserData = ProfileInput & { profile_picture: string; };

type EditProfileProps = {
    accessToken: string;
    userData: UserData;
    setSnackbar: (open: boolean, success: boolean, message: string) => void;
    dropdownItems: DropdownItems;
}

export default function EditProfile({ setSnackbar, userData, accessToken, dropdownItems }: EditProfileProps) {
    const t = useTranslations('account.edit_profile');
    const [editLoading, setEditLoading] = useState(false);

    const [profilePicture, setProfilePicture] = useState<null | File>(null);
    const { data: session, update } = useSession();
    const { control, handleSubmit, watch, formState: { isDirty, dirtyFields } } = useForm<ProfileInput>({ defaultValues: { ...userData } });

    const userCategory = watch('user_category');

    const onSubmit: SubmitHandler<ProfileInput> = async (data) => {
        setEditLoading(true);
        // If wanna be faster can put as a constant (below)
        const dirtyKeys = Object.keys(dirtyFields) as (keyof ProfileInput)[];
        const dirtyData = new FormData();
        // Sorry.
        dirtyKeys.forEach(async (_, idx) => {
            const key = dirtyKeys[idx];
            let val = data[key];
            if (key === "profile_picture") {
                dirtyData.append("profile_picture", profilePicture!)
                return;
            } else if (key in dropdownItems) {
                const dropdownData = dropdownItems[key as keyof DropdownItems];
                val = dropdownData.find((dt) => {
                    if (key === "ethnicity") {
                        return dt.title === val;
                    }
                    return dt.name === val;
                })!.id;
            }
            dirtyData.append(key, val as string)
        });

        try {
            const res = await api.patch('/user/edit-profile/',
                dirtyData,
                {
                    headers: { ...createBearerHeader(accessToken), "Content-Type": "multipart/form-data" }
                })
            setEditLoading(false);
            if (res.status === 200) {
                setSnackbar(true, true, t("edit_succeed"));
                // Update session
                if (res.data.profile_picture) {
                    await update({ ...session, user: { ...data, profile_picture: res.data.profile_picture } });
                    return;
                }
                await update({ ...session, user: data })
                return;
            }
        } catch (e) {
            console.error("PROFILE FORM ERROR: ", e)
        }
        setEditLoading(false);
        setSnackbar(true, false, t("edit_failed"))
    };

    const imagePreview = watch("profile_picture");
    const selectedProvinceId = watch("province");

    const selectedProvince = dropdownItems!.province.find(dt => dt.name === selectedProvinceId)?.name;

    const cityDistrict = dropdownItems!.city.filter(dt => dt.state_province === selectedProvince);

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}
            px={20} py={6} alignItems="center" mx="auto" maxWidth={700}
            display="flex" gap={3} flexDirection="column" width="100%"
            borderRadius={8} boxShadow={1}
        >
            <EditAvatar src={imagePreview ?? userData.profile_picture} control={control} setProfilePicture={setProfilePicture} />
            <Input name="full_name" control={control} label={t("name")} required />
            <Input name="username" control={control} label={t("username")} required />
            <Input name="email" control={control} label={t("email")} required />
            <TelInput name="phone_no" control={control} required={false} />
            {/* Bio */}
            <Input name="bio" control={control} label={t("bio")} required={false} />

            {/* DoB */}
            <DatePicker control={control} label={t("dob")} name="date_of_birth" required />

            {/* Gender */}
            <RowRadio name="gender" control={control}
                data={[{ value: 'FEMALE', label: t('gender.female') }, { value: "MALE", label: t('gender.male') }]}
            />
            {/* Religion */}
            <Dropdown
                name="religion"
                label={t('religion')}
                control={control}
                items={religions.map((dt) => ({ id: dt, name: dt }))}
            />

            {/* Ethnicity */}
            <Dropdown
                name="ethnicity"
                label={t('ethnicity')}
                control={control}
                items={dropdownItems!.ethnicity}
            />

            {/* Island */}
            <Dropdown
                name="island"
                label={t('island')}
                control={control}
                items={dropdownItems!.island}
            />

            {/* Province */}
            <Dropdown
                name="province"
                label={t('province')}
                control={control}
                items={dropdownItems!.province}
            />

            {/* City */}
            <Dropdown
                name="city"
                label={t('city')}
                control={control}
                items={cityDistrict}
            />
            {/* Status */}
            <Dropdown
                name="user_category"
                label={t('user_category')}
                control={control}
                items={[{ id: "PROFESSIONAL", name: t('status.professional') }, { id: "SISWA", name: t('status.student') }, { id: "MAHASISWA", name: t('status.scholar') }]}
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
                        <DatePicker
                            name='year'
                            label={t('graduation_year')}
                            control={control}
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
                            <DatePicker
                                name='year'
                                control={control}
                                label={t('entry_year')}
                                required
                            />
                        </>
                        : <>
                            {/* class, institution, year */}
                            <Dropdown
                                label={t('class')}
                                name='grade'
                                control={control}
                                items={grade.map((grd) => ({ id: grd, name: grd }))}
                            />
                            <Input
                                label={t('school')}
                                name='institution'
                                control={control}
                                required
                            />
                            <DatePicker
                                name='year'
                                control={control}
                                label={t('entry_year')}
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

type EditAvatarProps = {
    src: string;
    control: Control<ProfileInput>;
    setProfilePicture: Dispatch<SetStateAction<File | null>>;
}

function EditAvatar({ src, control, setProfilePicture }: EditAvatarProps) {
    const t = useTranslations("account.edit_profile");

    return (
        <Box position="relative" width="fit-content" mb={3} component="label"
            title={t("profile_picture")} sx={{ cursor: "pointer" }}>
            <Avatar src={src} alt="user avatar" sx={{ height: 100, width: 100 }} />
            <span style={{ position: 'absolute', right: -5, top: -5 }}><EditIcon fontSize="large" /></span>
            <UploadImage control={control} name="profile_picture" setProfilePicture={setProfilePicture} />
        </Box>
    )
}