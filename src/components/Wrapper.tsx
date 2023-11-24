import { useRouter } from "next/router"
import Header from "./Header";
import Footer from "./Footer";


export default function Wrapper({ children }: { children: React.ReactNode}) {
    const router = useRouter();
    const { pathname } = router;
    if (pathname === '/login' || pathname === '/register' || pathname === '/on-development' || pathname === '/reset-password' ) {
        return children;
    }
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}