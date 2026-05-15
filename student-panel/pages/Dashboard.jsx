import React, { useState, useEffect } from 'react';
import FileViewer from '../components/FileViewer';

const Dashboard = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ideaStats, setIdeaStats] = useState({
    submitted: 0,
    approved: 0,
    inProgress: 0
  });

  useEffect(() => {
    // Load uploaded files from localStorage
    const loadUploadedFiles = () => {
      const files = JSON.parse(localStorage.getItem('teacherUploads') || '[]');
      setUploadedFiles(files);
    };

    // Load idea statistics from localStorage
    const loadIdeaStats = () => {
      const ideas = JSON.parse(localStorage.getItem('studentIdeas') || '[]');
      const submitted = ideas.length;
      const approved = ideas.filter(idea => idea.status === 'Accepted').length;
      const inProgress = ideas.filter(idea => idea.status === 'Pending').length;
      
      setIdeaStats({
        submitted,
        approved,
        inProgress
      });
    };

    loadUploadedFiles();
    loadIdeaStats();
    
    // Check for new files and ideas every 2 seconds
    const interval = setInterval(() => {
      loadUploadedFiles();
      loadIdeaStats();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return 'picture_as_pdf';
    if (fileType.includes('image')) return 'image';
    if (fileType.includes('doc') || fileType.includes('word')) return 'description';
    return 'insert_drive_file';
  };

  const getFileIconColor = (fileType) => {
    if (fileType.includes('pdf')) return 'dash-file-icon-red';
    if (fileType.includes('image')) return 'dash-file-icon-green';
    if (fileType.includes('doc') || fileType.includes('word')) return 'dash-file-icon-blue';
    return 'dash-file-icon-gray';
  };

  const handleViewFile = (file) => {
    setSelectedFile(file);
  };

  const closeFileViewer = () => {
    setSelectedFile(null);
  };

  return (
    <div className="dash-container">
      {/* Welcome Banner */}
      <div className="dash-welcome-banner">
        <div 
          className="dash-welcome-bg" 
          style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZOAkHwo3o9KnO8-LyQWXOL47RdVVfmSDXj6bbBQM6AcRTDwr6VII0_UDLOwwqHEOJ7ErGGBz08Kfm55H50v-u2M_NEKy23EillxdCJCYygjtPy16bkAcxdge6oDzIEfPrppyD3Zjodqc_r_eqwFo-kQ_yedQ4YqtxPpeU--FMGI4wy40qYngQOSrkPpTkA2TmUD82zptG3YWWePlq_BnXAMTB8pieL8Z-LdJyGnGEQbWMVw_6WSWtXJT3QRXqN6Bw0LoRr7Cs-TRN')"}}
        ></div>
        <div className="dash-welcome-overlay"></div>
        <div className="dash-welcome-content">
          <h2 className="dash-welcome-title">Welcome back, Student!</h2>
          <p className="dash-welcome-subtitle">You have {uploadedFiles.length} new file(s) to review.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dash-stats-grid">
        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <div className="dash-stat-icon dash-stat-icon-purple">
              <span className="material-symbols-outlined text-2xl">upload</span>
            </div>
            <span className="dash-stat-badge dash-stat-badge-purple">Submitted</span>
          </div>
          <div className="dash-stat-content">
            <h3 className="dash-stat-label">Submit Ideas</h3>
            <p className="dash-stat-value">{ideaStats.submitted}</p>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <div className="dash-stat-icon dash-stat-icon-green">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <span className="dash-stat-badge dash-stat-badge-green">Approved</span>
          </div>
          <div className="dash-stat-content">
            <h3 className="dash-stat-label">Approved Ideas</h3>
            <p className="dash-stat-value">{ideaStats.approved}</p>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <div className="dash-stat-icon dash-stat-icon-amber">
              <span className="material-symbols-outlined text-2xl">hourglass_empty</span>
            </div>
            <span className="dash-stat-badge dash-stat-badge-amber">In Progress</span>
          </div>
          <div className="dash-stat-content">
            <h3 className="dash-stat-label">Ideas in Progress</h3>
            <p className="dash-stat-value">{ideaStats.inProgress}</p>
          </div>
        </div>

        <div className="dash-files-card">
          <div className="dash-files-header">
            <h3 className="dash-files-title">Latest File Uploads</h3>
            <span className="dash-stat-badge dash-stat-badge-slate">{uploadedFiles.length} files</span>
          </div>
          <div className="dash-files-list">
            {uploadedFiles.length === 0 ? (
              <div className="dash-files-empty">
                <span className="material-symbols-outlined dash-files-empty-icon">folder_open</span>
                <p className="dash-files-empty-title">No files uploaded yet</p>
                <p className="dash-files-empty-subtitle">Check back later for new materials</p>
              </div>
            ) : (
              uploadedFiles.slice().reverse().map((file, index) => (
                <div key={file.id} className="dash-file-item">
                  <div className={`dash-file-icon ${getFileIconColor(file.type)}`}>
                    <span className="material-symbols-outlined text-[20px]">{getFileIcon(file.type)}</span>
                  </div>
                  <div className="dash-file-info">
                    <p className="dash-file-name">{file.name}</p>
                    {file.announcement && file.announcement !== 'No announcement' && (
                      <p className="dash-file-announcement">{file.announcement}</p>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{formatTimestamp(file.uploadDate)}</span>
                    </div>
                  </div>
                  <button 
                    className="dash-view-btn"
                    onClick={() => handleViewFile(file)}
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>View</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* File Viewer Modal */}
      {selectedFile && (
        <FileViewer 
          file={selectedFile} 
          onClose={closeFileViewer}
        />
      )}
    </div>
  );
};

export default Dashboard;
