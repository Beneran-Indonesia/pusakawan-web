// import { mockStorylineTest } from "@/lib/constants";
// import { urlToDatabaseFormatted } from "@/lib/utils";
// import { TestData } from "@/types/components";
// import { GetServerSideProps } from "next/types";




// type PretestDatas = {
//     messages: string;
//     testData: TestData[];
//     classname: string;
// }

// export const getServerSideProps: GetServerSideProps<PretestDatas> = async (ctx) => {
//     const { locale, params } = ctx;
//     const classname = urlToDatabaseFormatted(params!.name as string);

//     return {
//         props: {
//             messages: (await import(`../../../locales/${locale}.json`)).default,
//             testData: mockStorylineTest,
//             classname
//         }
//     }
// }
