import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PusakawanLogo from "./PusakawanLogo";
import { useTranslations } from "next-intl";
import { footerInformation } from "@/lib/constants";
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import Link from "next/link";
import ChangeLanguageButtons from "./LanguageSwitcher";
import EmailIcon from '@mui/icons-material/Email';
import { ReactNode } from "react";
import { useDesktopRatio } from "@/lib/hooks";

export default function Footer() {
    const t = useTranslations("footer");
    const currentYear = new Date().getFullYear();
    const isDesktopRatio = useDesktopRatio();
    return (
        <Box
            component="footer"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'primary.main',
                color: "white",
                px: isDesktopRatio ? "10rem" : "1rem"
            }}
        >
            <Box
                display="flex"
                my={isDesktopRatio ? 10 : 4}
                justifyContent="space-between"
                flexDirection={isDesktopRatio ? "row" : "column"}
            // gap={20}
            >
                <PusakawanLogo white={true} />
                <Box
                    display="flex"
                    color="white"
                    gap={isDesktopRatio ? 10 : 2}
                    flexDirection={isDesktopRatio ? "row" : "column"}
                    mt={isDesktopRatio ? 0 : 2}
                >
                    <Box aria-label="office address">
                        <Typography component="h5" variant="h5" fontWeight={500} my={1}>
                            {t('office_location')}
                        </Typography>
                        <FooterChild label="address maps" icon={<PlaceIcon />} href={footerInformation.office.href} value={footerInformation.office.value} />
                    </Box>
                    <Box aria-label="contact">
                        <Typography component="h5" variant="h5" fontWeight={500} my={1}>
                            {t('contact_us')}
                        </Typography>
                        <FooterChild label="phone number" icon={<PhoneIcon />} href={footerInformation.phone.href} value={footerInformation.phone.value} />
                        <FooterChild label="email address" icon={<EmailIcon />} href={footerInformation.email.href} value={footerInformation.email.value} />
                        <ChangeLanguageButtons sx={{ m: 0, my: isDesktopRatio ? 0 : "0.5rem" }} />
                        {/* <Typography>Syarat ketentuan</Typography> */}
                    </Box>
                </Box>
            </Box>
            <hr />
            <Typography variant="h5" component="p" my={isDesktopRatio ? "75px" : "32px"} ml="auto">Copyrights &#169; {currentYear} <Link href='https://beneranindonesia.id/'>Beneran Indonesia</Link></Typography>
        </Box>
    )
}

type FooterChildProps = {
    icon: ReactNode;
    href: string;
    value: string;
    label: string;
}

function FooterChild({ icon, href, value, label }: FooterChildProps) {
    return (
        <Box aria-label={label} display="flex" gap={1}>
            <a rel="noreferrer" target="_blank" href={href}>{icon}</a>
            <Typography>
                {value}
            </Typography>
        </Box>
    )
}