import { ProgramData } from "@/types/components";
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
};

// DATAS

const headlinePictures = [
    unsplash('fdM9euZW2j4'),
];

const bannerPicture = unsplash('ZqsY740eAOo');

const coursesPictures = [
    unsplash('WgGJjGN4_ck'),
    unsplash('joqWSI9u_XM'),
    unsplash('OJF3lYjC6vg'),
];

const footerInformation: FooterInformationObject = {
    office: {
        href: "https://maps.app.goo.gl/q5ukmMxaRno5uw7d8",
        value: "Jln. Cimanuk no 49A, Cideng, Kec Gambir Kota Jakarta Pusat"
    },
    phone: {
        href: "https://wa.me/6281385432211",
        value: "+62 813-8543-2211"
    },
};

const programPagePicture = unsplash('5QgIuuBxKwM');

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
    { id: 0, title: 'Peran Pemerintah Dalam Penyelesain Kasus di Pulau Rempang', img: unsplash('Rfflri94rs8'), status: "FINISHED" as "FINISHED" },
];

const mockClass = {
    s3Url: "https://pusaka-api-bucket-dev.s3.ap-southeast-1.amazonaws.com/media/Understanding+Your+Health+Care+Benefits/index.html",
    title: "Rendahnya daya saing",
    category: "Perekonomian",
    description: "Bagian ini merupakan deskripsi dari program yang dibuat di backoffice, sehingga hasilnya tergantung dari pembuat program itu sendiri."
};

const mockProgramData: ProgramData[] = [
    { id: 0, img: unsplash('M7ievVk4FzA'), title: "Kebijakan Ekspor Impor", paid: true, price: 15000 },
    { id: 1, img: unsplash("I-8e7wx2hao"), title: "Permasalahan Dana Desa", paid: true, price: 25000 },
    { id: 3, img: unsplash("I-8e7wx2hao"), title: "Permasalahan Dana Desa", paid: true, price: 25000 },
    { id: 2, img: unsplash("gMsnXqILjp4"), title: "Rendahnya Daya Saing", paid: false }
]

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
    programPagePicture
};