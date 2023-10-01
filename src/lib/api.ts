// API calls
import axios from 'axios';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

export default axios.create({
    baseURL: "https://api.pusakaapp.id",
    headers
})