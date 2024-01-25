/* eslint-disable */

import MaintenancePage from '@/components/Maintenance';

function AboutPusakawan() {
    return (
        <MaintenancePage />
       
    );
};

export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
        props: {
            messages: (await import(`../locales/${locale}.json`)).default,
        },
    };
}

export default AboutPusakawan;
