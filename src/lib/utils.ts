const formatAuth = (token: string) => {
    return `Bearer ${token}`
}

const createBearerHeader = (token: string) => ({ "Authorization": formatAuth(token) });

const urlToDatabaseFormatted = (url: string) => {
    // some-class-name to some class name
    return url.replaceAll('-', ' ');
}
const databaseToUrlFormatted = (url: string) => {
    // some-class-name to some class name
    return url.replaceAll(' ', '-');
}

const formatNumberToIdr = (amount: number) => new Intl.NumberFormat('id-ID', {}).format(amount);

// Below is all for formatStorylineHrefQuery utilities.
const formatActor = (name: string, email: string) => {
    return {
        mbox: 'mailto:' + email,
        objectType: 'Agent',
        name: name
    };
};

const isEmpty = (value: string | object) => {
    if (value == null) {
        return true;
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    }

    if (typeof value === "string" && value.length === 0) {
        return true;
    }

    return false;
};

const formatTinCanQueryString = (actor: object, endpoint: string, auth: string) => {
    const params = [];

    if (!isEmpty(actor)) {
        params.push('actor=' + encodeURIComponent(JSON.stringify(actor)));
    }
    if (!isEmpty(endpoint)) {
        params.push('endpoint=' + endpoint + "/storyline/xapi/");
    }
    if (!isEmpty(auth)) {
        params.push('auth=' + auth);
    }

    return params.join('&');
}

const formatStorylineHrefQuery = (href: string, user: { name: string, email: string, token: string }) => {
    const actor = formatActor(user.name, user.email);
    const auth = formatAuth(user.token);

    const queryString = formatTinCanQueryString(actor, process.env.NEXT_PUBLIC_API_URL!, auth);

    const formatterQueryString = `${href}?${queryString}`

    return formatterQueryString;
}

export {
    createBearerHeader,
    databaseToUrlFormatted,
    urlToDatabaseFormatted,
    formatNumberToIdr,
    formatStorylineHrefQuery
};