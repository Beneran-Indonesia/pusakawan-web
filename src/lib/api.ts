// API calls
import axios from 'axios';
import { Agent } from 'https';
import { createBearerHeader, urlToDatabaseFormatted } from './utils';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    httpsAgent: new Agent({
        rejectUnauthorized: process.env.NEXT_PUBLIC_PRODUCTION === "true"
    }),
    headers
})

export default api;

const getEditProfileFields = async (url: string, sessionToken: string) => {
    const res = await api.get(url, {
        headers: createBearerHeader(sessionToken)
    })
    return { status: res.status, message: res.data };
};

async function getAllStorylinePrograms() {
    try {
        const res = await api.get("/program", {
            params: {
                program_type: "STORYLINE",
                status: "ACTIVE"
            }
        })
        return { status: res.status, message: res.data };
    } catch (e) {
        console.error("GET ALL STORYLINE PROGRAM ERROR:", e)
    }
}

const getModuleData = async (programId: string) => {
    // const res = await mockClassOverviews.filter((dt) => dt.title.toLowerCase() === urlToDatabaseFormatted(name.toLowerCase()));
    try {
        const res = await api.get("/storyline/", {
            params: {
                program: programId,
                status: "ACTIVE",
            }
        })
        return { status: res.status, message: res.data };
    } catch (e) {
        console.error("GET CLASS OVERVIEW DATA ERROR:", e)
    }
}

async function getProgram(id: number) {
    try {
        const res = await api.get("/program/", {
            params: {
                id,
                status: "ACTIVE",
                program_type: "STORYLINE",
            }
        })
        return { status: res.status, message: res.data };
    } catch (e) {
        console.error("GET PROGRAM DATA ERROR:", e)
    }
}

async function getProgramData(classname: string) {
    try {
        const res = await api.get("/program", {
            params: {
                title: urlToDatabaseFormatted(classname),
                status: "ACTIVE",
                program_type: "STORYLINE",
            }
        })
        return { status: res.status, message: res.data };
    } catch (e) {
        console.error("GET PROGRAM DATA ERROR:", e)
    }
}

export { getProgramData, getEditProfileFields, getModuleData, getAllStorylinePrograms, getProgram };
