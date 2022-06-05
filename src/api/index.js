import axios from 'axios'

let instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});

export async function get(url) {
    let response = await instance.get(url);
    return response.data.data;
}

export async function post(url, data) {
    let response = await instance.post(url, data);
    return response.data.data;
}

export async function getEvents() {
    let response = await instance.get('/v1/api/events');
    return response.data.data;
}

export async function deleteEvent(id) {
    let response = await instance.delete(`/v1/api/events/${id}`);
    return response.data.data;
}

export async function updateEvent(id, data) {
    let response = await instance.put(`/v1/api/events/${id}`, data);
    return response.data.data;
}

export async function getUsers() {
    let response = await instance.get('/v1/api/users');
    return response.data.data;
}

export async function createEvent(data) {
    let response = await instance.post('/v1/api/events', data);
    return response.data.data;
}

export async function createUser(data) {
    let response = await instance.post('/v1/api/users', data);
    return response.data.data;
}