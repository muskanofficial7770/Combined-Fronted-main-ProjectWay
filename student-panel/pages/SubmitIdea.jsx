import React, { useState, useEffect } from 'react';

const SubmitIdea = () => {
  const [projectName, setProjectName] = useState('');
  const [session, setSession] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [memberInput, setMemberInput] = useState('');
  const [errors, setErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);

  // Load draft data on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('submitIdeaDraft');
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft);
      setProjectName(draftData.projectName || '');
      setSession(draftData.session || '');
      setLeaderName(draftData.leaderName || '');
      setDescription(draftData.description || '');
      setMembers(draftData.members || []);
    }
  }, []);

  const handleAddMember = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (memberInput.trim()) {
        setMembers([...members, memberInput.trim()]);
        setMemberInput('');
      }
    }
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    
    if (!session) {
      newErrors.session = 'Session is required';
    }
    
    if (!leaderName.trim()) {
      newErrors.leaderName = 'Leader name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (members.length === 0) {
      newErrors.members = 'At least one team member is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    const draftData = {
      projectName,
      session,
      leaderName,
      description,
      members,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('submitIdeaDraft', JSON.stringify(draftData));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill all fields properly');
      return;
    }

    // Check for duplicate submissions (any student with same idea)
    const existingIdeas = JSON.parse(localStorage.getItem('studentIdeas') || '[]');
    const isDuplicate = existingIdeas.some(idea => 
      idea.title.toLowerCase().trim() === projectName.toLowerCase().trim() && 
      idea.fullDescription.toLowerCase().trim() === description.toLowerCase().trim()
    );

    if (isDuplicate) {
      alert('This project idea already submitted by another student! Please choose a different idea.');
      return;
    }

    // Create new idea object
    const newIdea = {
      id: Date.now(), // Simple unique ID
      title: projectName,
      session: session,
      leader: { name: leaderName },
      shortDescription: description.substring(0, 100) + '...',
      fullDescription: description,
      team: members.map(name => ({ name })),
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    const updatedIdeas = [...existingIdeas, newIdea];
    
    // Save to localStorage
    localStorage.setItem('studentIdeas', JSON.stringify(updatedIdeas));

    // Show success message
    alert('Project idea submitted successfully!');
    
    // Reset form
    setProjectName('');
    setSession('');
    setLeaderName('');
    setDescription('');
    setMembers([]);
    setMemberInput('');
    setErrors({});
    
    // Clear draft after successful submission
    localStorage.removeItem('submitIdeaDraft');
  };

  return (
    <div className="si-page">
      <div className="si-header-row">
        <div>
          <h2 className="si-title">Submit Project Idea</h2>
          <p className="si-subtitle">
            Share your innovation with the faculty for review.
          </p>
        </div>
        {draftSaved && (
          <div className="si-draft-success">
            <span className="material-symbols-outlined si-draft-success-icon">
              check_circle
            </span>
            Draft Saved Successfully
          </div>
        )}
      </div>

      <div className="si-card">
        {/* Form */}
        <div className="si-card-inner">
          <div className="si-form-grid">
            <div className="si-field si-field-full">
              <label className="si-label">Project Idea Name</label>
              <input
                className={`si-input ${errors.projectName ? 'error' : ''}`}
                placeholder="e.g. AI-Powered Recycling Bin"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              {errors.projectName && <span className="error-message">{errors.projectName}</span>}
            </div>

            <div className="si-field">
              <label className="si-label">Session</label>
              <div className="si-select-wrapper">
               <select className={`si-select ${errors.session ? 'error' : ''}`} value={session} onChange={(e) => setSession(e.target.value)}>
                  <option value="">Select Session</option>
                  <option value="Morning Session (09:00 - 12:00)">Morning Session (09:00 - 12:00)</option>
                  <option value="Evening Session (14:00 - 17:00)">Evening Session (14:00 - 17:00)</option>
                </select>
                <span className="si-select-icon-wrapper">
                  <span className="material-symbols-outlined si-select-icon">
                    expand_more
                  </span>
                </span>
              </div>
              {errors.session && <span className="error-message">{errors.session}</span>}
            </div>

            <div className="si-field">
              <label className="si-label">Leader Name</label>
              <div className="si-input-icon-wrapper">
                <span className="si-input-icon-prefix">
                  <span className="material-symbols-outlined si-input-icon-person">
                    person
                  </span>
                </span>
                <input
                  className={`si-input-with-icon ${errors.leaderName ? 'error' : ''}`}
                  placeholder="Enter your name"
                  type="text"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                />
              </div>
              {errors.leaderName && <span className="error-message">{errors.leaderName}</span>}
            </div>

            <div className="si-field si-field-full">
              <label className="si-label">Description</label>
              <textarea
                className={`w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm ${errors.description ? 'error' : ''}`}
                placeholder="Describe the core problem, your proposed solution, and the technologies you plan to use..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {errors.description && <span className="error-message">{errors.description}</span>}
              <p className="si-counter">{description.length} / 500 characters</p>
            </div>

            <div className="si-field si-field-full">
              <label className="si-label">Team Members</label>
              <div className="si-chip-input">
                {members.map((member, idx) => (
                  <div key={idx} className="si-chip">
                    {member}
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="si-chip-remove"
                    >
                      <span className="material-symbols-outlined si-chip-remove-icon">
                        close
                      </span>
                    </button>
                  </div>
                ))}
                <input
                  className="border-none focus:ring-0 p-1 text-sm bg-transparent flex-1 min-w-[140px] text-slate-900 dark:text-white"
                  placeholder="Type name & press Enter..."
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={handleAddMember}
                />
              </div>
              {errors.members && <span className="error-message">{errors.members}</span>}
              <p className="si-hint">
                <span className="material-symbols-outlined si-hint-icon">
                  info
                </span>
                Press Enter to add a member. Add up to 4 additional members.
              </p>
            </div>
          </div>

          <div className="si-footer-row">
            <div className="si-footer-actions">
              <button
                type="button"
                className="si-btn-secondary"
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="si-btn-primary"
              >
                <span className="material-symbols-outlined si-btn-primary-icon">
                  send
                </span>
                Submit Project Idea
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitIdea;