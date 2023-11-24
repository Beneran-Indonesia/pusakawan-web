import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import { mockProgramData, programPagePicture } from "@/lib/constants";
import { BreadcrumbProps, ProgramData, SortBy } from "@/types/components";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useState } from "react";
import ProgramCard from "@/components/Card/Program";
import Autocomplete from "@/components/Autocomplete";
import SortBySelect from "@/components/SortbySelect";

export default function ProgramPage() {
    const [filter, setFilter] = useState<SortBy>('ALL');
    const [currentData, setCurrentData] = useState(mockProgramData);
    const t = useTranslations('program.header')
    const t2 = useTranslations('program.content')
    const { breadcrumbData }: BreadcrumbProps = { breadcrumbData: [{ id: 'breadcrumb01', children: t('breadcrumbs.home'), href: '/' }, { id: 'breadcrumb02', children: t('breadcrumbs.program'), href: '/program', active: true }] };
    const changeProgramAmount = (num: number) => num > 5 ? 1 : num;
    const onFilterChange = (filterChange: SortBy) => {
        setFilter(filterChange);
        if (filterChange === 'ALL') setCurrentData(mockProgramData);
        else if (filterChange === 'FREE') setCurrentData(mockProgramData.filter((dt) => !dt.paid));
        else if (filterChange === 'PAID') setCurrentData(mockProgramData.filter((dt) => dt.paid));
    };
    console.log('currentdata', currentData)
    return (
        <>
            <Head>
                <title>Program</title>
            </Head>
            {/* Header part */}
            {/* <Box position="relative"> */}
            <Box display="flex" px={25.5} py={7} flexDirection="column" justifyContent="space-between"
                sx={{
                    background: `linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url('${programPagePicture}')`,
                    backgroundRepeat: "no-repeat", backgroundSize: 'cover', backgroundPosition: '0 45%'
                }}
                height={400}
            >
                {/* TODO: */}
                <BreadcrumbsWrapper breadcrumbData={breadcrumbData} />
                <Typography variant="h4" component="h2" fontWeight={600} maxWidth={469}>
                    {t.rich('title', {
                        red: (chunks) => <Box component="span" color="primary.main">{chunks}</Box>
                    })}
                </Typography>
            </Box>
            {/* Content part */}
            <Box display="flex" flexDirection="column" alignItems="center" py={6} px={24} gap={3}
                borderRadius="1.5rem 1.5rem 0rem 0rem"
                bgcolor="white"
                marginTop="-20px"
            >
                <Typography variant="h4" component="h4" fontWeight={600}>
                    {t2('title')}
                </Typography>
                <Box display="flex" flexDirection="row" gap={3}>
                    <Autocomplete classData={mockProgramData} />
                    <SortBySelect currentValue={filter} onChange={onFilterChange} />
                </Box>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
                    justifyContent="center" rowGap={3}
                >
                    {/* <Card img={mockClass.s3Url}  /> */}
                    <CoursesCard data={currentData} />
                    {/* do card here */}
                </Grid>
            </Box>
            {/* </Box> */}
        </>
    )
}

function CoursesCard({ data }: { data: ProgramData[] }) {
    return (
        <>
            {
                data.map((dt, idx) => (
                    <Grid item
                        key={`course-card ${dt.title} ${dt.id}`}
                    >
                        <ProgramCard
                            img={dt.img}
                            title={dt.title}
                            price={dt.paid ? dt.price! : null}
                        />
                    </Grid>
                ))
            }
        </>
    )
}

export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
        props: {
            messages: (await import(`../../locales/${locale}.json`)).default,
        },
    };
}