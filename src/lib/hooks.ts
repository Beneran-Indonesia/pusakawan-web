import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function useDesktopRatio() {
    const theme = useTheme();
    const desktopRatio = useMediaQuery(theme.breakpoints.up('md'));
    return desktopRatio;
}

export { useDesktopRatio };