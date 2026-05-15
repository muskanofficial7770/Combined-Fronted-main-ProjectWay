import React, { useState, useEffect } from 'react';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Load feedback from localStorage
    const loadFeedbacks = () => {
      const teacherFeedbacks = JSON.parse(localStorage.getItem('teacherFeedback') || '[]');
      const studentIssues = JSON.parse(localStorage.getItem('studentIssues') || '[]');
      
      // Combine feedbacks and issue replies
      const allFeedbacks = [
        ...teacherFeedbacks,
        ...studentIssues.filter(issue => issue.teacherReply).map(issue => ({
          id: Date.now() + Math.random(),
          ideaTitle: `${issue.category} Issue`,
          leaderName: issue.studentName,
          feedback: issue.teacherReply,
          status: 'Issue Replied',
          timestamp: issue.timestamp,
          teacherName: 'Teacher'
        }))
      ];
      
      setFeedbacks(allFeedbacks);
    };

    loadFeedbacks();
    
    // Check for new feedback every 2 seconds
    const interval = setInterval(loadFeedbacks, 2000);
    
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'Accepted': return 'feedback-status-accepted';
      case 'Rejected': return 'feedback-status-rejected';
      case 'Feedback Sent': return 'feedback-status-pending';
      default: return 'feedback-status-pending';
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h2 className="feedback-title">Feedback</h2>
        <p className="feedback-subtitle">Review feedback and comments from teachers on your submissions.</p>
      </div>

      <div className="feedback-filters">
        <button className="feedback-filter-btn active">All</button>
      </div>

      <div className="feedback-list">
        {feedbacks.length === 0 ? (
          <div className="feedback-empty">
            <span className="material-symbols-outlined feedback-empty-icon">inbox</span>
            <p className="feedback-empty-title">No feedback yet</p>
            <p className="feedback-empty-subtitle">Teachers haven't provided any feedback on your submissions.</p>
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-card-header">
                <span className={`feedback-status-tag ${getStatusClass(feedback.status)}`}>
                  {feedback.status.toUpperCase()}
                </span>
                <div className="feedback-reviewer-info">
                  <div className="feedback-reviewer-details">
                    <div className="feedback-reviewer-name">{feedback.teacherName}</div>
                  </div>
                </div>
              </div>
              <div className="feedback-project-info">
                <strong>Project:</strong> {feedback.ideaTitle}
              </div>
              <div className="feedback-message">
                {feedback.feedback}
              </div>
              <div className="feedback-timestamp">{formatTimestamp(feedback.timestamp)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback;
