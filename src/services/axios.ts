import { URL_CONFIG } from '@/configs/environment';
import axios from 'axios';

const axiosApi = axios.create({
    baseURL: URL_CONFIG.API.url,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition',
        'Pragma': 'no-cache'
    }
});

export { axios, axiosApi };
