// src/pages/UsageCostlnquiry.jsx

import { useState, useEffect } from 'react';
import styles from './styles/UsageCostlnquiry.module.css';

import { getCosts } from '../services/cost';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend
);

// --- 정적 목업 데이터 ---
const totalCostData = 1250.75;
const staticEstimatedCost = { total: 480.0, points: [
  { time: '09-13', value: 30 }, { time: '09-18', value: 45 }, { time: '09-23', value: 40 },
  { time: '09-28', value: 60 }, { time: '10-03', value: 80 }, { time: '10-08', value: 70 },
]};


// --- 컴포넌트 ---
const TotalCostDisplay = ({ totalCost }) => (
  <div className={styles.totalCostContainer}>
    <h2>총 사용 금액</h2>
    <p>${totalCost.toFixed(2)}</p>
  </div>
);

const ChartComponent = ({ label, total, dataPoints = [], color, loading }) => {
  const data = {
    labels: dataPoints.map(p => p.time),
    datasets: [{
      label: label,
      data: dataPoints.map(p => p.value),
      borderColor: color,
      backgroundColor: `${color}40`,
      fill: true,
      borderWidth: 1.5,
      pointRadius: 2,
      pointHoverRadius: 5,
      tension: 0.1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': $';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 7 }
      },
      y: { 
        ticks: { 
            beginAtZero: true,
            callback: function(value) {
                return '$' + value.toLocaleString();
            }
        } 
      },
    },
  };

  return (
    <div className={styles.graphCard}>
      {loading ? (
        <p className={styles.loadingText}>데이터 로딩 중...</p>
      ) : (
        <>
          <p className={styles.graphValue}>${total.toLocaleString()}</p>
          <div className={styles.chartArea}>
            <Line options={options} data={data} />
          </div>
        </>
      )}
    </div>
  );
};

const UsageCostlnquiry = () => {
  const [timePeriod, setTimePeriod] = useState('week');
  const [llmData, setLlmData] = useState({ total: 0, points: [] });
  const [serverData, setServerData] = useState({ total: 0, points: [] });
  const [dbData, setDbData] = useState({ total: 0, points: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allCosts = await getCosts({ period: timePeriod });
        setLlmData(allCosts.llm);
        setServerData(allCosts.server);
        setDbData(allCosts.db);
      } catch (error) {
        console.error("비용 데이터를 가져오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timePeriod]);

  const filterButtons = [
    { label: '1일', value: 'day' },
    { label: '1주', value: 'week' },
    { label: '1개월', value: 'month' },
  ];

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
              {filterButtons.map(btn => (
                <button
                  key={btn.value}
                  className={timePeriod === btn.value ? styles.activeButton : styles.filterButton}
                  onClick={() => setTimePeriod(btn.value)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            
            <div className={styles.chartSection}>
              <h3 className={styles.sectionTitle}>LLM 토큰 비용</h3>
              <ChartComponent label="LLM 토큰 비용" total={llmData.total} dataPoints={llmData.points} color="#0070f3" loading={loading} />
            </div>
            <div className={styles.chartSection}>
              <h3 className={styles.sectionTitle}>서버 사용 비용</h3>
              <ChartComponent label="서버 사용 비용" total={serverData.total} dataPoints={serverData.points} color="#17a2b8" loading={loading} />
            </div>
            <div className={styles.chartSection}>
              <h3 className={styles.sectionTitle}>DB 사용 비용</h3>
              <ChartComponent label="DB 사용 비용" total={dbData.total} dataPoints={dbData.points} color="#28a745" loading={loading} />
            </div>
          </div>

          <div className={styles.chartSection}>
            <h2 className={styles.mainSectionTitle}>비용 분석</h2>
            <ChartComponent label="예상 비용" total={staticEstimatedCost.total} dataPoints={staticEstimatedCost.points} color="#e03131" loading={false} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsageCostlnquiry;
