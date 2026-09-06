import { FiBell, FiMenu, FiSearch } from "react-icons/fi";

export default function Header({ onMenuClick }) {
  return (
    <header className="quiz-header">
      <button
        className="menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <FiMenu />
      </button>
      <div className="header-search">
        <FiSearch />
        <input
          aria-label="Search"
          placeholder="Search quizzes, users or attempts"
        />
      </div>
      <div className="header-actions">
        <button aria-label="Notifications" className="bell">
          <FiBell />
          <i />
        </button>
        <div className="avatar">AN</div>
      </div>
    </header>
  );
}
