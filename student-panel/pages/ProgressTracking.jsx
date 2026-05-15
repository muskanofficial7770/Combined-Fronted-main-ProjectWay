import React, { useEffect, useState } from "react";

const ProgressTracking = ({
  tasks,
  leaderName,
  members,
  onToggleTask,
  projectName,
  onSaveProject,
  onSaveTeam,
  isGroupProfileSaved,
}) => {
  const [draftProjectName, setDraftProjectName] = useState("");
  const [leaderDraft, setLeaderDraft] = useState("");
  const [passwordDraft, setPasswordDraft] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [pendingMembers, setPendingMembers] = useState([]);

  useEffect(() => {
    if (!projectName) {
      setDraftProjectName("");
    } else {
      setDraftProjectName(projectName);
    }
  }, [projectName]);

  const handleSaveProjectClick = () => {
    const trimmed = draftProjectName.trim();
    if (!trimmed) return;
    setLeaderDraft("");
    setPasswordDraft("");
    setPendingMembers([]);
    setNewMemberName("");
    onSaveProject(trimmed);
  };

  const handleAddMemberClick = () => {
    const name = newMemberName.trim();
    if (!name || pendingMembers.includes(name)) return;
    setPendingMembers((prev) => [...prev, name]);
    setNewMemberName("");
  };

  const handleRemovePendingMember = (name) => {
    setPendingMembers((prev) => prev.filter((m) => m !== name));
  };

  const handleSaveTeamClick = () => {
    const leader = leaderDraft.trim();
    if (!leader) return;
    if (!passwordDraft.trim()) return;
    onSaveTeam(leader, pendingMembers, passwordDraft.trim());
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const allPeople = leaderName ? [leaderName, ...members] : [...members];
  const memberStats = allPeople.map((person) => {
    const personTasks = tasks.filter((t) => t.assignedTo === person);
    const personTotal = personTasks.length;
    const personCompleted = personTasks.filter(
      (t) => t.status === "Completed"
    ).length;
    const personProgress =
      personTotal === 0
        ? 0
        : Math.round((personCompleted / personTotal) * 100);
    return {
      name: person,
      total: personTotal,
      completed: personCompleted,
      progress: personProgress,
    };
  });

  const renderGroupBlock = () => {
    if (isGroupProfileSaved && projectName) {
      return (
        <div className="pt-card">
          <div className="pt-card-header pt-card-header-muted">
            <h2 className="pt-card-header-title">
              <span className="material-symbols-outlined pt-card-header-icon">
                badge
              </span>
              Your group
            </h2>
          </div>
          <div className="pt-card-body pt-summary-body">
            <div className="pt-summary-row">
              <span className="pt-summary-label">Project name</span>
              <span className="pt-summary-value">{projectName}</span>
            </div>
            <div className="pt-summary-row">
              <span className="pt-summary-label">Leader</span>
              <span className="pt-summary-value">{leaderName}</span>
            </div>
            <div className="pt-summary-row pt-summary-row-stack">
              <span className="pt-summary-label">Members</span>
              <span className="pt-summary-value">
                {members.length > 0 ? members.join(", ") : "None added"}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (!projectName) {
      return (
        <div className="pt-card">
          <div className="pt-card-header pt-card-header-muted">
            <h2 className="pt-card-header-title">
              <span className="material-symbols-outlined pt-card-header-icon">
                folder_special
              </span>
              Step 1 — Project name
            </h2>
          </div>
          <div className="pt-card-body">
            <div className="pt-field">
              <label className="pt-field-label" htmlFor="pt-project-name">
                Project name
              </label>
              <input
                id="pt-project-name"
                type="text"
                value={draftProjectName}
                onChange={(e) => setDraftProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveProjectClick()}
                placeholder="Enter your project name…"
                className="pt-input"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveProjectClick}
              disabled={!draftProjectName.trim()}
              className="pt-primary-btn"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="pt-card pt-card-project-strip">
          <div className="pt-card-body pt-project-strip-body">
            <span className="pt-project-strip-label">Saved project</span>
            <span className="pt-project-strip-name">{projectName}</span>
          </div>
        </div>

        <div className="pt-card">
          <div className="pt-card-header pt-card-header-muted">
            <h2 className="pt-card-header-title">
              <span className="material-symbols-outlined pt-card-header-icon">
                groups
              </span>
              Step 2 — Leader & members
            </h2>
          </div>
          <div className="pt-card-body pt-card-body-step2">
            <div className="pt-field">
              <label className="pt-field-label" htmlFor="pt-leader-name">
                Leader name (you)
              </label>
              <div className="pt-input-icon-wrapper">
                <span className="pt-input-icon">
                  <span className="material-symbols-outlined pt-input-icon-inner">
                    person_check
                  </span>
                </span>
                <input
                  id="pt-leader-name"
                  type="text"
                  value={leaderDraft}
                  onChange={(e) => setLeaderDraft(e.target.value)}
                  placeholder="Type your name here…"
                  className="pt-input pt-input-with-icon"
                />
              </div>
            </div>

            <div className="pt-field">
              <label className="pt-field-label" htmlFor="pt-leader-password">
                Leader password
              </label>
              <input
                id="pt-leader-password"
                type="password"
                value={passwordDraft}
                onChange={(e) => setPasswordDraft(e.target.value)}
                placeholder="Choose a password…"
                className="pt-input"
                autoComplete="new-password"
              />
              <p className="pt-help-text">
                Used when saving your team; it is not shown again on this page.
              </p>
            </div>

            <div className="pt-field">
              <label className="pt-field-label" htmlFor="pt-member-input">
                Add team members
              </label>
              <div className="pt-members-input-row">
                <input
                  id="pt-member-input"
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddMemberClick()
                  }
                  placeholder="Enter member name"
                  className="pt-input pt-input-flex"
                />
                <button
                  type="button"
                  onClick={handleAddMemberClick}
                  className="pt-add-member-btn"
                  aria-label="Add member"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="pt-member-tags">
                {pendingMembers.map((member, idx) => (
                  <div key={`${member}-${idx}`} className="pt-member-tag">
                    <span className="pt-member-tag-name">{member}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePendingMember(member)}
                      className="pt-member-tag-remove"
                    >
                      <span className="material-symbols-outlined pt-member-tag-remove-icon">
                        close
                      </span>
                    </button>
                  </div>
                ))}
                {pendingMembers.length === 0 && (
                  <span className="pt-member-empty">
                    No members added yet (optional).
                  </span>
                )}
              </div>
            </div>

            <div className="pt-field pt-team-save-row">
              <button
                type="button"
                onClick={handleSaveTeamClick}
                disabled={
                  !leaderDraft.trim() || !passwordDraft.trim()
                }
                className="pt-primary-btn"
              >
                Save team
              </button>
              <p className="pt-help-text">
                Saving unlocks Assign Task for the leader name you entered.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="pt-page">
      <div className="pt-header-row">
        <div>
          <h1 className="pt-title">Progress Tracking</h1>
          <p className="pt-subtitle">
            {isGroupProfileSaved
              ? "Your project and group are set. Track tasks below."
              : "Name your project, then add the leader password and members."}
          </p>
        </div>
      </div>

      <div className="pt-grid">
        <div className="pt-left">
          {renderGroupBlock()}

          <div className="pt-card">
            <div className="pt-card-header">
              <h2 className="pt-card-header-title">
                <span className="material-symbols-outlined pt-card-header-icon">
                  list_alt
                </span>
                All Tasks
              </h2>
              <div className="pt-count-badge">{tasks.length} Total</div>
            </div>

            {tasks.length === 0 ? (
              <div className="pt-empty-state">
                <span className="material-symbols-outlined pt-empty-icon">
                  assignment
                </span>
                <p>No tasks assigned yet.</p>
                <p className="pt-empty-sub">Go to &quot;Assign Task&quot; to start.</p>
              </div>
            ) : (
              <div className="pt-table-wrapper">
                <table className="pt-table">
                  <thead className="pt-table-head">
                    <tr>
                      <th className="pt-th pt-th-small">Done</th>
                      <th className="pt-th">Task Name</th>
                      <th className="pt-th">Assigned To</th>
                      <th className="pt-th">Deadline</th>
                      <th className="pt-th">Status</th>
                    </tr>
                  </thead>
                  <tbody className="pt-table-body">
                    {tasks.map((task) => (
                      <tr
                        key={task.id}
                        className={
                          "pt-tr " +
                          (task.status === "Completed"
                            ? "pt-tr-completed"
                            : "")
                        }
                      >
                        <td className="pt-td pt-td-small">
                          <button
                            type="button"
                            onClick={() => onToggleTask(task.id)}
                            className={
                              "pt-done-btn " +
                              (task.status === "Completed"
                                ? "pt-done-btn-completed"
                                : "pt-done-btn-pending")
                            }
                          >
                            {task.status === "Completed" && (
                              <span className="material-symbols-outlined pt-done-check">
                                check
                              </span>
                            )}
                          </button>
                        </td>
                        <td
                          className={
                            "pt-td pt-task-name " +
                            (task.status === "Completed"
                              ? "pt-task-name-completed"
                              : "")
                          }
                        >
                          {task.name}
                        </td>
                        <td className="pt-td">
                          <div
                            className={
                              "pt-assignee " +
                              (task.status === "Completed"
                                ? "pt-assignee-muted"
                                : "")
                            }
                          >
                            <div className="pt-assignee-avatar">
                              {task.assignedTo.charAt(0).toUpperCase()}
                            </div>
                            <span>
                              {task.assignedTo === leaderName
                                ? `${task.assignedTo} (You)`
                                : task.assignedTo}
                            </span>
                          </div>
                        </td>
                        <td
                          className={
                            "pt-td " +
                            (task.status === "Completed"
                              ? "pt-deadline-completed"
                              : "pt-deadline-normal")
                          }
                        >
                          {task.deadline}
                        </td>
                        <td className="pt-td">
                          <span
                            className={
                              "pt-status-pill " +
                              (task.status === "Completed"
                                ? "pt-status-pill-completed"
                                : "pt-status-pill-pending")
                            }
                          >
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="pt-right">
          <div className="pt-card">
            <h3 className="pt-card-header-title pt-card-title-with-icon">
              <span className="material-symbols-outlined pt-card-header-icon">
                analytics
              </span>
              Overall Progress
            </h3>
            <div className="pt-progress-circle-wrapper">
              <div className="pt-progress-circle">
                <svg
                  className="pt-progress-svg"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="pt-progress-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="pt-progress-fg"
                    strokeDasharray={`${progressPercentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
                <div className="pt-progress-center">
                  <span className="pt-progress-percent">
                    {progressPercentage}%
                  </span>
                  <span className="pt-progress-label">Complete</span>
                </div>
              </div>
            </div>
            <div className="pt-progress-summary">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          </div>

          <div className="pt-card">
            <h3 className="pt-card-header-title">Member Contributions</h3>
            <div className="pt-member-stats">
              {memberStats.length === 0 ? (
                <p className="pt-member-stats-empty">
                  Complete team setup to see stats.
                </p>
              ) : (
                memberStats.map((stat, idx) => (
                  <div key={idx} className="pt-member-stat">
                    <div className="pt-member-stat-header">
                      <div className="pt-member-stat-left">
                        <div className="pt-member-stat-avatar">
                          {stat.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="pt-member-stat-name">
                          {stat.name === leaderName
                            ? `${stat.name} (You)`
                            : stat.name}
                        </span>
                      </div>
                      <span className="pt-member-stat-count">
                        {stat.completed}/{stat.total} Done
                      </span>
                    </div>
                    <div className="pt-member-stat-bar">
                      <div
                        className="pt-member-stat-bar-fill"
                        style={{
                          width:
                            stat.total === 0
                              ? "0%"
                              : `${(stat.completed / stat.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;
