import { CSSProperties } from "react";

function unsplash(id: string) {
    return `https://source.unsplash.com/${id}`;
}
const formControlRoot: CSSProperties = {
    borderRadius: '0.5rem',
    backgroundColor: 'monochrome.main',
    color: 'black'
};

const headlinePictures = [
    unsplash('fdM9euZW2j4'),
];

const bannerPicture = unsplash('ZqsY740eAOo');

const coursesPictures = [
    unsplash('WgGJjGN4_ck'),
    unsplash('joqWSI9u_XM'),
    unsplash('OJF3lYjC6vg'),
]

type FooterInformationObject = {
    [key: string]: {
        href: string;
        value: string;
    }
}
const footerInformation: FooterInformationObject = {
    office: {
        href: "https://maps.app.goo.gl/q5ukmMxaRno5uw7d8",
        value: "Jln. Cimanuk no 49A, Cideng, Kec Gambir Kota Jakarta Pusat"
    },
    phone: {
        href: "https://wa.me/6281385432211",
        value: "+62 813-8543-2211"
    },
}

export {
    formControlRoot,
    headlinePictures,
    footerInformation,
    bannerPicture,
    coursesPictures
};