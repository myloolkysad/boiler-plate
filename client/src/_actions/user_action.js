import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER
} from './types';

export function loginUser(dataTosubmit) {
    const request = axios.post('/api/users/login', dataTosubmit) //url로 Request 요청.
        .then(response => {
            return response.data
        });

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataTosubmit) {
    const request = axios.post('/api/users/register', dataTosubmit) //url로 Request 요청.
        .then(response => {
            return response.data
        });

    return {
        type: REGISTER_USER,
        payload: request
    }
}