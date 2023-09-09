// API calls
import axios from 'axios';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

import { getCookie } from "./utils";

type LoginUserProps = {
    email: string;
    password: string;
};

type RegisterUserProps = LoginUserProps & {
    fullName: string;
    userName: string;
    phoneNumber: string;
    role: 'Student';
};

const registerUser = ({ fullName, }: RegisterUserProps) => {
    // fetch(API_URL, {})
    return null;
};

const loginUser = async ({ email, password }: LoginUserProps) => {
    // !TBW
    const conn = await axios.post(process.env.API_URL! + "/auth/login/", {
        email, password
    })
    if (conn.status === 200) {
        return conn.data;
    }
    return conn.status;
}

export {
    loginUser,
};