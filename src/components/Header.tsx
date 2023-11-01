import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import PusakawanLogo from "./PusakawanLogo";
import Link from "next/link";

export default function Header() {
    const t = useTranslations('header');
    return (
        <Box component="header" sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 4, px: 12.5,
            boxShadow: "2px 2px 16px 0px rgba(0, 0, 0, 0.08)",
        }}>
            <Link href="/" title={t("pusakawan")}>
                <PusakawanLogo />
            </Link>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', '&>*': { fontWeight: 500 } }}>
                <Typography>{t('challenge')}</Typography>
                <Typography>{t('course')}</Typography>
                <hr style={{ height: '3rem' }} />
                <Link href="/register"><Typography>{t('register')}</Typography></Link>
                <Link href="/login"><Button size="large" variant="contained">{t('login')}</Button></Link>
            </Box>
        </Box>
    )
}