import HomeButton from "@/components/HomeButton";
import { mockClass } from "@/lib/constants";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export default function MockClass() {
    const { title, category, description, s3Url } = mockClass;
    const t = useTranslations('class.overview');
    const router = useRouter();
    return (
        <Container>
            <HomeButton />
            <Typography>{title}</Typography>
            <Chip
                label={category}
                variant="filled"
                color="secondary"
                sx={{ color: 'primary.main', fontWeight: 500 }}
            />
            <Typography>{t('description')}</Typography>
            <Typography>{description}</Typography>
            <Button variant="contained" size="large" onClick={() => router.push(s3Url)}>
                {t('button')}
            </Button>
        </Container>
    )
}

export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
      props: {
        messages: (await import(`../../locales/${locale}.json`)).default,
      },
    };
  }