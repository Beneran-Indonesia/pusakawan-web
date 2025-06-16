import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import ImageWrapper from "../ImageWrapper";
import BannerPicture from "@images/banner.png";
import { useDesktopRatio } from "@/lib/hooks";

export default function Banner() {
    const isDesktopRatio = useDesktopRatio();
    return (
        <Box display="flex" alignItems="center" gap={isDesktopRatio ? 5 : 0} pl={isDesktopRatio ? 4: 2} border="1px solid #CCCCCC" borderRadius="1rem" width="fit-content" margin="auto" my={6} position="relative">
            <BannerTypography />
            <BlurBox />
            <ImageWrapper src={BannerPicture} alt="vote flag" width={isDesktopRatio ? 401 : 160} height={isDesktopRatio ? 270 : 184} style={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }} />
        </Box>
    )
}

function BlurBox() {
    const isDesktopRatio = useDesktopRatio();
    return <div style={{ background: "linear-gradient(90deg, #FFF 17.5%, rgba(255, 255, 255, 0.00) 89.5%)", position: 'absolute', left: isDesktopRatio ? '17rem' : "53%", width: isDesktopRatio ? '6.25rem' : "21.65px", height: '100%' }} />
}

function BannerTypography() {
    const isDesktopRatio = useDesktopRatio();
    const t = useTranslations('banner');
    return (
        <Box width={isDesktopRatio ? 230 : 177}>
            <Typography fontWeight={500} variant={isDesktopRatio ? "h4" : "h6"} component={isDesktopRatio ? "h4" : "h6"} mb={2}>{t('title')}</Typography>
            <Button size={isDesktopRatio ? "medium" : "small"} variant="contained" href="/challenge">{t('button')}</Button>
        </Box>
    )
}
