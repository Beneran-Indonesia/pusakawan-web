import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import ImageWrapper from "./ImageWrapper";
import { headlinePictures } from "@/lib/constants";
import Circle from "@svgs/circle.svg";

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
            // TODO: fix this color
            style={{ position: 'absolute', top, bottom, left, right, stroke: color }} />
    )
}

export default function Headline() {
    const t = useTranslations('headline');
    return (
        <div style={{ position: 'relative', zIndex: -2, overflow: 'hidden' }}>
            <Grid
                container
                component="main"
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="primary.main"
                height="30rem"
            >
                <CircleBackground left="-93px" bottom="-110px" />
                <CircleBackground top="-100px" right="-200px" color="#BE454E" />
                <Container sx={{ display: 'flex', gap: 12, color: 'monochrome.main', alignItems: 'center', width: 'fit-content', }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: 428 }}>
                        <Typography component="h1" variant="h3" fontWeight={600}>
                            {t('title')}
                        </Typography>
                        <Typography component="p" variant="h5">
                            {t('subtitle')}
                        </Typography>
                        <Button color="monochrome" size="small" variant="contained" sx={{ width: 'fit-content', color: 'black' }}>
                            {t('button')}
                        </Button>
                    </Box>
                    <ImageWrapper src={headlinePictures[0]} alt="Pemilu" width={490} height={306} style={{ objectFit: 'cover' }} />
                </Container>
            </Grid>
        </div>
    )
}