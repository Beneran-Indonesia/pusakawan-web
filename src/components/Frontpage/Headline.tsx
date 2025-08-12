// menampilkan bagian utama dari halaman depan

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import ImageWrapper from "../ImageWrapper";
import { headlinePictures } from "@/lib/constants";
import Circle from "@svgs/circle.svg";
import { useDesktopRatio } from "@/lib/hooks";

type LeftRightPx = `${number}px` | `-${number}px`;
type CircleBackgroundProps = {
    top?: LeftRightPx,
    bottom?: LeftRightPx,
    left?: LeftRightPx,
    right?: LeftRightPx,
    color?: string;
};

function CircleBackground({ top, bottom, left, right, color }: CircleBackgroundProps) {
    return (
        <ImageWrapper
            src={Circle}
            alt="circle background"
            width={366}
            height={266}
            style={{ position: 'absolute', top, bottom, left, right, color }} />
    )
}

export default function Headline() {
    const t = useTranslations('headline');
    const isDesktopRatio = useDesktopRatio();
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <CircleBackground left="-93px" bottom="-110px" />
            <CircleBackground top="-100px" right="-200px" />
            <Grid
                container
                component="main"
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="primary.main"
                height="30rem"
                // position="absolute"
                zIndex={2}
            >
                <Container sx={{
                    display: 'flex', gap: 12,
                    color: 'monochrome.main', alignItems: 'center', width: 'fit-content',
                    // zIndex: 1, position: 'fixed'
                    zIndex: 3
                }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        width: isDesktopRatio ? 428 : "fit-content",
                        alignItems: isDesktopRatio ? "left" : "center",
                        textAlign: isDesktopRatio ? "left" : "center",
                    }}>
                        <Typography component="h1" variant="h3" fontWeight={600}>
                            {t('title')}
                        </Typography>
                        <Typography component="p" variant="h5">
                            {t('subtitle')}
                        </Typography>
                        <Button href="/program" color="monochrome" size="small" variant="contained" sx={{ width: 'fit-content', color: 'black'}}>
                            {t('button')}
                        </Button>
                    </Box>
                    <ImageWrapper src={headlinePictures[0]} alt="Pemilu" width={490} height={306} style={{ objectFit: 'cover', display: isDesktopRatio ? "block" : "none" }} />
                </Container>
            </Grid>
        </div>
    )
}