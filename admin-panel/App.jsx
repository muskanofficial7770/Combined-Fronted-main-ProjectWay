import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import ManageTeachers from './pages/ManageTeachers.jsx';
import ManageStudents from './pages/ManageStudents.jsx';
import RolesPermissions from './pages/RolesPermissions.jsx';
import './styles/Global.css';

const AppContent = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const renderContent = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'teachers':
        return <ManageTeachers />;
      case 'students':
        return <ManageStudents />;
      case 'roles':
        return <RolesPermissions />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <>
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
      
      {/* Sidebar Navigation */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '250px',
        height: '100vh',
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '20px',
        zIndex: 1000,
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{margin: '0 0 20px 0', fontSize: '18px'}}>Admin Panel</h3>
        <nav style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            style={{
              padding: '12px',
              border: 'none',
              background: currentPage === 'dashboard' ? '#2563eb' : 'transparent',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('teachers')}
            style={{
              padding: '12px',
              border: 'none',
              background: currentPage === 'teachers' ? '#2563eb' : 'transparent',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            Manage Teachers
          </button>
          <button 
            onClick={() => setCurrentPage('students')}
            style={{
              padding: '12px',
              border: 'none',
              background: currentPage === 'students' ? '#2563eb' : 'transparent',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            Manage Students
          </button>
          <button 
            onClick={() => setCurrentPage('roles')}
            style={{
              padding: '12px',
              border: 'none',
              background: currentPage === 'roles' ? '#2563eb' : 'transparent',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            Roles & Permissions
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '250px',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '20px'
      }}>
        {renderContent()}
      </div>
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
