import React from 'react'
import { RiMenu3Line } from 'react-icons/ri'

export default function Header({ onMenuClick }) {
  return (
      <header className="admin-mobile-header">
        <button type="button" onClick={onMenuClick} aria-label="Open menu" className="admin-menu-button">
          <RiMenu3Line size="25" />
        </button>
        <span>Admin Panel</span>
      </header>
  )
}
