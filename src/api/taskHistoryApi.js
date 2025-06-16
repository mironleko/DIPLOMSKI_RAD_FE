import { postJSON, getJSON } from './apiClient';

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

/**
 * Records a user's answer attempt.
 * @param {number} historyId
 * @param {string} answer
 * @returns {Promise<{ isCorrect: boolean, attemptsUsed: number, solved: boolean }>}
 */
export async function recordAttempt(historyId, answer) {
  return await postJSON(`${API_URL}/task-history/${historyId}/attempt`, {
    answer,
  });
}

/**
 * Logs that user viewed a hint.
 * @param {number} historyId
 * @returns {Promise<{ message: string }>}
 */
export async function recordHint(historyId) {
  return await postJSON(`${API_URL}/task-history/${historyId}/hint`);
}

/**
 * Logs that user viewed the solution.
 * @param {number} historyId
 * @returns {Promise<{ message: string }>}
 */
export async function recordSolution(historyId) {
  return await postJSON(`${API_URL}/task-history/${historyId}/solution`);
}

/**
 * Fetch all task history entries for the logged-in user.
 * @returns {Promise<Array<UserTaskHistoryDto>>}
 */
export async function getUserTaskHistory() {
  return await getJSON(`${API_URL}/user-task-history`);
}

/**
 * Fetch full details for a specific task history entry.
 * @param {number} historyId
 * @returns {Promise<UserTaskHistoryDto>}
 */
export async function getTaskHistoryById(historyId) {
  return await getJSON(`${API_URL}/user-task-history/${historyId}`);
}

/**
 * Fetch all grades.
 * @returns {Promise<Array<{ gradeId: number, name: string }>>}
 */
export async function getGrades() {
  return await getJSON(`${API_URL}/grades`);
}

/**
 * Fetch topics by grade.
 * @param {number|string} gradeId
 * @returns {Promise<Array<{ topicId: number, name: string }>>}
 */
export async function getTopicsByGrade(gradeId) {
  return await getJSON(`${API_URL}/grade/${gradeId}/topics`);
}

/**
 * Fetch lessons by grade and topic.
 * @param {number|string} gradeId
 * @param {number|string} topicId
 * @returns {Promise<Array<{ lessonId: number, name: string }>>}
 */
export async function getLessonsByGradeAndTopic(gradeId, topicId) {
  return await getJSON(`${API_URL}/grade/${gradeId}/topic/${topicId}/lessons`);
}

/**
 * Search user task history with filters.
 * @param {Object} filters - TaskHistorySearchRequestDto body
 * @param {number} page - current page number (0-based)
 * @param {number} size - page size
 * @returns {Promise<TaskHistoryPageDto>}
 */
export async function searchUserTaskHistory(filters, page, size) {
  const query = `?page=${page}&size=${size}`;
  return await postJSON(`${API_URL}/user/task-history/search${query}`, filters);
}
