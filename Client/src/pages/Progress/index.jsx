import React, { useState } from 'react';
import styles from './style.module.scss';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  sets: [
    { date: '2023-07-11', value: 4 },
    { date: '2023-07-13', value: 5 },
    { date: '2023-07-15', value: 6 },
    { date: '2023-07-17', value: 5 },
    { date: '2023-07-19', value: 7 },
  ],
  reps: [
    { date: '2023-07-11', value: 10 },
    { date: '2023-07-13', value: 12 },
    { date: '2023-07-15', value: 8 },
    { date: '2023-07-17', value: 15 },
    { date: '2023-07-19', value: 11 },
  ],
  difficulty: [
    { date: '2023-07-11', value: 3 },
    { date: '2023-07-13', value: 4 },
    { date: '2023-07-15', value: 5 },
    { date: '2023-07-17', value: 4 },
    { date: '2023-07-19', value: 6 },
  ],
  weight: [
    { date: '2023-07-11', value: 50 },
    { date: '2023-07-13', value: 55 },
    { date: '2023-07-15', value: 60 },
    { date: '2023-07-17', value: 57 },
    { date: '2023-07-19', value: 65 },
  ],
};

const Progress = () => {
  const [parameter, setParameter] = useState('sets');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  const chartData = {
    labels: data[parameter].map(item => formatDate(item.date)),
    datasets: [
      {
        label: parameter,
        data: data[parameter].map(item => item.value),
        borderColor: '#eaff00',
        backgroundColor: 'rgba(234, 255, 0, 0.2)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#eaff00',
        pointBorderColor: '#242424',
        pointHoverBackgroundColor: '#242424',
        pointHoverBorderColor: '#eaff00',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${parameter.charAt(0).toUpperCase() + parameter.slice(1)} Progress`,
        color: '#eaff00',
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#eaff00',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#eaff00',
        },
      },
    },
  };

  return (
    <div className={styles.progressPage}>
      <div className={styles.header}>
        <div className={styles.pageName}>Progress Tracker</div>
      </div>
      <div className={styles.chartContainer}>
        <Line data={chartData} options={options} />
      </div>
      <div className={styles.parameterButtons}>
        {Object.keys(data).map(param => (
          <button
            key={param}
            onClick={() => setParameter(param)}
            className={`${styles.parameterButton} ${parameter === param ? styles.active : ''}`}
          >
            {param}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Progress;
