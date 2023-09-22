import { CSSProperties } from "react";

const formControlRoot: CSSProperties = {
    borderRadius: '0.5rem',
    backgroundColor: 'monochrome.main',
    color: 'black'
};

const headlinePictures = [
    "https://source.unsplash.com/fdM9euZW2j4",
];

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
};