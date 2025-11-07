import React, { useState, useEffect } from 'react';
import { BarChart3, MessageSquare, Zap, TrendingUp, Calendar } from 'lucide-react';
import './AnalyticsDashboard.css';

const API_URL = 'https://api.arktechnologies.ai';

export default function AnalyticsDashboard({ onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agents/analytics/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">📊 Analytics Dashboard</h1>
          <p className="analytics-subtitle">Track your AI agent usage and performance</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="analytics-close-btn">
            ← Back to Chat
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#667eea' }}>
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total_messages || 0}</div>
            <div className="stat-label">Total Messages</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b981' }}>
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total_agents || 0}</div>
            <div className="stat-label">Active Agents</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.avg_response_time || '1.2'}s</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ec4899' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.messages_today || 0}</div>
            <div className="stat-label">Messages Today</div>
          </div>
        </div>
      </div>

      {/* Top Agents */}
      <div className="analytics-section">
        <h2 className="section-title">🏆 Most Active Agents</h2>
        <div className="agents-list-analytics">
          {stats?.top_agents?.length > 0 ? (
            stats.top_agents.map((agent, index) => (
              <div key={agent.id} className="agent-analytics-card">
                <div className="agent-rank">#{index + 1}</div>
                <div className="agent-info">
                  <div className="agent-name-analytics">{agent.name}</div>
                  <div className="agent-stats-text">{agent.message_count} messages</div>
                </div>
                <div className="agent-progress">
                  <div 
                    className="agent-progress-bar" 
                    style={{ 
                      width: `${(agent.message_count / stats.total_messages) * 100}%`,
                      backgroundColor: index === 0 ? '#667eea' : index === 1 ? '#10b981' : '#f59e0b'
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="empty-analytics">No agent activity yet. Start chatting!</div>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="analytics-section">
        <h2 className="section-title">📈 Recent Activity</h2>
        <div className="activity-timeline">
          {stats?.recent_activity?.length > 0 ? (
            stats.recent_activity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'message' ? <MessageSquare size={16} /> : <Calendar size={16} />}
                </div>
                <div className="activity-content">
                  <div className="activity-text">{activity.text}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-analytics">No recent activity</div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="analytics-section">
        <h2 className="section-title">💡 Usage Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <div className="tip-title">Be Specific</div>
            <div className="tip-text">Provide clear context for better AI responses</div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <div className="tip-title">Use Templates</div>
            <div className="tip-text">Start with pre-built agents to save time</div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">⚡</div>
            <div className="tip-title">Iterate</div>
            <div className="tip-text">Refine your prompts for optimal results</div>
          </div>
        </div>
      </div>
    </div>
  );
}