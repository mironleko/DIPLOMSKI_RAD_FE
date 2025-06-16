// src/api/caseApi.js

import { getJSON, postJSON,putJSON } from './apiClient';

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

export function fetchSubjects() {
  return getJSON(`${API_URL}/subjects`);
}

export function fetchTopics() {
  return getJSON(`${API_URL}/topics`);
}

export function createCase({ title, subjectId, topicIds }) {
  return postJSON(`${API_URL}/case`, {
    title,
    subjectId,
    topicIds
  });
}

export function fetchCurrentEpisode(caseId) {
  return getJSON(`${API_URL}/case/${caseId}/episode/current`);
}

export function solveEpisode(caseId, episodeNumber, solution) {
  return postJSON(`${API_URL}/case/${caseId}/episodes/${episodeNumber}/solve`, {
    solution
  });
}

export function markCaseCompleted(caseId) {
  return putJSON(`${API_URL}/case/${caseId}/finish`, {});
}
