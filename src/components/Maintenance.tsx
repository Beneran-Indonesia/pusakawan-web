import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ImageWrapper from "./ImageWrapper";
import MaintenanceIllustration from "@svgs/maintenance.svg"
import { useTranslations } from "next-intl";

export default function MaintenancePage() {
    const t = useTranslations('error_page');
    return (
        <Box display="flex" flexDirection="column" maxWidth="860px" margin="auto" alignItems="center" my={12} gap={3}>
            <Typography variant="h3" fontWeight={600}>
                {t('maintenance.title')}
            </Typography>
            <Typography variant="h5" fontWeight={500}>
                {t('maintenance.description')}
            </Typography>
            <Button href="/" variant="contained">
                {t('maintenance.button')}
            </Button>
            <ImageWrapper src={MaintenanceIllustration} alt="maintenance illustration" />
        </Box>
    )
}