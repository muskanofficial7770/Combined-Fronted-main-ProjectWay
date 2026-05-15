import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Import panel components
import StudentPanel from './student-panel/App.jsx';
import AdminPanel from './admin-panel/App.jsx';
import TeacherPanel from './teacher-panel/App.jsx';

// Main dashboard with three blocks
function MainDashboard() {
  const navigate = useNavigate();
  
  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #edf5f4 0%, #d6eaf5 100%);
          min-height: 100vh;
        }
        
        .main-dashboard {
          min-height: 100vh;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
          color: white;
        }
        
        .dashboard-title {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .dashboard-subtitle {
          font-size: 1.2rem;
          margin: 0;
          opacity: 0.9;
        }
        
        .panels-container {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 1200px;
          width: 100%;
        }
        
        .panel-block {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          width: 320px;
          min-height: 280px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        
        .panel-block:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .panel-block:active {
          transform: translateY(-4px);
        }
        
        .student-panel {
          background: linear-gradient(135deg, #3b82f6 0%, #5586f1 100%);
          color: white;
        }
        
        .student-panel:hover {
          border-color: #60a5fa;
        }
        
        .teacher-panel {
          background: linear-gradient(135deg, #10b981 0%, #15cc92 100%);
          color: white;
        }
        
        .teacher-panel:hover {
          border-color: #34d399;
        }
        
        .admin-panel {
          background: linear-gradient(135deg, #8b5cf6 0%, #7558a7 100%);
          color: white;
        }
        
        .admin-panel:hover {
          border-color: #a78bfa;
        }
        
        .panel-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        
        .panel-icon .material-symbols-outlined {
          font-size: 2rem;
        }
        
        .panel-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }
        
        .panel-description {
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0 0 1.5rem 0;
          opacity: 0.9;
          flex-grow: 1;
        }
        
        .panel-arrow {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        
        .panel-arrow .material-symbols-outlined {
          font-size: 1.5rem;
          opacity: 0.8;
        }
        
        .material-symbols-outlined {
          font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
        }
        
        @media (max-width: 768px) {
          .main-dashboard {
            padding: 1rem;
          }
          
          .dashboard-title {
            font-size: 2rem;
          }
          
          .panels-container {
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
          
          .panel-block {
            width: 100%;
            max-width: 350px;
          }
        }
      `}</style>
      
      <div className="main-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Education Dashboard</h1>
          <p className="dashboard-subtitle">Select a panel to access</p>
        </div>
        
        <div className="panels-container">
          {/* Student Panel Block */}
          <div 
            className="panel-block student-panel"
            onClick={() => navigate('/student')}
          >
            <div className="panel-icon">
              <span className="material-symbols-outlined">school</span>
            </div>
            <h2 className="panel-title">Student Panel</h2>
            <p className="panel-description">Access student dashboard, submit ideas, track progress</p>
            <div className="panel-arrow">
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>

          {/* Teacher Panel Block */}
          <div 
            className="panel-block teacher-panel"
            onClick={() => navigate('/teacher')}
          >
            <div className="panel-icon">
              <span className="material-symbols-outlined">person</span>
            </div>
            <h2 className="panel-title">Teacher Panel</h2>
            <p className="panel-description">Manage ideas, track student progress, upload resources</p>
            <div className="panel-arrow">
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>

          {/* Admin Panel Block */}
          <div 
            className="panel-block admin-panel"
            onClick={() => navigate('/admin')}
          >
            <div className="panel-icon">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <h2 className="panel-title">Admin Panel</h2>
            <p className="panel-description">Manage teachers, students, roles and permissions</p>
            <div className="panel-arrow">
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/student/*" element={<StudentPanel />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/teacher/*" element={<TeacherPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
