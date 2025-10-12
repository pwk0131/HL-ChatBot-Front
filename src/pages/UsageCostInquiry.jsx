// 4. 사용 비용 조회 페이지
// src/pages/UsageCostlnquiry.jsx

import { useState, useEffect } from 'react';
import styles from './styles/UsageCostlnquiry.module.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

//목업 데이터
const totalCostData = 1250.75;
const staticEstimatedCost = { total: 480.0, points: [
  { time: '09-13', value: 30 }, { time: '09-18', value: 45 }, { time: '09-23', value: 40 },
  { time: '09-28', value: 60 }, { time: '10-03', value: 80 }, { time: '10-08', value: 70 },
]};

const mockDetailData = {
  '1D': {
    llmCost: { total: 8.1, points: [
      { time: '00:00', value: 1 }, { time: '02:00', value: 2 }, { time: '04:00', value: 1.5 },
      { time: '06:00', value: 3 }, { time: '08:00', value: 2.5 }, { time: '10:00', value: 4 },
      { time: '12:00', value: 3.5 }, { time: '14:00', value: 2.8 }, { time: '16:00', value: 3.2 },
      { time: '18:00', value: 1.9 }, { time: '20:00', value: 2.5 }, { time: '22:00', value: 2.1 },
    ]},
    serverCost: { total: 5.0, points: [
      { time: '00:00', value: 0.5 }, { time: '02:00', value: 1 }, { time: '04:00', value: 0.8 },
      { time: '06:00', value: 1.2 }, { time: '08:00', value: 1 }, { time: '10:00', value: 1.5 },
      { time: '12:00', value: 1 }, { time: '14:00', value: 0.9 }, { time: '16:00', value: 1.1 },
      { time: '18:00', value: 0.7 }, { time: '20:00', value: 0.8 }, { time: '22:00', value: 0.6 },
    ]},
    dbCost: { total: 2.1, points: [
      { time: '00:00', value: 0.2 }, { time: '02:00', value: 0.3 }, { time: '04:00', value: 0.2 },
      { time: '06:00', value: 0.4 }, { time: '08:00', value: 0.3 }, { time: '10:00', value: 0.5 },
      { time: '12:00', value: 0.4 }, { time: '14:00', value: 0.3 }, { time: '16:00', value: 0.4 },
      { time: '18:00', value: 0.2 }, { time: '20:00', value: 0.3 }, { time: '22:00', value: 0.2 },
    ]},
  },
  '1W': {
    llmCost: { total: 60.2, points: [
      { time: '10-06', value: 5 }, { time: '10-07', value: 8 }, { time: '10-08', value: 7 },
      { time: '10-09', value: 10 }, { time: '10-10', value: 9 }, { time: '10-11', value: 12 }, { time: '10-12', value: 11 },
    ]},
    serverCost: { total: 35.3, points: [
      { time: '10-06', value: 3 }, { time: '10-07', value: 5 }, { time: '10-08', value: 4 },
      { time: '10-09', value: 6 }, { time: '10-10', value: 5 }, { time: '10-11', value: 7 }, { time: '10-12', value: 6.3 },
    ]},
    dbCost: { total: 15.0, points: [
      { time: '10-06', value: 1 }, { time: '10-07', value: 2 }, { time: '10-08', value: 1.5 },
      { time: '10-09', value: 2.5 }, { time: '10-10', value: 2 }, { time: '10-11', value: 3 }, { time: '10-12', value: 2.5 },
    ]},
  },
  '1M': {
    llmCost: { total: 250.1, points: [
      { time: '09-13', value: 30 }, { time: '09-18', value: 80 }, { time: '09-23', value: 70 },
      { time: '09-28', value: 110 }, { time: '10-03', value: 130 }, { time: '10-08', value: 180 }, { time: '10-12', value: 250 },
    ]},
    serverCost: { total: 150.2, points: [
      { time: '09-13', value: 10 }, { time: '09-18', value: 30 }, { time: '09-23', value: 25 },
      { time: '09-28', value: 40 }, { time: '10-03', value: 55 }, { time: '10-08', value: 70 }, { time: '10-12', value: 150 },
    ]},
    dbCost: { total: 50.5, points: [
      { time: '09-13', value: 5 }, { time: '09-18', value: 10 }, { time: '09-23', value: 8 },
      { time: '09-28', value: 15 }, { time: '10-03', value: 20 }, { time: '10-08', value: 30 }, { time: '10-12', value: 50 },
    ]},
  },
};

