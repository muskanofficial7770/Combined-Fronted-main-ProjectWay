import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-root">
      <div className="dashboard-header-row">
        <div>
          <h2 className="dashboard-title">Dashboard Overview</h2>
          <p className="dashboard-subtitle">
            Easily view and manage all student and teacher information from this dashboard. 
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        {/* Card 1 */}
        <div className="dashboard-card">
          <div>
            <p className="dashboard-card-label">Total Students</p>
            <h3 className="dashboard-card-value">1,240</h3>
          </div>
          <div className="dashboard-card-icon dashboard-card-icon-blue">
            <span className="material-symbols-outlined">school</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="dashboard-card">
          <div>
            <p className="dashboard-card-label">Total Teachers</p>
            <h3 className="dashboard-card-value">45</h3>
          </div>
          <div className="dashboard-card-icon dashboard-card-icon-purple">
            <span className="material-symbols-outlined">people</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;