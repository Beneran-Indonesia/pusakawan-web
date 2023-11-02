import { Avatar, Box } from "@mui/material";
import { Input } from "./Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProfileInput } from "@/types/form";
import TelInput from "./Form/TelInput";
import EditIcon from '@mui/icons-material/EditOutlined';

type EditProfileProps = {
    userDefaultValue: {
        full_name: string;
        userName: string;
        phoneNumber: string;
        email: string;
        profile_picture: string;
    }
}

export default function EditProfile({ userDefaultValue }: EditProfileProps) {
    const { control, handleSubmit, setError } = useForm<ProfileInput>({ defaultValues: { ...userDefaultValue, gender: 'female', province: '', hometown: '', island: '', ethnicity: '', profession: '', major: '' } });
    const onSubmit: SubmitHandler<ProfileInput> = (data) => console.log(data);
    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}
            px={20} py={6} alignItems="center" mx="auto" maxWidth={700}
            display="flex" gap={3} flexDirection="column" width="100%"
            borderRadius={8} boxShadow="2px 2px 16px 0px rgba(0, 0, 0, 0.08)"
        >
            <EditAvatar src={userDefaultValue.profile_picture} />
            <Input name="full_name" control={control} label="Nama" required />
            <Input name="username" control={control} label="Username" required />
            <TelInput control={control} />
            <Input name="email" control={control} label="Email" required />
            <div>Jenis kelamin</div>
            <div>Provinsi</div>
            we
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