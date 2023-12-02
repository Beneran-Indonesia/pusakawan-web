import { coursesPictures } from "@/lib/constants";
import Card from "../Card/Category";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UnderlinedLink from '@/components/UnderlinedLink';

const coursesKey = [
    "environment",
    "economy",
    "health"
]

export default function CoursesSection() {
    const t = useTranslations('courses_selection')
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={5}
            bgcolor="secondary.main"
            py={6}
        >
            <Typography fontWeight={600} variant="h4" component="h4">{t.rich('title', {
                red: (chunks) => <Box component="span" color="primary.main">{chunks}</Box>
            })}</Typography>
            <CoursesCard />
            <UnderlinedLink href="/program">
                <Typography fontWeight={500} variant="h5" component="h5" display="inline-flex" gap={1} alignItems="center">
                    {t('cta')}<ChevronRightIcon />
                </Typography>
            </UnderlinedLink>
        </Box>
    )
}

function CoursesCard() {
    const t = useTranslations('courses_selection')
    return (
        <Box
            display="flex"
            gap={12}
        >
            {
                coursesKey.map((cKey, idx) => (
                    <Card
                        key={cKey}
                        title={t(`${cKey}.title`)}
                        text={t(`${cKey}.text`)}
                        button={t('button')} img={coursesPictures[idx]}
                    />
                ))
            }
        </Box>
    )
}