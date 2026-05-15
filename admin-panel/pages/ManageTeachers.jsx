import React, { useState } from 'react';
import '../styles/ManageTeachers.css';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Dr. Emily Clarke",
      email: "emily.clarke@university.edu",
      initials: "EC",
      colorClass: "teacher-avatar-blue",
    },
    {
      id: 2,
      name: "Prof. Alan Grant",
      email: "alan.grant@university.edu",
      initials: "AG",
      colorClass: "teacher-avatar-amber",
    },
    {
      id: 3,
      name: "Mark Wahlberg",
      email: "mark.w@university.edu",
      initials: "MW",
      colorClass: "teacher-avatar-emerald",
    },
    {
      id: 4,
      name: "Sarah Connor",
      email: "sarah.c@university.edu",
      initials: "SC",
      colorClass: "teacher-avatar-purple",
    },
  ]);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddTeacher = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newName || !newEmail) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      if (!newEmail.includes('@')) {
        setErrorMessage("Email is missing '@' symbol");
      } else if (!newEmail.includes('.')) {
        setErrorMessage("Email is missing domain extension (e.g., .com)");
      } else if (newEmail.split('@')[1].split('.')[0].length === 0) {
        setErrorMessage("Email is missing domain name after '@'");
      } else if (newEmail.split('.')[1].length < 2) {
        setErrorMessage("Email domain extension is too short (e.g., .com)");
      } else {
        setErrorMessage("Invalid email format. Use format: name@gmail.com");
      }
      return;
    }

    // Additional validation for domain name length and TLD
    const domainParts = newEmail.split('@');
    const domain = domainParts[1];
    const domainName = domain.split('.')[0];
    const tld = domain.split('.')[1];

    if (domainName.length < 3) {
      setErrorMessage("Domain name is too short. Use format: name@gmail.com");
      return;
    }

    const validTLDs = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'int', 'io', 'co', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'es', 'it', 'jp', 'cn', 'in', 'br', 'mx', 'ru', 'za', 'nl', 'se', 'no', 'dk', 'fi', 'pl', 'ch', 'at', 'be', 'gr', 'pt', 'ie', 'hu', 'cz', 'sk', 'si', 'hr', 'ba', 'rs', 'bg', 'ro', 'ua', 'by', 'kz', 'uz', 'kg', 'tj', 'tm', 'ge', 'am', 'az', 'tr', 'cy', 'il', 'jo', 'lb', 'sy', 'iq', 'ir', 'pk', 'af', 'bd', 'lk', 'np', 'bt', 'mm', 'th', 'vn', 'kh', 'la', 'my', 'sg', 'id', 'ph', 'tw', 'hk', 'mo', 'kr', 'kp', 'mn'];
    
    if (!validTLDs.includes(tld.toLowerCase())) {
      setErrorMessage("Invalid domain extension. Use valid TLD like .com, .net, .org, .edu");
      return;
    }

    const initials = newName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const colorClasses = [
      "teacher-avatar-blue",
      "teacher-avatar-amber",
      "teacher-avatar-emerald",
      "teacher-avatar-purple",
      "teacher-avatar-pink",
      "teacher-avatar-indigo",
    ];
    const randomColorClass =
      colorClasses[Math.floor(Math.random() * colorClasses.length)];

    const newTeacher = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      initials,
      colorClass: randomColorClass,
    };

    setTeachers([newTeacher, ...teachers]);
    setFilteredTeachers([newTeacher, ...teachers]);
    setNewName("");
    setNewEmail("");
  };

  const handleDelete = (id) => {
    const updatedTeachers = teachers.filter((t) => t.id !== id);
    setTeachers(updatedTeachers);
    
    // Also update filtered teachers
    const updatedFiltered = filteredTeachers.filter((t) => t.id !== id);
    setFilteredTeachers(updatedFiltered);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Auto-filter as user types
    const filtered = teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };

  return (
    <div className="manage-teachers-root">
      <div className="manage-teachers-header-row">
        <div>
          <h2 className="manage-teachers-title">Manage Teachers</h2>
          <p className="manage-teachers-subtitle">
            Easily add, manage and view all teacher information here.
          </p>
        </div>
      </div>

      {/* Add New Teacher */}
      <section className="manage-teachers-card">
        <div className="manage-teachers-card-header">
          <h3 className="manage-teachers-card-title">Add New Teacher</h3>
        </div>
        <div className="manage-teachers-card-body">
          <form
            className="manage-teachers-form"
            onSubmit={handleAddTeacher}
          >
            <div className="manage-teachers-form-col">
              <label className="manage-teachers-label">Full Name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="manage-teachers-input"
                placeholder="Enter teacher full name"
                type="text"
              />
            </div>
            <div className="manage-teachers-form-col">
              <label className="manage-teachers-label">Email</label>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="manage-teachers-input"
                placeholder="Enter teacher email"
                type="email"
              />
            </div>
            <button
              type="submit"
              className="manage-teachers-add-btn"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add Teacher</span>
            </button>
            {errorMessage && (
              <div className="manage-teachers-error-message">
                <span className="material-symbols-outlined">error</span>
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Existing Teachers */}
      <section className="manage-teachers-table-card">
        <div className="manage-teachers-table-header">
          <h3 className="manage-teachers-card-title">Teachers List</h3>
          <div className="manage-teachers-search-wrapper">
            <span className="manage-teachers-search-icon">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="manage-teachers-search-input"
              placeholder="Search teachers..."
              type="text"
            />
          </div>
        </div>

        <div className="manage-teachers-table-wrapper">
          <table className="manage-teachers-table">
            <thead className="manage-teachers-thead">
              <tr>
                <th className="manage-teachers-th">Name</th>
                <th className="manage-teachers-th">Email</th>
              </tr>
            </thead>
            <tbody className="manage-teachers-tbody">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="manage-teachers-row"
                  >
                    <td className="manage-teachers-td">
                      <div className="manage-teachers-name-cell">
                        <div
                          className={
                            "manage-teachers-avatar " + teacher.colorClass
                          }
                        >
                          {teacher.initials}
                        </div>
                        <span className="manage-teachers-name">
                          {teacher.name}
                        </span>
                      </div>
                    </td>
                    <td className="manage-teachers-td">
                      {teacher.email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="manage-teachers-empty"
                  >
                    No teachers found. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="manage-teachers-footer">
          <span className="manage-teachers-footer-text">
            Showing {filteredTeachers.length} teachers
          </span>
        </div>
      </section>
    </div>
  );
};

export default ManageTeachers;