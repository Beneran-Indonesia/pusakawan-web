import { useRouter } from "next/router"
import DesktopHeader from "./DesktopHeader";
import Footer from "./Footer";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useDesktopRatio } from "@/lib/hooks";
import MobileHeader from "./MobileHeader";

export default function Wrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const isDesktopRatio = useDesktopRatio();
    const { pathname } = router;
    if (pathname === '/login' || pathname === '/register' || pathname === '/on-development' || pathname === '/reset-password') {
        return children;
    }
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {
                isDesktopRatio
                ? <DesktopHeader />
                : <MobileHeader />
        }
            {children}
            <Footer />
        </LocalizationProvider>
    )
}