// src/api/caseApi.js

import { getJSON, postJSON,putJSON } from './apiClient';

const BASE = '/api/v1';

export function fetchSubjects() {
  return getJSON(`${BASE}/subjects`);
}

export function fetchTopics() {
  return getJSON(`${BASE}/topics`);
}

export function createCase({ title, subjectId, topicIds }) {
  return postJSON(`${BASE}/case`, {
    title,
    subjectId,
    topicIds
  });
}

export function fetchCurrentEpisode(caseId) {
  return getJSON(`${BASE}/case/${caseId}/episode/current`);
}

export function solveEpisode(caseId, episodeNumber, solution) {
  return postJSON(`${BASE}/case/${caseId}/episodes/${episodeNumber}/solve`, {
    solution
  });
}

export function markCaseCompleted(caseId) {
  return putJSON(`${BASE}/case/${caseId}/finish`, {});
}