// src/api/learningMode.js
import { postJSON } from './apiClient';

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

/**
 * Poziva Learning Mode endpoint s navedenim parametrima.
 * @param {Object} params
 * @param {number} params.gradeId
 * @param {number} params.topicId
 * @param {number} params.lessonId
 * @param {string} params.difficulty – "EASY" | "MEDIUM" | "HARD"
 * @returns {Promise<Object>}
 */
export function fetchLearningMode({ gradeId, topicId, lessonId, difficulty }) {
  return postJSON(`${API_URL}/learning-mode`, {
    gradeId,
    topicId,
    lessonId,
    difficulty,
    includeSvg: false
  });
}
