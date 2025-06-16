import MaintenancePage from '@/components/Maintenance';

const LeaderboardsPage = () => {
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

export default LeaderboardsPage;
