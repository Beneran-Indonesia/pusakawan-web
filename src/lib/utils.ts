const createBearerHeader = (token: string) => ({ "Authorization": "Bearer " + token });

const urlToDatabaseFormatted = (url: string) => {
    // some-class-name to some class name
    return url.replaceAll('-', ' ').toLowerCase();
}
const databaseToUrlFormatted = (url: string) => {
    // some-class-name to some class name
    return url.replaceAll(' ', '-').toLowerCase();
}

const formatNumberToIdr = (amount: number) => new Intl.NumberFormat('id-ID', {}).format(amount);

export {
    createBearerHeader,
    databaseToUrlFormatted,
    urlToDatabaseFormatted,
    formatNumberToIdr
};