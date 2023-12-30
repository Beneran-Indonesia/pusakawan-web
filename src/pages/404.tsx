import ImageWrapper from "@/components/ImageWrapper";
import UnderlinedLink from "@/components/UnderlinedLink";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import Logo404 from "@svgs/404.svg";
import { useTranslations } from "next-intl";

export default function Page404() {
    const t = useTranslations("error_page.404")
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', textAlign: 'center', my: 8 }}>
            <ImageWrapper src={Logo404} alt="Pusakawan 404 logo" width={480} height={216} />
            <Typography>{t('title')}</Typography>
            <Typography>{t('description')}</Typography>
            <UnderlinedLink href='/' sx={{ color: 'primary.main', mt: 4 }} title={t('button')}>{t('button')}</UnderlinedLink>
        </Container>
    )
}

export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
        props: {
            messages: (await import(`../locales/${locale}.json`)).default,
        },
    };
}