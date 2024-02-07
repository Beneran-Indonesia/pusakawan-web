import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useRef, useState } from "react"
import { useTranslations } from "next-intl";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { BreadcrumbLinkProps, ProgramData, SimpleModuleData } from "@/types/components";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import { getProgramData } from "@/lib/api";
import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export default function ModuleLearn({ moduleData, programData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const t = useTranslations("module");
    const router = useRouter();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [currentModule, setCurrentModule] = useState<ModuleData>(moduleData[0]);

    const buttonDisabled = true;

    const { title, banners } = programData;

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
            <Container sx={{ mt: -11, position: 'relative', mb: 7 }}>
                <Typography variant='h2' component='h2' fontWeight={600}>{title}</Typography>
            </Container>
            <Box
                display="flex"
                height="70vh"
                px={20}
                my={3}
            >
                <Box flex="20%" bgcolor="white">
                    <List sx={{ maxHeight: 360, overflow: 'auto', borderTop: "1px solid lightgrey", borderBottom: "1px solid lightgrey" }}>
                        {
                            moduleData.map((mdl) =>
                                <ListItem disablePadding key={mdl.title}>
                                    <ListItemButton selected={mdl.id === currentModule.id} onClick={() => setCurrentModule(mdl)}>
                                        <ListItemText primary={mdl.title} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                    </List>
                </Box>
                <Box flex="80%" position="relative" mx={3}>
                    {/* Iframe */}
                    <iframe
                        ref={iframeRef}
                        src={currentModule.href}
                        title="Click here"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
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
                            <IconButton disabled={currentModule.id === moduleData[0].id}
                                onClick={() => {
                                    const currentIndex = moduleData.indexOf(currentModule);
                                    const previousIndex = (currentIndex - 1 + moduleData.length) % moduleData.length;
                                    setCurrentModule(moduleData[previousIndex]);
                                }} title={t("buttons.previous")}>
                                <ArrowCircleLeftIcon />
                            </IconButton>
                            {/* Next button */}
                            <IconButton disabled={currentModule.id === moduleData[moduleData.length - 1].id}
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

type ModuleData = ({ id: number } & SimpleModuleData);

type ModuleDatas = {
    messages: string;
    programData: ProgramData;
    moduleData: ModuleData[];
}

export const getServerSideProps: GetServerSideProps<ModuleDatas> = async (ctx) => {
    const { locale, params } = ctx;
    const classname = params!.name as string;

    const programDataReq = await getProgramData(classname as string);

    const mockModuleData = [{
        id: 0,
        title: "First",
        href: "https://pusaka-api-bucket-dev.s3.ap-southeast-1.amazonaws.com/media/storyline/Klik%20disini/story_html5.html"
    }, {
        id: 1,
        title: "Second",
        href: "https://pusaka-api-bucket-dev.s3.ap-southeast-1.amazonaws.com/media/Understanding+Your+Health+Care+Benefits/index.html"
    }];

    return {
        props: {
            messages: (await import(`../../../locales/${locale}.json`)).default,
            moduleData: mockModuleData,
            programData: programDataReq!.message[0] as ProgramData
        }
    }
}
