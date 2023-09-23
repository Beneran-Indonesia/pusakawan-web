import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import ImageWrapper from "../ImageWrapper";
import BannerPicture from "@images/banner.png";

export default function Banner() {
    return (
        <Box display="flex" alignItems="center" gap={5} pl={4} border="1px solid #CCCCCC" borderRadius="1rem" width="fit-content" margin="auto" my={6} position="relative">
            <BannerTypography />
            <BlurBox />
            <ImageWrapper src={BannerPicture} alt="vote flag" width={401} height={270} style={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }} />
        </Box>
    )
}

function BlurBox() {
    return <div style={{ background: "linear-gradient(90deg, #FFF 17.5%, rgba(255, 255, 255, 0.00) 89.5%)", position: 'absolute', left: '17rem', width: '6.25rem', height: '100%' }} />
}

function BannerTypography() {
    const t = useTranslations('banner');
    return (
        <Box width={230}>
            <Typography fontWeight={500} variant="h4" component="h4" mb={2}>{t('title')}</Typography>
            <Button size="medium" variant="contained">{t('button')}</Button>
        </Box>
    )
}
