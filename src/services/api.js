// src/services/api.js

import axios from 'axios';

/**
 * 사용자 질의 데이터를 가져오는 API 함수
 * @param {object} params - 쿼리 스트링으로 보낼 파라미터 객체
 * @param {string} params.startDate - 조회 시작일 (예: '2025-10-01')
 * @param {string} params.endDate - 조회 종료일 (예: '2025-10-09')
 * @returns {Promise<object>} API 응답 데이터 (response.data)
 */

export const getUserQueryData = async (params) => {
  try {
    // GET /user-query-data 엔드포인트로 쿼리 스트링과 함께 요청을 보냅니다.
    const response = await axios.get('/user-query-data', { params });
    return response.data; // 실제 데이터는 response.data 안에 들어있습니다.
  } catch (error) {
    // API 요청 실패 시 에러를 콘솔에 출력하고, 에러를 다시 던져서
    // 호출한 쪽(컴포넌트)에서 에러 처리를 할 수 있도록 합니다.
    console.error("API Error fetching user query data:", error);
    throw error;
  }
};