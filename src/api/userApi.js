import { getJSON } from './apiClient';

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

export async function getCurrentUser() {
  return await getJSON(`${API_URL}/user`);
}
