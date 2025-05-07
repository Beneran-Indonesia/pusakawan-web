// deskripsi, gambar, dan detail lebih lanjut

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import ImageWrapper from "../ImageWrapper";
import DetailPanelPictureDesktop from "@images/detail_panel_desktop.png";
import DetailPanelPictureMobile from "@images/detail_panel_mobile.png";

import CSS from '@/styles/DetailPanel.module.css';
import { useDesktopRatio } from "@/lib/hooks";

export default function DetailPanel() {
    const t = useTranslations('detail_panel');
    const isDesktopRatio = useDesktopRatio();
    return (
        <Box
            sx={{
                backgroundColor: 'primary.main'
            }}
        >
            <Box
                sx={{
                    borderRadius: '1.5rem', borderBottomRightRadius: 0, borderBottomLeftRadius: 0,
                    backgroundColor: 'white'
                }}>
                <Container component="section" sx={{
                    width: isDesktopRatio ? '60rem' : "fit-content", pb: '2rem',
                }}>
                    <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" py={7}>
                        {t('title')}
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        flexDirection={isDesktopRatio ? "row" : "column"}
                    // gap={7}
                    >
                        {
                            isDesktopRatio
                            ? <ImageWrapper src={DetailPanelPictureDesktop} alt="illustration students studying" width={461} height={294} style={{ marginBottom: '2rem' }} />
                            : <ImageWrapper src={DetailPanelPictureMobile} alt="illustration students studying" width={340} height={212} style={{ marginBottom: '2rem' }} />
                        }
                        
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={4}
                            width={isDesktopRatio ? "25rem" : "fit-content"}
                            sx={{
                                '&>ul > li': {
                                    mb: 1
                                }
                            }}
                            ml={isDesktopRatio ? 0 : 4}
                        >
                            <DetailTypography />
                            <DetailTypography first={false} />
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    )
}

function DetailTypography({ first = true }) {
    const detailTranslation = first ? "detail_panel.detail_one" : "detail_panel.detail_two";
    const t = useTranslations(detailTranslation);
    return (
        <ul className={CSS['custom-ul']}>
            <li>
                <Typography variant="h6" component="h6" fontWeight={500}>
                    {t('title')}
                </Typography>
            </li>
            <Typography variant="h6" component="p" fontWeight={400}>
                {t('detail')}
            </Typography>
        </ul>
    )
}