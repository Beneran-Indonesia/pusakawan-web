import Headline from "@/components/Frontpage/Headline";
import Head from "next/head";
import DetailPanel from "@/components/Frontpage/DetailPanel";
import Banner from "@/components/Frontpage/Banner";
import CoursesSection from "@/components/Frontpage/CoursesSection";

export default function InternalIndex() {
    return (
        <>
            <Head><title>Pusakawan</title></Head>
            <Headline />
            <DetailPanel />
            <CoursesSection />
            <Banner />
        </>
    )
}

export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
      props: {
        messages: (await import(`../locales/${locale}.json`)).default,
      },
    };
  }