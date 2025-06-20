import { getJSON, postJSON } from './apiClient';

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

/**
 * Pretražuje završene Math Detective slučajeve korisnika s opcionalnim filtrima i paginacijom.
 *
 * @param {Object} params - Parametri pretrage.
 * @param {number} [params.subjectId] - ID predmeta (opcionalno).
 * @param {number} [params.minScore] - Minimalan broj bodova (opcionalno).
 * @param {number} [params.maxScore] - Maksimalan broj bodova (opcionalno).
 * @param {number} [params.page=0] - Broj stranice za paginaciju (početak od 0).
 * @param {number} [params.size=10] - Broj rezultata po stranici.
 * @returns {Promise<CaseHistoryPageDto>} - Objekt s listom slučajeva i metapodacima o paginaciji.
 */
export function searchUserCaseHistories({ subjectId, minScore, maxScore, page = 0, size = 10 }) {
  const body = { subjectId, minScore, maxScore };
  return postJSON(`${API_URL}/user/case-history/search?page=${page}&size=${size}`, body);
}

/**
 * Fetch detailed information for a specific completed case.
 * @param {number} caseHistoryId
 * @returns {Promise<UserCaseHistoryDetailsDto>}
 */
export async function getUserCaseHistoryDetails(caseHistoryId) {
  return await getJSON(`${API_URL}/user-case-history/${caseHistoryId}`);
}
