import { createElement } from "react";
import { NavLink } from "react-router";
import {
  FiBarChart2,
  FiBookOpen,
  FiCheckSquare,
  FiHelpCircle,
  FiUsers,
  FiX,
} from "react-icons/fi";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: FiBarChart2 },
  { to: "/quizzes", label: "Quiz Management", icon: FiBookOpen },
  { to: "/questions", label: "Question Management", icon: FiHelpCircle },
  { to: "/users", label: "User Management", icon: FiUsers },
  { to: "/attempts", label: "Attempts & Results", icon: FiCheckSquare },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`quiz-sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="brand">
        <span className="brand-mark">Q</span>
        <span>Quiz Nova</span>
      </div>
      <button
        className="sidebar-close"
        onClick={onClose}
        aria-label="Close navigation"
      >
        <FiX />
      </button>
      <p className="nav-label">ADMIN WORKSPACE</p>
      <nav>
        {items.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            {createElement(icon)}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="avatar">AN</div>
        <div>
          <b>Admin Nova</b>
          <small>Administrator</small>
        </div>
      </div>
    </aside>
  );
}
