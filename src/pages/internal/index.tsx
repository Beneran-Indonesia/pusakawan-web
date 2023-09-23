import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Headline from "@/components/Frontpage/Headline";
import Head from "next/head";
import DetailPanel from "@/components/Frontpage/DetailPanel";
import Banner from "@/components/Frontpage/Banner";
import CoursesSection from "@/components/Frontpage/CoursesSection";

export default function InternalIndex() {
    return (
        <>
            <Head><title>Pusakawan</title></Head>
            <Header />
            <Headline />
            <DetailPanel />
            <CoursesSection />
            <Banner />
            <Footer />
        </>
    )
}

export function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
        props: {
            messages: require(`../../locales/${locale}.json`),
        },
    };
}
