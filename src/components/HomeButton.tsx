import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { SxProps, Theme } from '@mui/material';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type HomeButtonProps = {
    sx?: SxProps<Theme>
};

export default function HomeButton({ sx }: HomeButtonProps) {
    const t = useTranslations("home_button");
    return (
        <Link href='/' title={t('title')}>
            <Box display="inline-flex" gap={1.5} alignItems="center" color="primary.main" sx={sx} component="span">
                <ChevronLeftIcon />
                <Typography textTransform="uppercase" fontWeight={500} component="h4" variant='h4'>{t('value')}</Typography>
            </Box>
        </Link>
    )
}