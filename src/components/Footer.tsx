import { Box, Typography } from "@mui/material";
import PusakawanLogo from "./PusakawanLogo";
import { useTranslations } from "next-intl";
import { footerInformation } from "@/lib/constants";
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';

export default function Footer() {
    const t = useTranslations("footer");
    const currentYear = new Date().getFullYear();
    return (
        <Box
            component="footer"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'primary.main',
                color: "white",
                px: "10rem"
            }}
        >
            <Box
                display="flex"
                my={10}
                justifyContent="space-between"
            // gap={20}
            >
                <PusakawanLogo white={true} />
                <Box
                    display="flex"
                    color="white"
                    gap={10}
                >
                    <div aria-label="office address">
                        <Typography component="h5" variant="h5" fontWeight={500} my={1}>
                            {t('office_location')}
                        </Typography>
                        <Box display="flex" gap={1}>
                            <a rel="noreferrer" target="_blank" href={footerInformation.office.href}><PlaceIcon /></a>
                            <Typography>
                                {footerInformation.office.value}
                            </Typography>
                        </Box>
                    </div>
                    <div aria-label="contact number">
                        <Typography component="h5" variant="h5" fontWeight={500} my={1}>
                            {t('contact_us')}
                        </Typography>
                        <Box display="flex" gap={1}>
                            <a rel="noreferrer" target="_blank" href={footerInformation.phone.href}><PhoneIcon /></a>
                            <Typography>
                                {footerInformation.phone.value}
                            </Typography>
                        </Box>
                    </div>
                </Box>
            </Box>
            <hr />
            <Typography variant="h5" component="p" my="75px" ml="auto">Copyrights &#169; {currentYear} Beneran Indonesia</Typography>
        </Box>
    )
}