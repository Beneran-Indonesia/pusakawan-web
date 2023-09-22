const createBearerHeader = (token: string) => ({ "Authorization": "Bearer " + token });

export {
    createBearerHeader,
};