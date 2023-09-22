import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Headline from "@/components/Headline";
import Head from "next/head";

export default function InternalIndex() {
    return (
        <>
            <Head><title>Pusakawan</title></Head>
            <Header />
            <Headline />
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
