// src/api/statsApi.js

import { getJSON } from './apiClient';

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
  return getJSON('/api/v1/user/stats/tasks');
}

/**
 * Dohvati statistiku zadataka za sve korisnike (za TEACHER role).
 * GET /api/v1/stats/tasks
 */
export function getAllTaskStats() {
  return getJSON('/api/v1/stats/tasks');
}