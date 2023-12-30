import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import Image from "next/image";

type ProfileClassCardProps = {
    src: string;
    title: string;
    status: "FINISHED" | "ONGOING" | "STARTING"
}

export default function ProfileClassCard({ src, title, status }: ProfileClassCardProps) {
    const t = useTranslations('account.horizontal_tab.card')
    return (
        <Box display="flex" gap={3} border="1px solid #CCC" margin={4}
        borderRadius={2} padding={2} boxShadow={1}>
            <Image style={{ borderRadius: '0.5rem'}} src={src} alt="class thumbnail" width={150} height={100} />
            <Box display="flex" py={1} flexDirection="column" justifyContent="space-between">
                <Typography variant='h5' fontWeight={500} component='h4'>{title}</Typography>
                <Button size="small" type="button" variant="contained" sx={{width: 'fit-content'}}>
                    {
                        status === "FINISHED"
                            ? t('finished')
                            : status === "ONGOING"
                                ? t('on_going')
                                : t('starting')
                    }
                </Button>
            </Box>
        </Box>
    )
}