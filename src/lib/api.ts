// API calls
import axios from 'axios';
import { createBearerHeader } from './utils';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

const api = axios.create({
    baseURL: "https://api.pusakaapp.id",
    headers
})

export default api;

const getEditProfileFields = (url: string, sessionToken: string) => async () => {
    const res = await api.get(url, {
        headers: createBearerHeader(sessionToken)
    })
    return { status: res.status, message: res.data };
};

export { getEditProfileFields };