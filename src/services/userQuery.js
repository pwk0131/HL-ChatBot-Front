// src/services/userQuery.js

import apiClient from './apiClient';

/**
 * 사용자 질의 데이터를 가져오는 API 함수
 * @param {object} params - { page, cnt, sort, search, category }
 * @param {string} params.category - 검색할 카테고리 ('all', 'question', 'answer', 'decision')
 * @param {string} params.search - 검색어
 */

export const getUserQueryData = async (params) => {
  const USE_MOCK_DATA = true;

  if (USE_MOCK_DATA) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getMockDataByPage(params.page, params.cnt));
      }, 500);
    });
  }

  // ----------------------------------------------------
  // 나중에 백엔드가 완성되면 USE_MOCK_DATA를 false로 바꾸거나
  // 아래 코드만 남기고 위 if문을 삭제하면 됩니다.
  // ----------------------------------------------------

  try {
    // 예시: /user-query-data?page=1&cnt=20&sort=asc&search=날씨
    const response = await apiClient.get('/user-query-data', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching user query data:", error);
    throw error;
  }
};