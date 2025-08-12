import { ProgramData, TestData } from "@/types/components";
import { CSSProperties } from "react";

const formControlRoot: CSSProperties = {
    borderRadius: '0.5rem',
    backgroundColor: 'monochrome.main',
    color: 'black'
};

type FooterInformationObject = {
    [key: string]: {
        href: string;
        value: string;
    }
};

function unsplash(id: string) {
    return `https://source.unsplash.com/${id}`;
}

// DATAS

const headlinePictures = [
    "https://pusaka-api-bucket-dev.s3.ap-southeast-1.amazonaws.com/media/IMG_5527+1.png",
];

const bannerPicture = unsplash('ZqsY740eAOo');

const coursesPictures = [
    unsplash('WgGJjGN4_ck'),
    unsplash('joqWSI9u_XM'),
    unsplash('OJF3lYjC6vg'),
];

const getRandomCoursePicture = () => coursesPictures[Math.random() * 2 | 0];

const footerInformation: FooterInformationObject = {
    office: {
        href: "https://maps.app.goo.gl/q5ukmMxaRno5uw7d8",
        value: "Jalan Cimanuk 49A, Desa/Kelurahan Cideng. Kec. Gambir, Kota Adm. Jakarta Pusat, Provinsi DKI Jakarta, Kode Pos: 10150"
    },
    phone: {
        href: "https://wa.me/6281281091400",
        value: "+62 812-8109-1400"
    },
    email: {
        href: "mailto:pusakawanedukasikreatif@gmail.com",
        value: "pusakawanedukasikreatif@gmail.com"
    },
};

const programPagePicture =  "https://pusaka-api-bucket-dev.s3.ap-southeast-1.amazonaws.com/media/unsplash_r_-zzXrnzxI.png"; // now isnt working unsplash('5QgIuuBxKwM');

// PROFILE

const religions = [
    'Buddha',
    'Hindu',
    'Islam',
    'Katolik',
    'Kristen',
    'Kong Hu Cu',
    'Penghayat Kepercayaan',
    'Lainnya',
];

const grade = [
    '8', '9', '10', '11', '12', 'Gap Year'
]

// MOCK DATA
const mockUserClass = [
    { id: 0, title: 'Peran Pemerintah Dalam Penyelesain Kasus di Pulau Rempang', img: unsplash('Rfflri94rs8'), status: "FINISHED" as const },
];

const mockClass = {
    s3Url: "https://pusaka-api-bucket-dev.s3.ap-southeast-1.amazonaws.com/media/Understanding+Your+Health+Care+Benefits/index.html",
    title: "Rendahnya daya saing",
    pusakaPoints: '',
    description: "Bagian ini merupakan deskripsi dari program yang dibuat di backoffice, sehingga hasilnya tergantung dari pembuat program itu sendiri."
};

const mockProgramData: ProgramData[] = [
    { id: 0, program_id: 0, enrollment_id: 1, banners: [{ image: unsplash('M7ievVk4FzA'), id: 1 }], title: "Kebijakan Ekspor Impor", status: "ACTIVE", description: "", pusaka_points: 100, price: 15000 },
    { id: 1, program_id: 1, enrollment_id: 2, banners: [{ image: unsplash("I-8e7wx2hao"), id: 1 }], title: "Permasalahan Dana Desa", status: "ACTIVE", description: "", pusaka_points: 100, price: 25000 },
    { id: 2, program_id: 2, enrollment_id: 3, banners: [{ image: unsplash('gMsnXqILjp4'), id: 1 }], title: "Rendahnya Daya Saing", status: "ACTIVE", description: "", pusaka_points: 100, price: 0 },
    { id: 3, program_id: 3, enrollment_id: 4, banners: [{ image: unsplash('FvBVVf0ctnk'), id: 1 }], title: "Tantangan Globalisasi", status: "ACTIVE", description: "", pusaka_points: 100, price: 10000 },
    { id: 4, program_id: 4, enrollment_id: 5, banners: [{ image: unsplash('xMh_ww8HN_Q'), id: 1 }], title: "Ketahanan Pangan", status: "ACTIVE", description: "", pusaka_points: 100, price: 0 },
];

const mockStorylineTest: TestData[] = [
    {
        id: 1,
        question: "Perekonomian Indonesia pernah mengalami resesi pada tahun...?",
        choice_a: "1945",
        choice_b: "1998",
        choice_c: "2009",
        choice_d: "2021",
        correct_answer: "B"
    },
    {
        id: 2,
        question: "Sistem ekonomi yang dianut oleh Indonesia adalah....?",
        choice_a: "Komando",
        choice_b: "Tradisional",
        choice_c: "Terpusat",
        choice_d: "Pancasila",
        correct_answer: "D"
    },
    {
        id: 3,
        question: "Indonesia mengalami pertumbuhan ekonomi paling signifikan pada tahun...",
        choice_a: "1980",
        choice_b: "1990",
        choice_c: "2000",
        choice_d: "2014",
        correct_answer: "C"
    },
]

// const mockClassOverviewOne: ModuleData = {
//     id: 9,
//     title: "Rendahnya Daya Saing",
//     img: unsplash("gMsnXqILjp4"),
//     pusakaPoints: 100,
//     posttest: null,
//     pretest: null,
//     description: "Rendahnya daya saing adalah..",
//     assignment: {
//         description: "Ini adalah deskripsi tugas",
//         items: [{
//             href: '/',
//             title: "Tugas 1"
//         }]
//     },
//     modules: {
//         description: "Ini adalah deskripsi modul",
//         items: [{
//             href: '/',
//             title: "Material 1"
//         }]
//     }
// };

// const mockClassOverviewTwo: ModuleData = {
//     id: 10,
//     title: "Permasalahan Dana Desa",
//     price: 25000,
//     img: unsplash("I-8e7wx2hao"),
//     pusakaPoints: 100,
//     posttest: null,
//     pretest: null,
//     description: "Permasalahan dana desa adalah..",
//     assignment: {
//         description: "Ini adalah deskripsi tugas",
//         items: [{
//             href: '/',
//             title: "Tugas 1"
//         }]
//     },
//     modules: {
//         description: "Ini adalah deskripsi modul",
//         items: [{
//             href: '/',
//             title: "Material 1"
//         }]
//     }
// };

// const mockClassOverviews: ModuleData[] = [
//     mockClassOverviewOne, mockClassOverviewTwo
// ]

// const mockModuleData = [{
//     id: 0,
//     title: "First",
//     href: "https://pusaka-api-bucket-dev.s3.ap-southeast-1.amazonaws.com/media/storyline/Klik%20disini/story_html5.html"
// }, {
//     id: 1,
//     title: "Second",
//     href: "https://pusaka-api-bucket-dev.s3.ap-southeast-1.amazonaws.com/media/Understanding+Your+Health+Care+Benefits/index.html"
// }];

export {
    formControlRoot,
    headlinePictures,
    footerInformation,
    bannerPicture,
    coursesPictures,
    mockClass,
    religions,
    grade,
    mockUserClass,
    mockProgramData,
    programPagePicture,
    // mockClassOverviews,
    getRandomCoursePicture,
    mockStorylineTest
};