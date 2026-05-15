import React, { useState, useEffect } from 'react';
import { INITIAL_IDEAS } from '../data';
import '../styles/ProgressView.css';

const ProgressView = () => {
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const [studentProgressData, setStudentProgressData] = useState(null);

  // Load student progress data from localStorage
  useEffect(() => {
    const loadStudentProgress = () => {
      try {
        const savedData = localStorage.getItem('studentProgressData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setStudentProgressData(parsedData);
        }
      } catch (error) {
        console.error('Error loading student progress:', error);
      }
    };

    loadStudentProgress();
    
    // Set up interval to check for updates every 2 seconds
    const interval = setInterval(loadStudentProgress, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Only show accepted ideas in progress
  const activeIdeas = ideas.filter(i => i.status === 'Accepted');

  // Display student progress if available
  const displayStudentProgress = () => {
    if (!studentProgressData) return null;
    
    return (
      <div className="prog-card" style={{ border: '2px solid #4f46e5' }}>
        <div className="prog-card-main">
          <div className="prog-group-label prog-group-label-primary">
            Live Student Progress
          </div>
          <h3 className="prog-card-title">{studentProgressData.projectName || 'Untitled Project'}</h3>
          <div className="prog-card-leader-progress">
            <p className="prog-card-leader">
              Leader: <span>{studentProgressData.leaderName || 'Not set'}</span>
            </p>
            {studentProgressData.members && studentProgressData.members.length > 0 && (
              <p className="prog-card-leader" style={{ marginTop: '5px' }}>
                Members: <span>{studentProgressData.members.join(', ')}</span>
              </p>
            )}
            <div className="prog-card-progress">
              <div className="prog-progress-header">
                <span className="prog-progress-label">Completion</span>
                <span className="prog-progress-value">{studentProgressData.progress}%</span>
              </div>
              <div className="prog-progress-bar-bg">
                <div
                  className={`prog-progress-bar-fill ${
                    studentProgressData.progress > 80
                      ? 'prog-progress-bar-emerald'
                      : studentProgressData.progress > 50
                        ? 'prog-progress-bar-primary'
                        : 'prog-progress-bar-amber'
                  }`}
                  style={{ width: `${studentProgressData.progress}%` }}
                ></div>
              </div>
              <div className="prog-progress-milestones">
                <span>{studentProgressData.tasks?.filter(t => t.status === 'Completed').length || 0} Tasks Completed</span>
                <span>{studentProgressData.tasks?.length || 0} Total Tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="prog-page">
      <div className="prog-header">
        <div className="prog-header-text">
          <h2 className="prog-title">Student Progress</h2>
          <p className="prog-subtitle">Track project progress of all student groups.</p>
        </div>
      </div>

      <div className="prog-list">
        {/* Show live student progress first */}
        {displayStudentProgress()}
        
        {activeIdeas.length === 0 && !studentProgressData ? (
          <div className="prog-empty">
            <p className="prog-empty-text">No active projects found for this session yet.</p>
          </div>
        ) : (
          activeIdeas.map((idea, index) => (
            <div key={idea.id} className="prog-card">
              <div className="prog-card-main">
                <div
                  className={`prog-group-label ${
                    index % 3 === 0
                      ? 'prog-group-label-primary'
                      : index % 3 === 1
                        ? 'prog-group-label-purple'
                        : 'prog-group-label-emerald'
                  }`}
                >
                  Group {String.fromCharCode(65 + index)}
                </div>
                <h3 className="prog-card-title">{idea.title}</h3>
                <div className="prog-card-leader-progress">
                  <p className="prog-card-leader">
                    Leader: <span>{idea.leader.name}</span>
                  </p>
                  <div className="prog-card-progress">
                    <div className="prog-progress-header">
                      <span className="prog-progress-label">Completion</span>
                      <span className="prog-progress-value">{idea.progress}%</span>
                    </div>
                    <div className="prog-progress-bar-bg">
                      <div
                        className={`prog-progress-bar-fill ${
                          idea.progress > 80
                            ? 'prog-progress-bar-emerald'
                            : idea.progress > 50
                              ? 'prog-progress-bar-primary'
                              : 'prog-progress-bar-amber'
                        }`}
                        style={{ width: `${idea.progress}%` }}
                      ></div>
                    </div>
                    <div className="prog-progress-milestones">
                      <span>{idea.milestones.current}</span>
                      <span>{idea.milestones.next}</span>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgressView;
