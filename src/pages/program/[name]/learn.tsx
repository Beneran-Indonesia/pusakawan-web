import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useRef, useState } from "react"
import { useTranslations } from "next-intl";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { BreadcrumbLinkProps, ModuleData, ProgramData, SimpleModuleData as SimplerModuleData } from "@/types/components";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import { getModuleData, getProgramData } from "@/lib/api";
import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { getSession } from "next-auth/react";
import { urlToDatabaseFormatted } from "@/lib/utils";
import ListSubheader from "@mui/material/ListSubheader";
import Head from "next/head";


export default function ModuleLearn({ moduleData, programData, testData, assignments }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const t = useTranslations("module");
    const router = useRouter();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const testAvailable = testData && testData.length !== 0;
    const [currentModule, setCurrentModule] = useState<SimpleModuleData>(moduleData[0]);
    const [iframeLoading, setIframeLoading] = useState(true);

    const { title: programTitle, banners } = programData;

    const makeIframeFullscreen = () => {
        if (!iframeRef.current) return;
        if (iframeRef.current.requestFullscreen) {
            iframeRef.current.requestFullscreen();
        }
    };

    const breadcrumbData: BreadcrumbLinkProps[] = [
        { href: '/', children: t('breadcrumbs.home'), title: t('breadcrumbs.home') },
        { href: '/program', children: t('breadcrumbs.program'), title: t('breadcrumbs.program') },
        { href: "/program/" + programData.title, children: programData.title, title: programData.title },
        { href: router.pathname, children: t('breadcrumbs.learn'), title: t('breadcrumbs.learn'), active: true },
    ];

    const { title, href, id } = currentModule;

    return (
        <>
            <Head>
                <title>Learn at Pusakawan</title>
            </Head>
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
            <Container sx={{ mt: -11, position: 'relative', mb: 7 }}>
                <Typography variant='h2' component='h2' fontWeight={600}>{programTitle}</Typography>
            </Container>
            <Box
                display="flex"
                height="70vh"
                px={20}
                my={3}
                mb={6}
            >
                <Box flex="20%" bgcolor="white">
                    <List sx={{ maxHeight: 360, overflow: 'auto', borderTop: "1px solid lightgrey", borderBottom: "1px solid lightgrey" }}>
                        {/* pretest */}
                        {
                            testAvailable && <TestListItem pre selected={title === "pretest"} onChange={() => setCurrentModule(moduleData[0])} />
                        }
                        <ListSubheader sx={{ fontSize: "1.2rem", fontWeight: 600, color: "black" }}>{t("learn")}</ListSubheader>
                        {
                            moduleData.map((mdl) =>
                                <ListItem disablePadding key={mdl.title}>
                                    <ListItemButton selected={mdl.id === id} onClick={() => setCurrentModule(mdl)}>
                                        <ListItemText primary={mdl.title} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                        {/* assignment */}
                        {
                            assignments && <>
                                <ListSubheader sx={{ fontSize: "1.2rem", fontWeight: 600, color: "black" }}>{t("assignment")}</ListSubheader>
                                {
                                    assignments.map((assignment) =>
                                        <ListItem disablePadding key={assignment.title}>
                                            <ListItemButton href={assignment.href} target="_blank">
                                                <ListItemText primary={t("assignment") + `: ${assignment.title}`} />
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                }
                            </>
                        }
                        {/* posttest */}
                        {
                            testAvailable && <TestListItem pre={false} selected={title === "posttest"} onChange={() => setCurrentModule(moduleData[moduleData.length])} />
                        }
                    </List>
                </Box>
                <Box flex="80%" position="relative" mx={3} mb={0}>
                    {/* Iframe */}
                    {iframeLoading ? <CircularProgress sx={{ position: "absolute", transform: "translate(50%,-50%)", top: "50%", right: "50%", zIndex: 2 }} /> : null}
                    <iframe
                        onLoad={() => setIframeLoading(false)}
                        ref={iframeRef}
                        src={href}
                        title="Click here"
                        width="100%"
                        height="100%"
                        style={{ position: "relative", border: 0, zIndex: 3 }}
                    ></iframe>
                    {/* Controls */}
                    <Box
                        position="absolute"
                        top="30%"
                        right={-50}
                    >
                        <ButtonGroup
                            role="navigation"
                            orientation="vertical"
                            aria-label="Module controls buttons group"
                            variant="contained"
                            sx={{
                                bgcolor: "secondary.main",
                                py: 1,
                                borderRadius: 999
                            }}
                        >
                            {/* Fullscreen button */}
                            <IconButton onClick={makeIframeFullscreen} sx={{ mb: 5 }} title={t("buttons.fullscreen")}>
                                <FullscreenIcon />
                            </IconButton>
                            {/* Previous button */}
                            <IconButton disabled={id === moduleData[0].id}
                                onClick={() => {
                                    const currentIndex = moduleData.indexOf(currentModule);
                                    const previousIndex = (currentIndex - 1 + moduleData.length) % moduleData.length;
                                    setCurrentModule(moduleData[previousIndex]);
                                }} title={t("buttons.previous")}>
                                <ArrowCircleLeftIcon />
                            </IconButton>
                            {/* Next button */}
                            <IconButton disabled={id === moduleData[moduleData.length - 1].id}
                                onClick={() => {
                                    const currentIndex = moduleData.indexOf(currentModule);
                                    const nextIndex = (currentIndex + 1) % moduleData.length;
                                    setCurrentModule(moduleData[nextIndex]);
                                }} title={t("buttons.next")}>
                                <ArrowCircleRightIcon />
                            </IconButton>
                        </ButtonGroup>
                    </Box>
                </Box>
            </Box>
        </>

    )
}

type TestListItemProps = {
    pre: boolean;
    selected: boolean;
    onChange: () => void;
}

function TestListItem({ pre, selected, onChange }: TestListItemProps) {
    const title = pre ? "Pre-test" : "Post-test"
    return (
        <ListItem disablePadding>
            <ListItemButton selected={selected} onClick={onChange} >
                <ListItemText primaryTypographyProps={{
                    style: {
                        fontSize: "1.2rem", fontWeight: 600
                    }
                }} primary={title} />
            </ListItemButton>
        </ListItem>
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

type SimpleModuleData = ({ id: number } & SimplerModuleData);

type ModuleDatas = {
    messages: string;
    programData: ProgramData;
    moduleData: SimpleModuleData[];
    testData?: SimplerModuleData[];
    assignments: null | SimpleModuleData[];
}

export const getServerSideProps: GetServerSideProps<ModuleDatas> = async (ctx) => {
    const { locale, params } = ctx;
    const classname = urlToDatabaseFormatted(params!.name as string);

    const programDataReq = await getProgramData(classname as string);

    // checks if program exists
    if (!programDataReq || programDataReq.message.length === 0) {
        return ({ notFound: true })
    }

    const session = await getSession(ctx);

    // checks if user is logged in
    if (!session) {
        return ({ notFound: true })
    }

    const { enrolledPrograms } = session.user;

    // checks if user is enrolled in this program
    if (!enrolledPrograms.find((program) => program.title === classname)) {
        return ({ notFound: true })
    }

    // get module and assignments
    const programData = programDataReq!.message[0] as ProgramData;

    const moduleDataReq = await getModuleData(programData.id.toString());

    // should not be possible but just in case :)
    if (!moduleDataReq || moduleDataReq.message.length === 0) {
        return ({ notFound: true });
    }

    const moduleData = moduleDataReq!.message as ModuleData[];

    const formattedModuleData = moduleData.map((mdl) => ({ id: mdl.id, href: process.env.BUCKET_URL + mdl.storyline_path, title: mdl.title }))

    const assignments = moduleData
        .filter((mdl) => mdl.additional_url)
        .map((mdl) => ({ title: mdl.title, id: mdl.id, href: mdl.additional_url }));

    return {
        props: {
            messages: (await import(`../../../locales/${locale}.json`)).default,
            // testData: [{ title: "pretest", href: "/pretest" }, { title: "posttest", href: "/posttest" }],
            moduleData: formattedModuleData,
            programData,
            assignments: assignments.length > 0 ? assignments : null
        }
    }
}
