import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import ImageWrapper from "../ImageWrapper";
import DetailPanelPicture from "@images/detail_panel.png";
import CSS from '@/styles/DetailPanel.module.css';

export default function DetailPanel() {
    const t = useTranslations('detail_panel');
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
                    width: '60rem', pb: '2rem',
                }}>
                    <Typography variant="h4" component="h2" fontWeight={600} textAlign="center" py={7}>
                        {t('title')}
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    // gap={7}
                    >
                        <ImageWrapper src={DetailPanelPicture} alt="illustration students studying" width={461} height={294} style={{ marginBottom: '2rem' }} />
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={4}
                            width="25rem"
                            sx={{
                                '&>ul > li': {
                                    mb: 1
                                }
                            }}
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