import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { INITIAL_IDEAS } from './data';
import DashboardView from './components/DashboardView';
import AllIdeasView from './components/AllIdeasView';
import ProgressView from './components/ProgressView';
import Upload from './components/Upload';
import './styles/main.css';
import './styles/utilities.css';
import './styles/scrollbar.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showIssues, setShowIssues] = useState(false);
  const [teacherPermissions, setTeacherPermissions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('roles');
    if (saved) {
      const roles = JSON.parse(saved);
      const teacher = roles.find(r => r.id === '2');
      if (teacher) {
        setTeacherPermissions(teacher.permissions);
      }
    }
  }, []);
  
  const canUpload = !teacherPermissions.includes('idea.upload');
  const canViewProgress = !teacherPermissions.includes('progress.track');
  const canReviewIdeas = !teacherPermissions.includes('idea.review');
  const canCreateTasks = !teacherPermissions.includes('task.create');
  
  const isActive = (path) => {
    const currentPath = location.pathname;
    return currentPath === `/teacher${path}` || currentPath === path;
  };

  const handleNavigation = (path) => {
    navigate(`/teacher${path}`);
  };

  return (
    <div className="app-container">
      {/* Simple back button */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        zIndex: 9999,
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px',
        padding: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        fontSize: '14px'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-content">
          {/* User Profile */}
          <div className="user-profile">
            <div className="user-info">
              <h1>Teacher Panel</h1>
            </div>
          </div>
          {/* Navigation */}
          <nav className="nav-menu">
            {canCreateTasks && <button 
              onClick={() => handleNavigation('/dashboard')}
              className={`nav-button ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined nav-icon">dashboard</span>
              <p className={`nav-text ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</p>
            </button>}
            {canReviewIdeas && <button 
              onClick={() => handleNavigation('/allideas')}
              className={`nav-button ${isActive('/allideas') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined nav-icon">tips_and_updates</span>
              <p className={`nav-text ${isActive('/allideas') ? 'active' : ''}`}>All Ideas</p>
            </button>}
            {canViewProgress && <button 
              onClick={() => handleNavigation('/progress')}
              className={`nav-button ${isActive('/progress') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined nav-icon">bar_chart</span>
              <p className={`nav-text ${isActive('/progress') ? 'active' : ''}`}>Progress</p>
            </button>}
            {canUpload && <button 
              onClick={() => handleNavigation('/upload')}
              className={`nav-button ${isActive('/upload') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined nav-icon">upload</span>
              <p className={`nav-text ${isActive('/upload') ? 'active' : ''}`}>Upload</p>
            </button>}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-actions">
            {isActive('/dashboard') && canCreateTasks && (
              <>
                <button 
                  onClick={() => setShowIssues(true)}
                  className="issues-btn"
                >
                  <span className="material-symbols-outlined">help</span>
                  Issues
                </button>
                <button className="notification-btn">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="notification-dot"></span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="content-area">
          <div className="content-wrapper">
            {(() => {
              const currentPath = location.pathname;
              if ((currentPath === '/teacher/dashboard' || currentPath === '/teacher') && canCreateTasks) {
                return <DashboardView showIssues={showIssues} setShowIssues={setShowIssues} />;
              } else if (currentPath === '/teacher/allideas' && canReviewIdeas) {
                return <AllIdeasView />;
              } else if (currentPath === '/teacher/progress' && canViewProgress) {
                return <ProgressView />;
              } else if (currentPath === '/teacher/upload' && canUpload) {
                return <Upload />;
              }
              return <DashboardView showIssues={showIssues} setShowIssues={setShowIssues} />;
            })()}
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return <Navigation />;
};

export default App;
