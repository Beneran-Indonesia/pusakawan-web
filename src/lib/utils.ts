const createBearerHeader = (token: string) => ({ "Authorization": "Bearer " + token });

const urlToDatabaseFormatted = (url: string) => {
    // some-class-name to some class name
    return url.replaceAll('-', ' ');
}
const databaseToUrlFormatted = (url: string) => {
    // some-class-name to some class name
    return url.replaceAll(' ', '-');
}

const formatNumberToIdr = (amount: number) => new Intl.NumberFormat('id-ID', {}).format(amount);

export {
    createBearerHeader,
    databaseToUrlFormatted,
    urlToDatabaseFormatted,
    formatNumberToIdr
};