const TotalCostDisplay = ({ totalCost }) => (
  <div className={styles.totalCostContainer}>
    <h2>총 사용 금액</h2>
    <p>${totalCost.toFixed(2)}</p>
  </div>
);

const ChartComponent = ({ label, value, dataPoints = [] }) => {
  const data = {
    labels: dataPoints.map(p => p.time), // 데이터에서 time을 추출해 레이블로 사용
    datasets: [{
      label: label,
      data: dataPoints.map(p => p.value), // 데이터에서 value를 추출해 값으로 사용
      borderColor: '#e03131',
      backgroundColor: 'rgba(255, 138, 128, 0.4)', fill: true,
      borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
      pointHoverBackgroundColor: '#e03131', pointHoverBorderColor: '#fff',
      tension: 0,
    }],
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true, mode: 'index', intersect: false, callbacks: { label: (context) => `$${context.formattedValue}` } } },
    scales: { x: { display: true, grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 7 } }, y: { display: false } },
  };

  return (
    <div className={styles.graphCard}>
       <p className={styles.graphValue}>${value.toFixed(2)}</p>
       <div className={styles.chartArea}>
         <Line options={options} data={data} />
       </div>
    </div>
  );
};

const UsageCostlnquiry = () => {
  const [timePeriod, setTimePeriod] = useState('1W');
  const [llmData, setLlmData] = useState(mockDetailData['1W'].llmCost);
  const [serverData, setServerData] = useState(mockDetailData['1W'].serverCost);
  const [dbData, setDbData] = useState(mockDetailData['1W'].dbCost);

  useEffect(() => {
    const newData = mockDetailData[timePeriod];
    setLlmData(newData.llmCost);
    setServerData(newData.serverCost);
    setDbData(newData.dbCost);
  }, [timePeriod]);

  return (
    <section className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.pageHeader}>
          <h1>챗봇 사용 비용 조회</h1>
        </header>
        <div className={styles.mainContent}>
          <h2 className={styles.mainSectionTitle}>총 사용 금액</h2>
          <TotalCostDisplay totalCost={totalCostData} />

          <h2 className={styles.mainSectionTitle}>기간별 사용 금액</h2>
          <div className={styles.filterableSection}>
            <div className={styles.filterContainer}>
              <button className={timePeriod === '1D' ? styles.activeButton : styles.filterButton} onClick={() => setTimePeriod('1D')}>1일</button>
              <button className={timePeriod === '1W' ? styles.activeButton : styles.filterButton} onClick={() => setTimePeriod('1W')}>1주</button>
              <button className={timePeriod === '1M' ? styles.activeButton : styles.filterButton} onClick={() => setTimePeriod('1M')}>1달</button>
            </div>
            
            <div className={styles.chartSection}>
              <h3 className={styles.sectionTitle}>LLM 토큰 비용</h3>
              <ChartComponent label="LLM 토큰 비용" value={llmData.total} dataPoints={llmData.points} />
            </div>
            <div className={styles.chartSection}>
              <h3 className={styles.sectionTitle}>서버 사용 비용</h3>
              <ChartComponent label="서버 사용 비용" value={serverData.total} dataPoints={serverData.points} />
            </div>
            <div className={styles.chartSection}>
              <h3 className={styles.sectionTitle}>DB 사용 비용</h3>
              <ChartComponent label="DB 사용 비용" value={dbData.total} dataPoints={dbData.points} />
            </div>
          </div>

          <div className={styles.chartSection}>
            <h2 className={styles.mainSectionTitle}>비용 분석</h2>
            <ChartComponent label="예상 비용" value={staticEstimatedCost.total} dataPoints={staticEstimatedCost.points} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsageCostlnquiry;
