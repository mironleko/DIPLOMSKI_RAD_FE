// src/api/statsApi.js

import { getJSON } from './apiClient';

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

/**
 * Dohvati statistiku zadataka za trenutno prijavljenog korisnika.
 *
 * GET /api/v1/user/stats/tasks
 *
 * @returns {Promise<{
 *   totalDone: number,
 *   totalSolved: number,
 *   totalSolutionViewed: number,
 *   totalReported: number,
 *   reportStatusOpen: number,
 *   reportStatusInvalid: number,
 *   reportStatusReviewed: number
 * }>}

 */
export function getUserTaskStats() {
  return getJSON(`${API_URL}/user/stats/tasks`);
}

/**
 * Dohvati statistiku zadataka za sve korisnike (za TEACHER role).
 * GET /api/v1/stats/tasks
 */
export function getAllTaskStats() {
  return getJSON(`${API_URL}/stats/tasks`);
}
