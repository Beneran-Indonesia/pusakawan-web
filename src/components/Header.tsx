import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import PusakawanLogo from "./PusakawanLogo";
import Link from "next/link";


export default function Header() {
    const t = useTranslations('header');
    return (
        <Container maxWidth="lg" component="header" sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4
        }}>
            <PusakawanLogo />
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', '&>*': { fontWeight: 500 } }}>
                <Typography>{t('challenge')}</Typography>
                <Typography>{t('course')}</Typography>
                <hr style={{ height: '3rem' }} />
                <Link href="/register"><Typography>{t('register')}</Typography></Link>
                <Link href="/login"><Button size="large" variant="contained">{t('login')}</Button></Link>
            </Box>
        </Container>
    )
}