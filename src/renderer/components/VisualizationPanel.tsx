import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Activity {
  id: string;
  type: 'win' | 'loss';
  amount: number;
  description: string;
  timestamp: number;
}

interface VisualizationPanelProps {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ activities, onAddActivity }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (amount && numAmount !== 0) {
      onAddActivity({
        type: numAmount > 0 ? 'win' : 'loss',
        amount: Math.abs(numAmount),
        description: description.trim()
      });
      setAmount('');
      setDescription('');
    }
  };

  const stats = useMemo(() => {
    const wins = activities.filter(a => a.type === 'win');
    const losses = activities.filter(a => a.type === 'loss');
    const totalWins = wins.reduce((sum, a) => sum + a.amount, 0);
    const totalLosses = losses.reduce((sum, a) => sum + a.amount, 0);
    const netProfit = totalWins - totalLosses;
    const winRate = activities.length > 0 ? (wins.length / activities.length) * 100 : 0;

    return {
      totalWins,
      totalLosses,
      netProfit,
      winRate,
      totalActivities: activities.length,
      winsCount: wins.length,
      lossesCount: losses.length
    };
  }, [activities]);

  const chartData = useMemo(() => {
    // Sort activities by timestamp
    const sorted = [...activities].sort((a, b) => a.timestamp - b.timestamp);
    
    let cumulative = 0;
    const labels = sorted.map((_, i) => `Activity ${i + 1}`);
    const cumulativeData = sorted.map(activity => {
      cumulative += activity.type === 'win' ? activity.amount : -activity.amount;
      return cumulative;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Cumulative Profit/Loss',
          data: cumulativeData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    };
  }, [activities]);

  const barChartData = useMemo(() => {
    return {
      labels: ['Wins', 'Losses'],
      datasets: [
        {
          label: 'Count',
          data: [stats.winsCount, stats.lossesCount],
          backgroundColor: [
            'rgba(39, 174, 96, 0.6)',
            'rgba(231, 76, 60, 0.6)',
          ],
          borderColor: [
            'rgba(39, 174, 96, 1)',
            'rgba(231, 76, 60, 1)',
          ],
          borderWidth: 1
        }
      ]
    };
  }, [stats]);

  const pieChartData = useMemo(() => {
    return {
      labels: ['Total Wins', 'Total Losses'],
      datasets: [
        {
          label: 'Amount',
          data: [stats.totalWins, stats.totalLosses],
          backgroundColor: [
            'rgba(39, 174, 96, 0.6)',
            'rgba(231, 76, 60, 0.6)',
          ],
          borderColor: [
            'rgba(39, 174, 96, 1)',
            'rgba(231, 76, 60, 1)',
          ],
          borderWidth: 1
        }
      ]
    };
  }, [stats]);

  return (
    <div className="visualization-panel">
      <div className="activity-form-compact">
        <form onSubmit={handleSubmit} className="quick-log-form">
          <input
            type="number"
            className="quick-log-input"
            placeholder="Enter amount (+ for gain, - for loss)"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            className="quick-log-description"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="btn btn-quick-log" disabled={!amount || parseFloat(amount) === 0}>
            Log
          </button>
        </form>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Activities</div>
          <div className="stat-value">{stats.totalActivities}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Gains</div>
          <div className="stat-value positive">${stats.totalWins.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Losses</div>
          <div className="stat-value negative">${stats.totalLosses.toFixed(2)}</div>
        </div>
        <div className="stat-card stat-card-highlight">
          <div className="stat-label">Net Profit/Loss</div>
          <div className={`stat-value stat-value-large ${stats.netProfit >= 0 ? 'positive' : 'negative'}`}>
            ${stats.netProfit.toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value">{stats.winRate.toFixed(1)}%</div>
        </div>
      </div>

      {activities.length > 0 ? (
        <div className="charts-grid">
          <div className="chart-container chart-main">
            <h3 className="chart-title">Cumulative Profit/Loss Over Time</h3>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          <div className="chart-container chart-small">
            <h3 className="chart-title">Win/Loss Count</h3>
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          <div className="chart-container chart-small">
            <h3 className="chart-title">Distribution by Amount</h3>
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <h3>No activity data yet</h3>
          <p>Enter a positive number for gains or a negative number for losses</p>
        </div>
      )}
    </div>
  );
};

export default VisualizationPanel;
