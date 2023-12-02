import Accordion from "@/components/Accordion/Accordion";
import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import { getClassOverviewData } from "@/lib/api";
import { formatNumberToIdr } from "@/lib/utils";
import { BreadcrumbLinkProps, ClassOverview } from "@/types/components";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export default function MockClass({ classData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const t = useTranslations('class.overview');
    const router = useRouter();
    const breadcrumbData: ({
        id: string;
    } & BreadcrumbLinkProps)[] = [
            { id: 'breadcrumb0', href: '/', children: t('breadcrumbs.home'), title: t('breadcrumbs.home') },
            { id: 'breadcrumb1', href: '/program', children: t('breadcrumbs.program'), title: t('breadcrumbs.program') },
            { id: 'breadcrumb3', href: router.pathname, children: classData.title, title: classData.title, active: true },
        ];
    const { title, description, modules, assignment, img } = classData;
    return (
        <>
            <Box sx={{
                pt: 4,
                background: `linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url('${img}')`,
                backgroundRepeat: "no-repeat", backgroundSize: 'cover', backgroundPosition: '0 45%',
                height: 345, position: 'relative'
            }} >
                <Container>
                    <BreadcrumbsWrapper breadcrumbData={breadcrumbData} />
                </Container>
                <BlurBox />
            </Box>

            <Container sx={{ mt: -6,  position: 'relative', mb: 10 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Typography variant='h2' component='h2' fontWeight={600}>{title}</Typography>
                    <Box display="flex" gap={4}>
                        <Button variant="contained" size="medium">
                            {
                                classData.paid
                                    ? <>
                                        {t('button.free')}
                                        <Typography variant="h4" component="span">
                                            {formatNumberToIdr(classData.price!)}
                                        </Typography>
                                    </>
                                    : t('button.free')
                            }
                        </Button>
                        <Box>100 poin</Box>
                    </Box>
                    <Typography variant="h5" component="h5" fontWeight={600}>{t('description')}</Typography>
                    <Typography mb={2}>{description}</Typography>
                    <Accordion isModule={true} description={modules.description} items={modules.items} />
                    <Accordion isModule={false} description={assignment.description} items={assignment.items} />
                </Box>
            </Container>
        </>
    )
}

function BlurBox() {
    return (
        <div
            style={{
                position: 'absolute',
                bottom:  0,
                width: "100%",
                height: "10.5rem",
                background: "linear-gradient(0deg, #FFF 21.66%, rgba(255, 255, 255, 0.40) 66.91%, rgba(255, 255, 255, 0.00) 100%)"
            }}
        />
    )
}

type ClassDatas = {
    classData: ClassOverview;
    messages: string;
}

export const getServerSideProps: GetServerSideProps<ClassDatas> = async (ctx) => {
    const { locale } = ctx;
    const { name: classname } = ctx.params!;
    const classData = await getClassOverviewData(classname);
    return {
        props: {
            classData: classData[0],
            messages: (await import(`../../locales/${locale}.json`)).default,
        }
    }
}

