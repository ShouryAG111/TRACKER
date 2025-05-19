import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Tracker() {
  const [progressData, setProgressData] = useState([]);
    const { token } = useAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/questions/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgressData(response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error fetching progress data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
      }
    };
     fetchProgress();
  }, []);


  const chartData = {
    labels: progressData.map((data) => data.topic),
    datasets: [
      {
        label: 'Total Questions',
        data: progressData.map((data) => data.totalQuestions),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Needs Revision',
        data: progressData.map((data) => data.needsRevisionCount),
        backgroundColor: 'rgba(139, 0, 0, 1)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Progress Chart' },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Progress</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {progressData.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>Loading progress data...</p>
        )}
      </div>
    </div>
  );
}

export default Tracker;
