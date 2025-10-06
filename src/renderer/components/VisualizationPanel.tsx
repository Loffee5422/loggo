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
  const [activityType, setActivityType] = useState<'win' | 'loss'>('win');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      onAddActivity({
        type: activityType,
        amount: parseFloat(amount),
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
      <div className="visualization-header">
        <h2>Activity Data & Visualizations</h2>
      </div>

      <div className="activity-form">
        <h3>Log New Activity</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type:</label>
              <select
                className="form-input"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as 'win' | 'loss')}
              >
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount:</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description (optional):</label>
            <input
              type="text"
              className="form-input"
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn" disabled={!amount || parseFloat(amount) <= 0}>
            Log Activity
          </button>
        </form>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-label">Total Activities</div>
          <div className="stat-value">{stats.totalActivities}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Wins</div>
          <div className="stat-value positive">${stats.totalWins.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Losses</div>
          <div className="stat-value negative">${stats.totalLosses.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Net Profit/Loss</div>
          <div className={`stat-value ${stats.netProfit >= 0 ? 'positive' : 'negative'}`}>
            ${stats.netProfit.toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value">{stats.winRate.toFixed(1)}%</div>
        </div>
      </div>

      {activities.length > 0 ? (
        <>
          <div className="chart-container">
            <h3 className="chart-title">Cumulative Profit/Loss Over Time</h3>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="chart-container">
              <h3 className="chart-title">Win/Loss Count</h3>
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            <div className="chart-container">
              <h3 className="chart-title">Win/Loss Distribution by Amount</h3>
              <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>No activity data yet</h3>
          <p>Log your first activity above to see visualizations</p>
        </div>
      )}
    </div>
  );
};

export default VisualizationPanel;
