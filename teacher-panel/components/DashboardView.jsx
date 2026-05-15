import React, { useState, useEffect } from 'react';
import { INITIAL_IDEAS } from '../data';
import '../styles/DashboardView.css';

const DashboardView = ({ showIssues, setShowIssues }) => {
  const [ideas, setIdeas] = useState([...INITIAL_IDEAS]);
  const pendingIdeas = ideas.filter(i => i.status === 'Pending');
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueReply, setIssueReply] = useState('');

  // Load student issues from localStorage
  const [studentIssues, setStudentIssues] = useState([]);

  useEffect(() => {
    const loadIssues = () => {
      const issues = JSON.parse(localStorage.getItem('studentIssues') || '[]');
      setStudentIssues(issues);
    };

    loadIssues();
    
    // Check for new issues every 2 seconds
    const interval = setInterval(loadIssues, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const issuesByCategory = studentIssues.reduce((acc, issue) => {
    if (!acc[issue.category]) acc[issue.category] = [];
    acc[issue.category].push(issue);
    return acc;
  }, {});
  
  // Load student submissions from localStorage on component mount
  useEffect(() => {
    const loadStudentSubmissions = () => {
      const studentIdeas = JSON.parse(localStorage.getItem('studentIdeas') || '[]');
      if (studentIdeas.length > 0) {
        setIdeas(prevIdeas => {
          const existingIds = new Set(prevIdeas.map(idea => idea.id));
          const newIdeas = studentIdeas.filter(idea => !existingIds.has(idea.id));
          return [...prevIdeas, ...newIdeas];
        });
      }
    };
    
    loadStudentSubmissions();
    
    // Set up interval to check for new submissions and sync status changes
    const interval = setInterval(() => {
      const studentIdeas = JSON.parse(localStorage.getItem('studentIdeas') || '[]');
      setIdeas(prevIdeas => {
        // Update existing ideas with latest status from localStorage
        const updatedIdeas = prevIdeas.map(idea => {
          const updatedIdea = studentIdeas.find(si => si.id === idea.id);
          return updatedIdea ? { ...idea, status: updatedIdea.status } : idea;
        });
        
        // Add completely new ideas
        const existingIds = new Set(updatedIdeas.map(idea => idea.id));
        const newIdeas = studentIdeas.filter(idea => !existingIds.has(idea.id));
        
        return [...updatedIdeas, ...newIdeas];
      });
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Auto-select first item if none selected or current selection is no longer pending
  useEffect(() => {
    if (pendingIdeas.length > 0) {
      if (!selectedId || !pendingIdeas.find(i => i.id === selectedId)) {
        setSelectedId(pendingIdeas[0].id);
        setFeedback('');
      }
    } else {
      setSelectedId(null);
    }
  }, [pendingIdeas, selectedId]);

  const selectedIdea = pendingIdeas.find(i => i.id === selectedId);

  const onUpdateStatus = (ideaId, newStatus, feedbackText = '') => {
    // Update idea status in local state
    const updatedIdeas = ideas.map(idea => 
      idea.id === ideaId ? { ...idea, status: newStatus } : idea
    );
    setIdeas(updatedIdeas);
    
    // Update the idea status in localStorage (studentIdeas)
    const studentIdeas = JSON.parse(localStorage.getItem('studentIdeas') || '[]');
    const updatedStudentIdeas = studentIdeas.map(idea => 
      idea.id === ideaId ? { ...idea, status: newStatus } : idea
    );
    localStorage.setItem('studentIdeas', JSON.stringify(updatedStudentIdeas));
    
    // Save feedback to localStorage for student to see
    if (feedbackText.trim()) {
      const existingFeedback = JSON.parse(localStorage.getItem('teacherFeedback') || '[]');
      const newFeedback = {
        id: Date.now(),
        ideaId: ideaId,
        ideaTitle: ideas.find(idea => idea.id === ideaId)?.title || 'Unknown Project',
        leaderName: ideas.find(idea => idea.id === ideaId)?.leader?.name || 'Unknown Student',
        feedback: feedbackText,
        status: newStatus,
        timestamp: new Date().toISOString(),
        teacherName: 'Teacher' // You can make this dynamic later
      };
      
      const updatedFeedback = [...existingFeedback, newFeedback];
      localStorage.setItem('teacherFeedback', JSON.stringify(updatedFeedback));
    }
    
    // Clear feedback and selection
    setFeedback('');
    
    // If accepting, auto-select the next pending idea
    if (newStatus === 'Accepted') {
      const updatedPendingIdeas = updatedIdeas.filter(i => i.status === 'Pending' && i.id !== ideaId);
      if (updatedPendingIdeas.length > 0) {
        // Find the next pending idea (first in list)
        const nextPendingIdea = updatedPendingIdeas[0];
        setSelectedId(nextPendingIdea.id);
      } else {
        // No more pending ideas, clear selection
        setSelectedId(null);
      }
    } else if (newStatus === 'Rejected') {
      // If rejecting, auto-select the next pending idea
      const updatedPendingIdeas = updatedIdeas.filter(i => i.status === 'Pending' && i.id !== ideaId);
      if (updatedPendingIdeas.length > 0) {
        const nextPendingIdea = updatedPendingIdeas[0];
        setSelectedId(nextPendingIdea.id);
      } else {
        setSelectedId(null);
      }
    }
  };

  
  return (
    <div className="dash-page">
      <div className="dash-header-row">
        <div className="dash-header-text">
          <h2 className="dash-title">Pending Submissions</h2>
          <p className="dash-subtitle">Review new student project proposals requiring your approval.</p>
        </div>

              </div>

      {pendingIdeas.length === 0 ? (
        <div className="dash-empty">
          <span className="material-symbols-outlined dash-empty-icon">check_circle</span>
          <p className="dash-empty-title">All caught up!</p>
          <p className="dash-empty-subtitle">No pending submissions to review.</p>
        </div>
      ) : (
        <div className="dash-main-grid">
          <div className="dash-list-card">
            <div className="dash-list-scroll">
              <table className="dash-table">
                <thead className="dash-table-head">
                  <tr>
                    <th className="dash-th dash-th-idea">Idea Name</th>
                    <th className="dash-th">Description</th>
                    <th className="dash-th dash-th-status">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingIdeas.map((idea) => {
                    const isSelected = selectedId === idea.id;
                    return (
                      <tr
                        key={idea.id}
                        onClick={() => { setSelectedId(idea.id); setFeedback(''); }}
                        className={`dash-tr dash-tr-hover ${isSelected ? 'dash-tr-selected' : ''}`}
                      >
                        <td className="dash-td dash-td-idea">
                          <div className="dash-idea-meta">
                            <span className="dash-idea-title">{idea.title}</span>
                            <span className="dash-idea-submeta">{idea.leader.name} • {idea.session}</span>
                          </div>
                        </td>
                        <td className="dash-td">
                          <p className="dash-idea-desc">{idea.shortDescription}</p>
                        </td>
                        <td className="dash-td">
                          <span className="dash-status-pill dash-status-pill-pending">{idea.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dash-detail-column">
            {selectedIdea && (
              <div className="dash-detail-card">
                <div className="dash-detail-hero">
                  <div className="dash-detail-avatar-wrapper">
                    <div className="dash-detail-avatar">
                      <span className="material-symbols-outlined">psychology</span>
                    </div>
                  </div>
                </div>

                <div className="dash-detail-body">
                  <div>
                    <div className="dash-detail-title-row">
                      <h3 className="dash-detail-title">{selectedIdea.title}</h3>
                      <span className="dash-session-pill">{selectedIdea.session} Session</span>
                    </div>
                    <p className="dash-detail-leader">
                      Leader: <span className="dash-detail-leader-name">{selectedIdea.leader.name}</span>
                    </p>
                  </div>

                  <div className="dash-detail-section">
                    <h4 className="dash-section-label">Full Description</h4>
                    <div className="dash-detail-description">
                      <p className="dash-section-text">{selectedIdea.fullDescription}</p>
                    </div>
                  </div>

                  <div className="dash-detail-section">
                    <h4 className="dash-section-label">Team Members</h4>
                    <div className="dash-team-list">
                      {selectedIdea.team.length > 0 ? selectedIdea.team.map((member, idx) => (
                        <span key={idx} className="dash-team-pill">
                          <span className="material-symbols-outlined dash-team-pill-icon">person</span>
                          {member.name}
                        </span>
                      )) : (
                        <span className="dash-team-empty">No additional team members</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dash-feedback-section">
                  <label className="dash-feedback-label-wrapper">
                    <span className="dash-feedback-label">
                      Feedback <span className="dash-feedback-label-note">(Required for rejection)</span>
                    </span>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="dash-feedback-input"
                      placeholder="Enter feedback for the students..."
                    ></textarea>
                  </label>
                </div>

                <div className="dash-actions-row">
                  <button
                    onClick={() => onUpdateStatus(selectedIdea.id, 'Rejected', feedback)}
                    className="dash-btn dash-btn-outline dash-btn-reject"
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span>
                    Reject
                  </button>
                  <button
                    onClick={() => onUpdateStatus(selectedIdea.id, 'Accepted')}
                    className="dash-btn dash-btn-primary"
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      // Send feedback functionality
                      if (feedback.trim()) {
                        const existingFeedback = JSON.parse(localStorage.getItem('teacherFeedback') || '[]');
                        const newFeedback = {
                          id: Date.now(),
                          ideaId: selectedIdea.id,
                          ideaTitle: selectedIdea.title,
                          leaderName: selectedIdea.leader.name,
                          feedback: feedback,
                          status: 'Feedback Sent',
                          timestamp: new Date().toISOString(),
                          teacherName: 'Teacher'
                        };
                        
                        const updatedFeedback = [...existingFeedback, newFeedback];
                        localStorage.setItem('teacherFeedback', JSON.stringify(updatedFeedback));
                        
                        alert('Feedback sent to student!');
                        setFeedback('');
                      } else {
                        alert('Please enter feedback before sending');
                      }
                    }}
                    className="dash-btn dash-btn-secondary"
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Issues Panel */}
      {showIssues && (
        <div className="issues-overlay">
          <div className="issues-panel">
            <div className="issues-header">
              <h2 className="issues-title">Student Issues</h2>
              <button 
                onClick={() => setShowIssues(false)}
                className="issues-close-btn"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="issues-content">
              {Object.entries(issuesByCategory).map(([category, issues]) => (
                <div key={category} className="issues-category">
                  <h3 className="issues-category-title">{category}</h3>
                  <div className="issues-list">
                    {issues.map(issue => (
                      <div 
                        key={issue.id}
                        className="issues-item"
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <div className="issues-item-header">
                          <span className="issues-item-title">{issue.category} Issue</span>
                          <span className="issues-urgency issues-urgency-pending">
                            {issue.status}
                          </span>
                        </div>
                        <p className="issues-item-desc">{issue.description}</p>
                        <div className="issues-item-meta">
                          <span>{issue.studentName}</span>
                          <span>{new Date(issue.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Issue Reply Section */}
            {selectedIssue && (
              <div className="issues-reply-section">
                <h4>Reply to: {selectedIssue.category} Issue</h4>
                <textarea
                  value={issueReply}
                  onChange={(e) => setIssueReply(e.target.value)}
                  className="issues-reply-input"
                  placeholder="Type your reply to the student..."
                ></textarea>
                <div className="issues-reply-actions">
                  <button 
                    onClick={() => {
                      if (issueReply.trim()) {
                        // Update issue with teacher reply
                        const updatedIssues = studentIssues.map(issue => 
                          issue.id === selectedIssue.id 
                            ? { ...issue, teacherReply: issueReply, status: 'Replied' }
                            : issue
                        );
                        
                        // Save to localStorage
                        localStorage.setItem('studentIssues', JSON.stringify(updatedIssues));
                        setStudentIssues(updatedIssues);
                        
                        alert(`Reply sent to ${selectedIssue.studentName}: ${issueReply}`);
                        setIssueReply('');
                        setSelectedIssue(null);
                      } else {
                        alert('Please enter a reply before sending');
                      }
                    }}
                    className="issues-send-btn"
                  >
                    <span className="material-symbols-outlined">send</span>
                    Send Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
