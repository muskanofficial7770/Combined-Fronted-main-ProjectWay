import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SubmitIdea from "./pages/SubmitIdea";
import Feedback from "./pages/Feedback";
import ProgressTracking from "./pages/ProgressTracking";
import AssignTask from "./pages/AssignTask";
import Help from "./pages/Help";
import DiagramEditor from "./pages/DiagramEditor";
import "./styles/app.css";
import "./styles/dashboard.css";
import "./styles/submit-idea.css";
import "./styles/feedback.css";
import "./styles/progress-tracking.css";
import "./styles/assign-task.css";
import "./styles/help.css";
import "./styles/diagram-editor-main.css";
import "./styles/FileViewer.css";

function App() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentPermissions, setStudentPermissions] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [leaderName, setLeaderName] = useState("");
  const [members, setMembers] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [isGroupProfileSaved, setIsGroupProfileSaved] = useState(false);
  const [leaderPassword, setLeaderPassword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('roles');
    if (saved) {
      const roles = JSON.parse(saved);
      const student = roles.find(r => r.id === '3');
      if (student) {
        setStudentPermissions(student.permissions);
      }
    }
  }, []);

  const canViewProgress = !studentPermissions.includes('progress.track');
  const canCreateDiagram = !studentPermissions.includes('diagram.create');
  const canSubmitIdea = !studentPermissions.includes('idea.submit');
  const canViewHelp = !studentPermissions.includes('help.view');

  const saveProjectName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setProjectName(trimmed);
    setLeaderName("");
    setMembers([]);
    setLeaderPassword("");
    setIsGroupProfileSaved(false);
  };

  const saveGroupTeam = (leader, memberList, password) => {
    setLeaderName(leader.trim());
    setMembers(memberList);
    setLeaderPassword(password);
    setIsGroupProfileSaved(true);
  };

  const handleAddTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === "Completed" ? "Pending" : "Completed",
            }
          : t
      )
    );
  };

  // Save progress data to localStorage whenever it changes
  const saveProgressToLocalStorage = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const progressPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const progressData = {
      projectName: projectName,
      leaderName: leaderName,
      members: members,
      tasks: tasks,
      progress: progressPercentage,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('studentProgressData', JSON.stringify(progressData));
  };

  // Call saveProgressToLocalStorage whenever relevant state changes
  React.useEffect(() => {
    saveProgressToLocalStorage();
  }, [tasks, projectName, leaderName, members]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "submit":
        return canSubmitIdea ? <SubmitIdea /> : <Dashboard />;
      case "feedback":
        return <Feedback />;
      case "progress":
        return canViewProgress ? (
          <ProgressTracking
            tasks={tasks}
            leaderName={leaderName}
            members={members}
            onToggleTask={handleToggleTask}
            projectName={projectName}
            onSaveProject={saveProjectName}
            onSaveTeam={saveGroupTeam}
            isGroupProfileSaved={isGroupProfileSaved}
          />
        ) : <Dashboard />;
      case "assign-task":
        return (
          <AssignTask
            onAddTask={handleAddTask}
            leaderName={leaderName}
            members={members}
            leaderPassword={leaderPassword}
          />
        );
      case "help":
        return canViewHelp ? <Help /> : <Dashboard />;
      case "diagram-editor":
        return canCreateDiagram ? <DiagramEditor /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {/* Simple back button that doesn't interfere with existing layout */}
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

      <div className="app-root">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          canViewProgress={canViewProgress}
          canCreateDiagram={canCreateDiagram}
          canSubmitIdea={canSubmitIdea}
          canViewHelp={canViewHelp}
        />

        <main className="app-main">
          {/* Mobile Header */}
          <header className="app-mobile-header">
            <div className="app-brand">
              <span className="material-symbols-outlined app-brand-icon">
                school
              </span>
              <span className="app-brand-text">StudentHub</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="app-mobile-menu-btn"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </header>

          {/* Scrollable Content Area */}
          <div className="app-content">
            {renderContent()}
            <div className="app-content-spacer" />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
