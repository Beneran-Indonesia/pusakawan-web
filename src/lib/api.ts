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
        const res = await api.get("/program/storyline", {
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

async function getPricingData(classname: string, email: string) {
    const pricing = {
        main_price : 200_000,
        unique_code: 385,
        additional_fee: 15_000,
        total_price: 215.385
    }
    return {
        status: 200,
        message: 
            {
                program_id: 1,
                program_name: classname,
                ...pricing
            }
        
    }
    try {
        const res = await api.post("/program/pricing/", {
            params: {
                title: urlToDatabaseFormatted(classname),
                status: "ACTIVE",
                program_type: "STORYLINE",
                email
            }
        })
        return { status: res.status, message: res.data };
    } catch (e) {
        console.error("GET PAYMENT DATA ERROR:", e)
    }
}

export { getProgramData, getEditProfileFields, getModuleData, getAllStorylinePrograms, getProgram, getPricingData };
