// halaman depan (home page)

import Headline from "@/components/Frontpage/Headline";
import Head from "next/head";
import DetailPanel from "@/components/Frontpage/DetailPanel";
import Banner from "@/components/Frontpage/Banner";
import CoursesSection from "@/components/Frontpage/CoursesSection";
import { getAllStorylinePrograms } from "@/lib/api";
import { ProgramData } from "@/types/components";

type IndexProps = {
  programs?: ProgramData[];
};

export default function Index({ programs }: IndexProps) {
  return (
    <>
      <Head><title>Pusakawan</title></Head>
      <Headline />
      <DetailPanel />
      <CoursesSection programs={programs} />
      <Banner />
    </>
  )
}

export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
  const programsReq = await getAllStorylinePrograms();
  if (programsReq && programsReq.status === 200) {
    return {
      props: {
        messages: (await import(`../locales/${locale}.json`)).default,
        programs: programsReq.message.slice(0, 3)
      },
      revalidate: 1200
    };
  }
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default,
    },
  };
}