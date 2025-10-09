// 1. 사용자 질의 데이터 분석 페이지
// src/pages/UserQueryDataAnalysis.jsx

import { useState, useEffect } from 'react';
import { getUserQueryData } from '../services/api';

import global_styles from './PageLayout.module.css'; // 모든 페이지 공통 css
import styles from './styles/UserQueryDataAnalysis.module.css'

const UserQueryDataAnalysis = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {
          startDate: '2025-10-01',
          endDate: '2025-10-09',
        };
        // api.js에서 response.data를 직접 반환하므로, 바로 data 변수에 할당합니다.
        const result = await getUserQueryData(params);
        setData(result);
      } catch (err) {
        setError(err); // API 함수에서 던진 에러를 여기서 잡습니다.
      } finally {
        setLoading(false); // 성공/실패 여부와 관계없이 로딩 상태를 해제합니다.
      }
    };

    fetchData();
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

  // 1. 로딩 중일 때 보여줄 화면
  if (loading) {
    return <div className={styles.loading}>데이터를 불러오는 중입니다...</div>;
  }

  // 2. 에러가 발생했을 때 보여줄 화면
  if (error) {
    return <div className={styles.error}>오류가 발생했습니다: {error.message}</div>;
  }


  return (
    // 1. 외부 컨테이너: 페이지 전체를 감싸고 중앙 정렬을 담당
    <section className={global_styles.pageContainer}>
      
      {/* 2. 내부 컨테이너: 실제 콘텐츠를 담고 최대 너비를 가짐 */}
      <div className={global_styles.contentWrapper}>
        
        {/* 페이지 헤더: 제목과 버튼 등 */}
        <header className={styles.pageHeader}>
          <h1>사용자 질의 데이터 분석</h1>
          <button>리포트 다운로드</button>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <div className={global_styles.mainContent}>
          {/* 여기에 차트, 테이블 등 데이터 관련 컴포넌트가 들어감. */}
          <div className={global_styles.placeholder}>
            {data ? (
            <div className={styles.placeholder}>
              <p>총 질의 수: {data.totalQueries}</p>
              {/* 여기에 차트나 테이블 컴포넌트가 들어옵니다. */}
            </div>
          ) : (
            <div>데이터가 없습니다.</div>
          )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default UserQueryDataAnalysis;