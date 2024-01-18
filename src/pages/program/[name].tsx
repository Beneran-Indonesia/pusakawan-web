import Accordion from "@/components/Accordion/Accordion";
import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import ImageWrapper from "@/components/ImageWrapper";
import api, { getModuleData, getProgramData } from "@/lib/api";
import { createBearerHeader, formatNumberToIdr } from "@/lib/utils";
import { BreadcrumbLinkProps, ModuleData, ProgramData } from "@/types/components";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Logo from "@svgs/logo.svg"
import { getRandomCoursePicture } from "@/lib/constants";



export default function MockClass({ classname, programData, moduleData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data: session, status } = useSession();
    const t = useTranslations('class.overview');
    const router = useRouter();
    const userIsEnrolled = status === "authenticated" && session.user.enrolledPrograms.some((program) => program.id === programData.id);
    const user = { id: session?.user.id, accessToken: session?.user.accessToken };
    const breadcrumbData: BreadcrumbLinkProps[] = [
        { href: '/', children: t('breadcrumbs.home'), title: t('breadcrumbs.home') },
        { href: '/program', children: t('breadcrumbs.program'), title: t('breadcrumbs.program') },
        { href: router.pathname, children: programData.title, title: programData.title, active: true },
    ];

    const { title, description, banners, pusaka_points: pusakaPoints, price } = programData;
    // storyline path is the folder to the storyline in s3.

    // works but doesn't refresh user session
    async function enrollUser(userId: number, programId: number, sessionToken: string) {
        console.log(userId, programId, sessionToken);
        try {
            const res = await api.post(process.env.NEXT_PUBLIC_API_URL + "/program/enrollment/", {
                program: programId,
                participant: userId,
            }, { headers: createBearerHeader(sessionToken) });
            console.log(res);
            return { status: res.status, message: res.data };
        } catch (e) {
            console.log("ENROLL USER ERROR:", e)
        }
    }

    return (
        <>
            <Box sx={{
                pt: 4,
                background: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${banners[0].image})`,
                backgroundRepeat: "no-repeat", backgroundSize: 'cover', backgroundPosition: '0 45%',
                height: 345, position: 'relative'
            }} >
                <Container>
                    <BreadcrumbsWrapper breadcrumbData={breadcrumbData} />
                </Container>
                <BlurBox />
            </Box>

            <Container sx={{ mt: -6, position: 'relative', mb: 10 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Typography variant='h2' component='h2' fontWeight={600}>{title}</Typography>
                    <Box display="flex">
                        <Box>
                            {
                                userIsEnrolled
                                    ? null
                                    : <Button variant="contained" size="medium" sx={{ textAlign: 'center', mr: 4 }}
                                        disabled={status === "unauthenticated"}
                                        onClick={() => enrollUser(user.id as number, programData.id, user.accessToken as string)}
                                    >
                                        {
                                            price
                                                ? <>
                                                    {t('button.paid')}
                                                    <Typography ml={1} variant="h4" component="span">
                                                        Rp. {formatNumberToIdr(price!)}
                                                    </Typography>
                                                </>
                                                : t('button.free')
                                        }
                                    </Button>
                            }
                            {
                                status === "unauthenticated"
                                    ? <Typography variant="h6" color="primary.main" mt={0.5}>
                                        Anda belum masuk.
                                    </Typography>
                                    : null
                            }
                        </Box>
                        <Box display="flex" boxShadow={1} height="40px" width="170px" px={1.5} py={1} borderRadius={2} gap={1.5} alignItems="center">
                            <ImageWrapper src={Logo} width={15} height={21} alt="pusakawan logo" />
                            <Typography fontWeight={500}>
                                {pusakaPoints}{" "}
                                {t('points')}
                            </Typography>
                            <HelpOutlineIcon width={18} sx={{ ml: 'auto' }} />
                        </Box>
                    </Box>
                    <Typography variant="h5" component="h5" fontWeight={600}>{t('description')}</Typography>
                    <Typography mb={2}>{description}</Typography>
                    {/* Apparently no description.. */}
                    <Accordion isModule={true} description={undefined} items={moduleData} />
                    {/* <Accordion isModule={false} description={undefined} items={assignment?.items} /> */}
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
                bottom: 0,
                width: "100%",
                height: "10.5rem",
                background: "linear-gradient(0deg, #FFF 21.66%, rgba(255, 255, 255, 0.40) 66.91%, rgba(255, 255, 255, 0.00) 100%)"
            }}
        />
    )
}

type FormattedModule = {
    // title: string[];
    // href: string[];
    title: string;
    href: string;
}

type ClassDatas = {
    classname: string;
    programData: ProgramData;
    moduleData: FormattedModule[];
    messages: string;
}

export const getServerSideProps: GetServerSideProps<ClassDatas> = async (ctx) => {
    const { locale } = ctx;
    const { name: classname } = ctx.params!;
    const programDataReq = await getProgramData(classname as string);

    if (!programDataReq || programDataReq.message.length === 0) {
        return { notFound: true };
    }

    let programData = programDataReq.message[0] as ProgramData;
    const programId = programData.id;
    console.log(programDataReq, classname, "GETSERVERSIDEPROPS")

    if (programData.banners.length === 0) {
        const defaultBanner = [{ id: 1, image: getRandomCoursePicture() }];
        programData = { ...programData, banners: defaultBanner };
    }
    const moduleData = await getModuleData(programId.toString());
    if (moduleData) {
        // const modules = {
        //     title: moduleData.message.map((mdl: ModuleData) => mdl.title),
        //     href: moduleData.message.map((mdl: ModuleData) => process.env.BUCKET_URL + mdl.storyline_path)
        //   };

        const modules = moduleData.message.map((mdl: ModuleData) => ({ title: mdl.title, href: process.env.BUCKET_URL + mdl.storyline_path }))
        return {
            props: {
                classname,
                programData,
                moduleData: modules,
                messages: (await import(`../../locales/${locale}.json`)).default,
            }
        }
    }
    return { props: { messages: (await import(`../../locales/${locale}.json`)).default, } }

}
