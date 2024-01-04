// API calls
import axios from 'axios';
import { createBearerHeader, urlToDatabaseFormatted } from './utils';
import { mockClassOverviews } from './constants';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

const api = axios.create({
    baseURL: process.env.API_URL,
    headers
})

export default api;

const getEditProfileFields = async (url: string, sessionToken: string) => {
    const res = await api.get(url, {
        headers: createBearerHeader(sessionToken)
    })
    return { status: res.status, message: res.data };
};

const getClassOverviewData = async (name: string) => {
    const res = await mockClassOverviews.filter((dt) => dt.title.toLowerCase() === urlToDatabaseFormatted(name.toLowerCase()));
    return res;
    // const res = await api.get('/class/name')
    // return { status: res.status, message: res.data };
}

export { getEditProfileFields, getClassOverviewData };