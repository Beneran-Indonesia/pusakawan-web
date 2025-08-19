// API calls
import axios from 'axios';
import { Agent } from 'https';
import { createBearerHeader, urlToDatabaseFormatted } from './utils';
import { TestAnswer } from "@/types/components";

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
        const res = await api.get("/program/storyline/", {
        })
        return { status: res.status, message: res.data };
    } catch (e) {
        console.error("GET ALL STORYLINE PROGRAM ERROR:", e)
    }
}

const getModuleData = async (programId: number) => {
    // const res = await mockClassOverviews.filter((dt) => dt.title.toLowerCase() === urlToDatabaseFormatted(name.toLowerCase()));
    try {
        const res = await api.get("/storyline/", {
            params: {
                program: programId,
            }
        })
        return { status: res.status, message: res.data };
    } catch (e) {
        console.error("GET CLASS OVERVIEW DATA ERROR:", e)
    }
}

async function getProgramData(classname: string) {
    try {
        const res = await api.get("/program/storyline/", {
            params: {
                title: urlToDatabaseFormatted(classname),
            }
        })
        return { status: res.status, message: res.data };
    } catch (e) {
        console.error("GET PROGRAM DATA ERROR:", e)
    }
}

// submit post-test
const submitTest = async (enrollment: number, test: number, answers: TestAnswer[], sessionToken: string) => {
    try {
        const res = await api.post("/storyline/test-submit/", {
            enrollment,
            test,
            answers,
        }, {
            headers: createBearerHeader(sessionToken)
        });

        return { status: res.status, data: res.data };
    } catch (e) {
        console.error("SUBMIT TEST ERROR:", e);
        throw e;
    }
};

// create certificate
const createCertificate = async (enrollmentId: number, sessionToken: string) => {
    try {
        const res = await api.post('/program/certificates/create/', {
            enrollment_id: enrollmentId
        }, {
            headers: createBearerHeader(sessionToken)
        });

        return { status: res.status, data: res.data };
    } catch (e) {
        console.error("Failed to create certificate:", e);
        throw e;
    }
};

export {
    getProgramData,
    getEditProfileFields,
    getModuleData,
    getAllStorylinePrograms,
    submitTest,
    createCertificate
};
