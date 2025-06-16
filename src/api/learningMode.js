// src/api/learningMode.js
import { postJSON } from './apiClient';

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
  return postJSON('/api/v1/learning-mode', {
    gradeId,
    topicId,
    lessonId,
    difficulty,
    includeSvg: false
  });
}
