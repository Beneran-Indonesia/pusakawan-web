import { coursesPictures } from "@/lib/constants";
import Card from "../Card/Category";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UnderlinedLink from '@/components/UnderlinedLink';
import { ProgramData } from "@/types/components";
import ProgramCard from "../Card/Program";
import { databaseToUrlFormatted } from "@/lib/utils";
import { useDesktopRatio } from "@/lib/hooks";

const coursesKey = [
    "environment",
    "economy",
    "health"
]

export default function CoursesSection({ programs }: { programs?: ProgramData[]; }) {
    const t = useTranslations('courses_selection')
    const isDesktopRatio = useDesktopRatio();
    return (
        <Box
            display="flex"
            flexDirection="column"
            textAlign="center"
            justifyContent="center"
            gap={5}
            bgcolor="secondary.main"
            alignItems={isDesktopRatio ? "center": "normal"}
            py={6}
        >
            <Typography fontWeight={600} variant="h4" component="h4">{t.rich('title', {
                red: (chunks) => <Box component="span" color="primary.main">{chunks}</Box>
            })}</Typography>
            <CoursesCard data={programs} />
            <UnderlinedLink href="/program">
                <Typography fontWeight={500} variant="h5" component="h5" display="inline-flex" gap={1} alignItems="center">
                    {t('cta')}<ChevronRightIcon />
                </Typography>
            </UnderlinedLink>
        </Box>
    )
}

function CoursesCard({ data }: { data: undefined | ProgramData[] }) {
    const t = useTranslations('courses_selection');
    const isDesktopRatio = useDesktopRatio();
    return (
        <Box sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "row",
            gap: isDesktopRatio ? 12 : 8,
            textAlign: "left",
            paddingX: isDesktopRatio ? 0 : "3rem",
        }}>
            {/* This is placeholder card fallback in case data is not retreived lol */}
            {
                data?.length === 0 && coursesKey.map((cKey, idx) => (
                    <Card
                        key={cKey}
                        title={t(`${cKey}.title`)}
                        text={t(`${cKey}.text`)}
                        button={t('button')} img={coursesPictures[idx]}
                    />
                ))
            }
            {/* This is the real card. For now just retrieve the first 3 that was given */}
            {
                data && data.slice(0, 3).map((dt) => (
                    <ProgramCard
                        key={dt.id + dt.title + "main-page"}
                        img={dt.banners[0].image}
                        title={dt.title}
                        price={dt.price}
                        href={"/program/" + databaseToUrlFormatted(dt.title)}
                    />
                ))
            }
        </Box>
    )
}