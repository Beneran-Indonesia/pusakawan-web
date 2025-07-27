// menampilkan daftar program (halaman utama program)

import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import { programPagePicture } from "@/lib/constants";
import { BreadcrumbLinkProps, ProgramData, SortBy } from "@/types/components";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useState } from "react";
import ProgramCard from "@/components/Card/Program";
import Autocomplete from "@/components/Autocomplete";
import SortBySelect from "@/components/SortbySelect";
import { databaseToUrlFormatted } from "@/lib/utils";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getAllStorylinePrograms } from "@/lib/api";
import ProfileNotCompleteNotice from "@/components/ProfileNotCompleteNotice";
import { useDesktopRatio } from "@/lib/hooks";

export default function ProgramPage({ programData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [filter, setFilter] = useState<SortBy>('ALL');
    const [currentData, setCurrentData] = useState(programData);
    const t = useTranslations('program');
    const isDesktopRatio = useDesktopRatio();

    const breadcrumbData: BreadcrumbLinkProps[] = [
        { children: t('header.breadcrumbs.home'), href: '/' }, 
        { children: t('header.breadcrumbs.program'), href: '/program', active: true }
    ];

    const onFilterChange = (filterChange: SortBy) => {
        setFilter(filterChange);
        if (filterChange === 'ALL') setCurrentData(programData);
        else if (filterChange === 'FREE') setCurrentData(programData.filter((dt) => dt.price === 0));
        else if (filterChange === 'PAID') setCurrentData(programData.filter((dt) => dt.price !== 0));
    };
    const isDesktopRatio = useDesktopRatio();
    return (
        <>
            <Head>
                <title>Program</title>
            </Head>

            {/* Header part */}
            <ProfileNotCompleteNotice />
            <Box 
                display="flex" 
                px={isDesktopRatio ? 25.5 : 2} 
                py={7} flexDirection="column" 
                justifyContent="space-between"
                sx={{
                    background: `linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url('${programPagePicture}')`,
                    backgroundRepeat: "no-repeat", backgroundSize: 'cover', backgroundPosition: '0 45%'
                }}
                height={400}
            >
                <BreadcrumbsWrapper breadcrumbData={breadcrumbData} />
                <Typography variant="h4" component="h2" fontWeight={600} maxWidth={469}>
                    {t.rich('header.title', {
                        red: (chunks) => <Box component="span" color="primary.main">{chunks}</Box>
                    })}
                </Typography>
            </Box>

            {/* Content part */}
            <Box display="flex" flexDirection="column" alignItems="center" py={isDesktopRatio ? 6 : 3} px={isDesktopRatio ? 24 : 5} gap={3}
                borderRadius="1.5rem 1.5rem 0rem 0rem"
                bgcolor="white"
                marginTop="-20px"
            >
                <Typography variant="h4" component="h4" fontWeight={600}
                textAlign={isDesktopRatio ? "left" : "center"}
                >
                    {t('content.title')}
                </Typography>
                <Box display="flex" flexDirection="row" gap={3}>
                    <Autocomplete classData={programData} />
                    <SortBySelect currentValue={filter} onChange={onFilterChange} />
                </Box>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 1, sm: 2, md: 3 }}
                    justifyContent="center"
                    rowGap={3}
                    mt={4}
                >
                    {/* <Card img={mockClass.s3Url}  /> */}
                    <CoursesCard data={currentData} />
                    {/* do card here */}
                </Grid>
            </Box>
        </>
    )
}

type CoursesCardProps = { data: ProgramData[] }

function CoursesCard({ data }: CoursesCardProps) {
    const t = useTranslations("program.card");

    if (data.length === 0) {
        return <Typography mt={4}>{t("empty")}</Typography>;
    }

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {
                data.map((dt) => (
                    <Grid item xs={12} sm={6} md={4} key={`course-card ${dt.title} ${dt.id}`}>
                        <ProgramCard
                            img={dt.banners[0]?.image}
                            title={dt.title}
                            price={dt.price}
                            href={`/program/${databaseToUrlFormatted(dt.title)}/`}
                        />
                    </Grid>
                ))
            }
        </Grid>
    );
}

type Programs = {
    programData: ProgramData[];
    // messages: string;
}

export const getServerSideProps: GetServerSideProps<Programs> = async (ctx) => {
    const { locale } = ctx;
    const storylinePrograms = await getAllStorylinePrograms();
    const defaultReturn = { 
        programData: [], 
        messages: (await import(`../../locales/${locale}.json`)).default 
    };
    
    if (!storylinePrograms) return { props: { ...defaultReturn } }
    // const res = await api.get('/programs', { headers: ...})
    return {
        props: {
            ...defaultReturn,
            programData: storylinePrograms.message
        }
    };
}
