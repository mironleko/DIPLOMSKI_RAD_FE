import { getJSON } from './apiClient';

export async function getCurrentUser() {
  return await getJSON('/api/v1/user');
}
