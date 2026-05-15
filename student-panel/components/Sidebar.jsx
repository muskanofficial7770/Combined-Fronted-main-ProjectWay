import React from "react";

const Sidebar = ({
  activePage,
  onNavigate,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  canViewProgress,
  canCreateDiagram,
  canSubmitIdea,
  canViewHelp,
}) => {
  const isEduDashContext =
    activePage === "progress" ||
    activePage === "help" ||
    activePage === "assign-task";

  const NavItem = ({ page, icon, label, filled = false }) => {
    const isActive = activePage === page;
    return (
      <button
        onClick={() => {
          onNavigate(page);
          setIsMobileMenuOpen(false);
        }}
        className={
          "sb-nav-item " +
          (isActive ? "sb-nav-item-active" : "sb-nav-item-inactive")
        }
      >
        <span
          className={
            "material-symbols-outlined sb-nav-item-icon " +
            (filled && isActive ? "sb-nav-item-icon-filled" : "")
          }
        >
          {icon}
        </span>
        <span className="sb-nav-item-label">{label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="sb-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={
          "sb-aside " +
          (isMobileMenuOpen ? "sb-aside-open" : "sb-aside-closed")
        }
      >
        <div className="sb-header">
          <div className="sb-logo-box">
            <span className="material-symbols-outlined sb-logo-icon">
              school
            </span>
          </div>
          <div>
            <h1 className="sb-title">
              {isEduDashContext ? "EduDash" : "StudentHub"}
            </h1>
            <p className="sb-subtitle">
              {isEduDashContext ? "Project Alpha" : "Student Portal"}
            </p>
          </div>
        </div>

        <nav className="sb-nav">
          {!isEduDashContext ? (
            <>
              <NavItem page="dashboard" icon="dashboard" label="Dashboard" />
              {canSubmitIdea && <NavItem page="submit" icon="add_circle" label="Submit Idea" />}
              <NavItem page="feedback" icon="forum" label="Feedback" />
              {canCreateDiagram && <NavItem page="diagram-editor" icon="schema" label="Diagram Editor" />}

              <div className="sb-project-section">
                <p className="sb-project-heading">Projects</p>
                {canViewProgress && <button
                  onClick={() => onNavigate("progress")}
                  className="sb-project-link"
                >
                  <span className="material-symbols-outlined sb-project-icon">
                    rocket_launch
                  </span>
                  <span className="sb-project-label">
                    Project Alpha (EduDash)
                  </span>
                </button>}
              </div>
            </>
          ) : (
            <>
              <div className="sb-back-wrapper">
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="sb-back-btn"
                >
                  <span className="material-symbols-outlined sb-back-icon">
                    arrow_back
                  </span>
                  Back to Portal
                </button>
              </div>

              {canViewProgress && <NavItem
                page="progress"
                icon="trending_up"
                label="Progress Tracking"
                filled
              />}
              <NavItem
                page="assign-task"
                icon="assignment_add"
                label="Assign Task"
                filled
              />
              {canViewHelp && <NavItem page="help" icon="help" label="Help" filled />}
            </>
          )}
        </nav>

        <div className="sb-footer">
          <div className="sb-user-row">
            <div className="sb-user-text">
              <p className="sb-user-name">Jane Doe</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;